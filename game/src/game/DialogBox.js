import { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import dungAudio from "./assets/audio/dung.mp3";
import saiAudio from "./assets/audio/sai.wav";
import micro from "./assets/images/micro.png";
import unmic from "./assets/images/unmic.png";
import useSpeechToText from "react-hook-speech-to-text";

// Images
import dialogBorderBox from "./assets/images/dialog_borderbox.png";

// Components
import Message from "./Message";
import ReactAudioPlayer from "react-audio-player";

const useStyles = makeStyles((theme) => ({
  dialogWindow: ({ width, height, multiplier }) => {
    const messageBoxHeight = Math.ceil((height / 3.5) * multiplier);
    return {
      imageRendering: "pixelated",
      fontFamily: '"Press Start 2P"',
      textTransform: "uppercase",
      backgroundColor: "#e2b27e",
      border: "solid",
      borderImage: `url("${dialogBorderBox}") 6 / ${6 * multiplier}px ${
        6 * multiplier
      }px ${6 * multiplier}px ${6 * multiplier}px stretch`,
      padding: `${8 * multiplier}px`,
      position: "absolute",
      top: `${Math.ceil(
        height * multiplier - (messageBoxHeight + messageBoxHeight * 0.1) - 50
      )}px`,
      width: `${Math.ceil(width * 0.8 * multiplier)}px`,
      left: "50%",
      transform: "translate(-50%, 0%)",
      minHeight: `${messageBoxHeight}px`,
    };
  },
  dialogTitle: ({ multiplier }) => ({
    fontSize: `${16 * multiplier}px`,
    marginBottom: `${6 * multiplier}px`,
    fontWeight: "bold",
  }),
  dialogFooter: ({ multiplier }) => ({
    fontSize: `${12 * multiplier}px`,
    cursor: "pointer",
    textAlign: "end",
    position: "absolute",
    right: `${6 * multiplier}px`,
    bottom: `${6 * multiplier}px`,
  }),
  buttonSubmit: ({ multiplier }) => ({
    fontSize: `${16 * multiplier}px`,
    marginLeft: "20px",
    fontSize: "32px",
    marginLeft: "20px",
    outline: "none",
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    fontWeight: "bold",
    color: "darkblue",
  }),
  input: ({ multiplier }) => ({
    fontSize: `${8 * multiplier}px`,
  }),
}));

const DialogBox = ({
  messages,
  characterName,
  onDone,
  gameSize,
  setHeroCoins,
  question,
  setHeroHealthStates,
  setQuestionIndex,
  heroHealthStates,
}) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const { register, handleSubmit } = useForm();
  const { width, height, multiplier } = gameSize;

  const [currentMessage, setCurrentMessage] = useState(0);
  const [messageEnded, setMessageEnded] = useState(false);
  const [forceShowFullMessage, setForceShowFullMessage] = useState(false);
  const [result, setResults] = useState("");
  const [urlAudio, setUrlAudio] = useState("");
  const [mic, setMic] = useState(true);
  const [text, setText] = useState("");
  const classes = useStyles({
    width,
    height,
    multiplier,
  });

  const onSubmit = (data) => {
    const input = data.textInput.toLowerCase();
    if (input === messages[0].answer) {
      setHeroCoins((pre) => pre + 5);
      setUrlAudio(dungAudio);
      setResults("????ng r???i");
    } else {
      setUrlAudio(saiAudio);
      setHeroCoins((pre) => pre - 5);
      setResults("Sai r???i");
    }
  };

  const handleClick = useCallback(() => {
    if (characterName === question) {
      if (messageEnded) {
        setMessageEnded(false);
        setForceShowFullMessage(false);
        if (currentMessage < messages.length - 1) {
          setCurrentMessage(currentMessage + 1);
        } else {
          setCurrentMessage(0);
          onDone();
          setQuestionIndex((pre) => pre + 1);
        }
      } else {
        setMessageEnded(true);
        setForceShowFullMessage(true);
      }
    } else {
      onDone();
    }
  }, [currentMessage, messageEnded, messages.length, onDone]);

  useEffect(() => {
    const handleKeyPressed = (e) => {
      if (["Space", "Escape"].includes(e.code)) {
        handleClick();
      }
    };
    window.addEventListener("keydown", handleKeyPressed);

    return () => window.removeEventListener("keydown", handleKeyPressed);
  }, [handleClick]);

  useEffect(() => {
    if (characterName !== question) {
      setHeroHealthStates(
        heroHealthStates.filter((item, i) => i !== heroHealthStates.length - 1)
      );
      setUrlAudio(saiAudio);
    } else {
      setHeroCoins((pre) => pre + 5);
      // setUrlAudio(dungAudio);
    }
  }, []);

  useEffect(() => {
    setText(results[results?.length - 1]?.transcript);
    if (
      results[results?.length - 1]?.transcript?.toLowerCase() ==
      messages[0].answer
    ) {
      console.log(results[0]?.transcript?.toLowerCase());
      setHeroCoins((pre) => pre + 5);
      setUrlAudio(dungAudio);
      setMic(false);
      stopSpeechToText();
    } else {
      stopSpeechToText();
    }
  }, [results]);

  return (
    <div className={classes.dialogWindow}>
      <ReactAudioPlayer
        src={urlAudio}
        autoPlay
        controls
        style={{ display: "none" }}
        onEnded={() => setUrlAudio("")}
      />
      <div className={classes.dialogTitle}>Qu??? g???</div>
      {characterName === question ? (
        <>
          <Message
            action={messages[currentMessage].action}
            message={messages[currentMessage].message}
            key={currentMessage}
            multiplier={multiplier}
            forceShowFullMessage={forceShowFullMessage}
            onMessageEnded={() => {
              setMessageEnded(true);
            }}
          />
          {/* {!result ? ( */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginTop: "30px" }}>
              {!result ? (
                <>
                  <input
                    type="text"
                    {...register("textInput")}
                    placeholder="Nh???p t??? v???a nghe ???????c"
                    className={classes.input}
                    style={{
                      outline: "none",
                      border: "none",
                      borderRadius: "5px",
                      height: "50px",
                      fontWeight: "bolder",
                      color: "tomato",
                      textAlign: "center",
                      fontSize: "25px",
                    }}
                  />
                  <button type="submit" className={classes.buttonSubmit}>
                    Ki???m tra +5
                  </button>
                </>
              ) : (
                <span>{result}</span>
              )}

              {mic && (
                <button
                  type="button"
                  className={classes.buttonSubmit}
                  onClick={isRecording ? stopSpeechToText : startSpeechToText}
                >
                  <img src={isRecording ? unmic : micro} height={25} />
                  {isRecording ? "" : "+5"}
                </button>
              )}
              {text && <span style={{ marginLeft: "15px" }}>{text}</span>}
            </div>
          </form>
          {/* ) : (
            <div>{result}</div>
          )} */}
        </>
      ) : (
        <div>B???n ???? ch???n sai</div>
      )}
      <div onClick={handleClick} className={classes.dialogFooter}>
        B??? qua
      </div>
    </div>
  );
};

export default DialogBox;
