import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import socketIOClient from "socket.io-client";

import Phaser from "phaser";
import GridEngine from "grid-engine";
import BootScene from "./game/scenes/BootScene";
import MainMenuScene from "./game/scenes/MainMenuScene";
import GameOverScene from "./game/scenes/GameOverScene";
import GameScene from "./game/scenes/GameScene";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Backdrop, Fade, Modal, StepIcon, Typography } from "@material-ui/core";
import dialogBorderBox from "./game/assets/images/dialog_borderbox.png";
import GameMenu from "./game/GameMenu";
import DialogBox from "./game/DialogBox";
import HeroCoin from "./game/HeroCoin";
import HeroHealth from "./game/HeroHealth";
import "./App.css";
import { calculateGameSize } from "./game/utils";
import ReactAudioPlayer from "react-audio-player";
import apple from "./game/assets/audio/apple.mp3";
import volume from "./game/assets/images/volume.png";
import trophy from "./game/assets/images/trophy.png";
import Story from "./game/Story";

const { width, height, multiplier } = calculateGameSize();
const host = "http://localhost:3000";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "auto",
  },
  postContainer: {
    maxWidth: "90%",
    maxHeight: "90%",
  },
  gameContentWrapper: {
    width: `${width * multiplier}px`,
    height: `${height * multiplier}px`,
    margin: "auto",
    padding: 0,
    overflow: "hidden",
    "& canvas": {
      imageRendering: "pixelated",
      "-ms-interpolation-mode": "nearest-neighbor",
      boxShadow: "0px 0px 0px 3px rgba(0,0,0,0.75)",
    },
  },
  pageWrapper: {
    background: theme.palette.background.paper,
    padding: 0,
    margin: 0,
  },
  loadingText: {
    fontFamily: '"Press Start 2P"',
    marginTop: "30px",
    marginLeft: "30px",
  },
  preLoadDialogImage: {
    backgroundImage: `url("${dialogBorderBox}")`,
    backgroundSize: "1px",
    backgroundRepeat: "no-repeat",
  },
  gameWrapper: {
    color: "#FFFFFF",
  },
  gameGif: {
    width: "100%",
    position: "absolute",
    imageRendering: "pixelated",
    top: 0,
  },
}));

const url = "https://vysqy4zclvobj.vcdn.cloud/E_Learning/page/";

const dialogs = {
  npc_01: [
    {
      message: "Hello",
    },
  ],
  npc_02: [
    {
      message: "Hello there",
    },
  ],
  npc_03: [
    {
      message: "Hi",
    },
  ],
  npc_04: [
    {
      message: "Hey",
    },
  ],
  sword: [
    {
      message:
        "Newton ph??t hi???n ra ?????nh lu???t h???p d???n sau khi b??? qu??? g?? r??i v??o ?????u?",
      answer: "apple",
      audio: apple,
    },
  ],
  apple: [
    {
      message: "Qu??? g?? khi ch??n ????? t????i. ??n v??o ng???t m??t, da th???i ?????p h??n?",
      answer: "apple",
      audio: "apple.mp3",
      story: "Qu??? g?? khi ch??n ????? t????i. ??n v??o ng???t m??t, da th???i ?????p h??n?",
    },
  ],
  watermelon: [
    {
      message: "Qu??? g?? n???i ti???ng trong s??? t??ch Mai An Ti??m?",
      answer: "watermelon",
      audio: "water_melon.mp3",
    },
  ],
  pineapple: [
    {
      message: "Qu??? g?? c?? nhi???u m???t nh???t?",
      answer: "pineapple",
      audio: "pineapple.mp3",
    },
  ],
  orange: [
    {
      message: "Qu??? g?? b??? sung nhi???u vitamin C cho c?? th????",
      answer: "orange",
      audio: "orange.mp3",
    },
  ],
  mango: [
    {
      message:
        "L???ng li???ng tr??u tr???t c??nh cao. Nghe t??n c??? ng??? ng?? nh??o ?????t ??en?",
      answer: "mango",
      audio: "mango.mp3",
    },
  ],
  cherries: [
    {
      message: "Qu??? g?? m??u ????? ??n r???t ngon?",
      answer: "cherry",
      audio: "cherry.mp3",
    },
  ],
  banana: [
    {
      message: "V??? qu??? n??y d???m ph???i r???t d??? ng?? ???? nha",
      answer: "banana",
      audio: "banana.mp3",
    },
  ],
  avocado: [
    {
      message:
        "Da th?? ??en m?????t, Ru???t tr???ng h??n ng??, M??i v??? ?????m ????, ?????t ??i l?? ?????t - L?? qu??? g???",
      answer: "avocado",
      audio: "avocado.mp3",
    },
  ],
  push: [
    {
      message: "You can push boxes now",
    },
  ],
  sign_01: [
    {
      message: "You can read this!",
    },
  ],
  book_01: [
    {
      message: "Welcome to the game!",
    },
  ],
};

const arrQuestion = [
  "apple",
  "watermelon",
  "orange",
  "pineapple",
  "cherries",
  "mango",
  "banana",
  "avocado",
];

function App() {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [characterName, setCharacterName] = useState("");
  const [gameMenuItems, setGameMenuItems] = useState(["hihi"]);
  const [gameMenuPosition, setGameMenuPosition] = useState("center");
  const [heroHealthStates, setHeroHealthStates] = useState([
    "full",
    "full",
    "full",
  ]);
  const [heroCoins, setHeroCoins] = useState(0);
  const [urlAudio, setUrlAudio] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [story, setStory] = useState("");

  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  const [roomId, setRoomId] = useState();
  const [name, setName] = useState();
  const [point, setPoint] = useState();
  const [listUser, setListUser] = useState();
  const socketRef = useRef();
  const messagesEnd = useRef();

  var query = window.location.search.substring(1);

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  useEffect(() => {
    const roomId = getQueryVariable("roomid");
    const name = getQueryVariable("name");
    setRoomId(roomId);
    setName(name);

    socketRef.current = socketIOClient.connect(host, {
      auth: {
        name: getQueryVariable("name"),
      },
    });

    socketRef.current.on("getId", (data) => {
      setId(data);
    });

    socketRef.current.on("setUser", (data) => {
      console.log(data);
    });
    // socketRef.current.on("changedRank", (data) => {
    //   console.log(data);
    // });

    socketRef.current.on("listUser", (data) => {
      setListUser(data.listUser);
    });

    socketRef.current.emit("create", `room${roomId}`);

    socketRef.current.on("sendDataServer", (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect((id) => {
        console.log("disconnect");
      });
    };
  }, []);

  useEffect(() => {
    if (roomId && name) {
      updatePoint(heroCoins);
    }
  }, [heroCoins]);

  const updatePoint = (currentPoint) => {
    console.log(name);
    let point = {
      id: id,
      point: currentPoint,
      roomId: `room${roomId}`,
      name: name,
    };
    setPoint(point);
  };

  useEffect(() => {
    if (roomId && name) {
      socketRef.current.emit("changedRank", point);
    }
  }, [point]);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id: id,
        roomId: `room${roomId}`,
      };
      socketRef.current.emit("sendDataClient", msg);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const renderMess = mess.map((m, index) => (
    <div
      key={index}
      className={`${m.id === id ? "your-message" : "other-people"} chat-item`}
    >
      {m.content}
    </div>
  ));

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      sendMessage();
    }
  };

  const handleMessageIsDone = useCallback(() => {
    const customEvent = new CustomEvent(`${characterName}-dialog-finished`, {
      detail: {},
    });
    window.dispatchEvent(customEvent);

    setMessages([]);
    setCharacterName("");
  }, [characterName]);

  const handleMenuItemSelected = useCallback((selectedItem) => {
    setGameMenuItems([]);

    const customEvent = new CustomEvent("menu-item-selected", {
      detail: {
        selectedItem,
      },
    });
    window.dispatchEvent(customEvent);
  }, []);

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      title: "some-game-title",
      parent: "game-content",
      orientation: Phaser.Scale.LANDSCAPE,
      localStorageName: "some-game-title",
      width,
      height,
      autoRound: true,
      pixelArt: true,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.ENVELOP,
      },
      scene: [BootScene, MainMenuScene, GameScene, GameOverScene],
      physics: {
        default: "arcade",
      },
      plugins: {
        scene: [
          {
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ],
      },
      backgroundColor: "#000000",
    });

    window.phaserGame = game;
  }, []);

  useEffect(() => {
    if (gameMenuItems.length == 0) {
      console.log("start");
      const question = arrQuestion[questionIndex];
      localStorage.setItem("question", question);
      setUrlAudio(`${url}${dialogs[question][0].audio}`);
      setStory(dialogs[question][0].story);
    }
  }, [questionIndex, gameMenuItems]);

  useEffect(() => {
    const dialogBoxEventListener = ({ detail }) => {
      // TODO fallback
      detail.characterName === arrQuestion[questionIndex] &&
        setUrlAudio(`${url}${dialogs[detail.characterName][0].audio}`);
      setCharacterName(detail.characterName);
      setMessages(dialogs[detail.characterName]);
    };
    window.addEventListener("new-dialog", dialogBoxEventListener);

    const gameMenuEventListener = ({ detail }) => {
      setGameMenuItems(detail.menuItems);
      setGameMenuPosition(detail.menuPosition);
    };
    window.addEventListener("menu-items", gameMenuEventListener);

    const heroHealthEventListener = ({ detail }) => {
      // console.log(detail);
      setHeroHealthStates(detail.healthStates);
    };
    window.addEventListener("hero-health", heroHealthEventListener);

    const heroCoinEventListener = ({ detail }) => {
      // setHeroCoins(detail.heroCoins);
    };
    window.addEventListener("hero-coin", heroCoinEventListener);

    return () => {
      window.removeEventListener("new-dialog", dialogBoxEventListener);
      window.removeEventListener("menu-items", gameMenuEventListener);
      window.removeEventListener("hero-health", heroHealthEventListener);
      window.removeEventListener("hero-coin", heroCoinEventListener);
    };
  }, [setCharacterName, setMessages]);

  return (
    <div>
      {gameMenuItems.length == 0 && (
        <div class="leaderboard">
          <h1>
            <img src={trophy} />
            Leader Board
          </h1>
          <ol>
            {listUser
              ?.sort((a, b) => (a.point < b.point ? 1 : -1))
              ?.map((user, i) => {
                return (
                  <li key={i}>
                    {user.name} <span> {user.point}</span>
                  </li>
                );
              })}
          </ol>
        </div>
      )}
      <ReactAudioPlayer
        src={urlAudio}
        autoPlay={true}
        controls
        style={{ display: "none" }}
        onEnded={() => setUrlAudio("")}
      />
      <div className={classes.gameWrapper}>
        <div id="game-content" className={classes.gameContentWrapper}>
          {/* this is where the game canvas will be rendered */}
        </div>
        {gameMenuItems.length === 0 && (
          <button
            onClick={() =>
              setUrlAudio(
                `${url}${dialogs[localStorage.getItem("question")][0].audio}`
              )
            }
            style={{
              position: "fixed",
              right: "500px",
              top: "40px",
              backgroundColor: "transparent",
              border: 0,
              cursor: "pointer",
            }}
          >
            <img src={volume} />
          </button>
        )}
        {heroHealthStates.length > 0 && (
          <HeroHealth
            gameSize={{
              width,
              height,
              multiplier,
            }}
            healthStates={heroHealthStates}
          />
        )}
        {heroCoins !== null && (
          <HeroCoin
            gameSize={{
              width,
              height,
              multiplier,
            }}
            heroCoins={heroCoins}
          />
        )}
        {messages.length > 0 && (
          <DialogBox
            onDone={handleMessageIsDone}
            characterName={characterName}
            messages={messages}
            gameSize={{
              width,
              height,
              multiplier,
            }}
            setHeroCoins={setHeroCoins}
            setHeroHealthStates={setHeroHealthStates}
            question={arrQuestion[questionIndex]}
            setQuestionIndex={setQuestionIndex}
            heroHealthStates={heroHealthStates}
          />
        )}
        {story && (
          <Story
            story={story}
            gameSize={{
              width,
              height,
              multiplier,
            }}
            setStory={setStory}
          />
        )}
        {gameMenuItems.length > 0 && (
          <GameMenu
            items={gameMenuItems}
            gameSize={{
              width,
              height,
              multiplier,
            }}
            position={gameMenuPosition}
            onSelected={handleMenuItemSelected}
          />
        )}
      </div>
    </div>
  );
}

export default App;
