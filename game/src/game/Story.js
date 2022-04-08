import { makeStyles } from "@material-ui/core/styles";
import dialogBorderBox from "./assets/images/dialog_borderbox.png";

const useStyles = makeStyles((theme) => ({
  dialogWindow: ({ width, height, multiplier }) => {
    const messageBoxHeight = Math.ceil((height / 3.5) * multiplier);
    return {
      imageRendering: "pixelated",
      // fontFamily: '"Press Start 2P"',
      textTransform: "uppercase",
      backgroundColor: "#e2b27e",
      border: "solid",
      borderImage: `url("${dialogBorderBox}") 6 / ${6 * multiplier}px ${
        6 * multiplier
      }px ${6 * multiplier}px ${6 * multiplier}px stretch`,
      padding: `${8 * multiplier}px`,
      position: "absolute",
      top: "10px",
      width: `${Math.ceil(width * 0.8 * multiplier)}px`,
      left: "50%",
      transform: "translate(-50%, 0%)",
      minHeight: `${messageBoxHeight}px`,
    };
  },
  dialogTitle: ({ multiplier }) => ({
    fontSize: `${8 * multiplier}px`,
    marginBottom: `${6 * multiplier}px`,
    fontWeight: "bold",
  }),
  dialogFooter: ({ multiplier }) => ({
    fontSize: `${8 * multiplier}px`,
    cursor: "pointer",
    textAlign: "end",
    position: "absolute",
    right: `${6 * multiplier}px`,
    bottom: `${6 * multiplier}px`,
  }),
}));

export default function Story({
  messages,
  characterName,
  onDone,
  gameSize,
  setHeroCoins,
  question,
  setHeroHealthStates,
  setQuestionIndex,
  heroHealthStates,
}) {
  const { width, height, multiplier } = gameSize;
  const classes = useStyles({
    width,
    height,
    multiplier,
  });
  const handleClick = () => {};
  console.log("hahah");
  return (
    <div className={classes.dialogWindow}>
      <div className={classes.dialogTitle}>Quả gì?</div>
      {/* <Message
          action={messages[currentMessage].action}
          message={messages[currentMessage].message}
          key={currentMessage}
          multiplier={multiplier}
          forceShowFullMessage={forceShowFullMessage}
          onMessageEnded={() => {
            setMessageEnded(true);
          }}
        /> */}
      <div onClick={handleClick} className={classes.dialogFooter}>
        Bỏ qua
      </div>
    </div>
  );
}
