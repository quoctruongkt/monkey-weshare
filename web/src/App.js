import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
const host = "http://localhost:3000";

function App() {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState("");
  const [id, setId] = useState();
  const [roomId, setRoomId] = useState();
  const [name, setName] = useState();

  const socketRef = useRef();
  const messagesEnd = useRef();

  var query = window.location.search.substring(1);
  console.log(query);

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    console.log(query); //"app=article&act=news_content&aid=160990"
    var vars = query.split("&");
    console.log(vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
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
    console.log(roomId);

    socketRef.current = socketIOClient.connect(host, {
      auth: {
        name: name,
      },
    });

    socketRef.current.on("getId", (data) => {
      setId(data);
    });

    socketRef.current.on("setUser", (data) => {
      console.log(data);
    });

    socketRef.current.on("listUser", (data) => {
      console.log(data);
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

  console.log(mess);
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

  return (
    <div class="box-chat">
      <div class="box-chat_message">
        {renderMess}
        <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <div class="send-box">
        <textarea
          value={message}
          onKeyDown={onEnterPress}
          onChange={handleChange}
          placeholder="Nhập tin nhắn ..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
