import { makeStyles } from "@material-ui/core/styles";
import dialogBorderBox from "./assets/images/dialog_borderbox.png";
import Message from "./Message";

const useStyles = makeStyles((theme) => ({
  dialogWindow: ({ width, height, multiplier }) => {
    const messageBoxHeight = Math.ceil((height / 10) * multiplier);
    return {
      imageRendering: "pixelated",
      // fontFamily: '"Press Start 2P"',
      textTransform: "uppercase",
      backgroundColor: "rgba(226, 178, 126, 0.2)",
      border: "dotted",
      //   borderImage: `url("${dialogBorderBox}") 6 / ${6 * multiplier}px ${
      //     6 * multiplier
      //   }px ${6 * multiplier}px ${6 * multiplier}px stretch`,
      padding: `${8 * multiplier}px`,
      position: "absolute",
      top: "10px",
      width: `${Math.ceil(width * 0.4 * multiplier)}px`,
      left: "40%",
      transform: "translate(-50%, 0%)",
      minHeight: `${messageBoxHeight}px`,
      color: "white",
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

export default function Story({ gameSize, story, setStory }) {
  const { width, height, multiplier } = gameSize;
  const classes = useStyles({
    width,
    height,
    multiplier,
  });
  const handleClick = () => {
    setStory("");
  };
  return (
    <div className={classes.dialogWindow}>
      <div className={classes.dialogTitle}>Quả gì?</div>
      <Message message={story} />
      <div onClick={handleClick} className={classes.dialogFooter}>
        Bỏ qua
      </div>
    </div>
  );
}
