import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const navigate_to_create_room = () => {
    navigate("/create-room");
  };
  const navigate_to_receive = () => {
    navigate("/receive");
  };
  return (
    <div className="home_body">
      <h2 className="title-inst">
        <span className="title-word title-word-1">Instantly</span>
        <span className="title-word title-word-2">Share</span>
        <span className="title-word title-word-3">Your</span>
        <span className="title-word title-word-4">Files</span>
      </h2>
      <div className="home_body">
        <img
          src="/src/assets/images/sharing img.png"
          alt=""
          height="50%"
          width="50%"
        />
      </div>

      <div className="button_container">
        <button onClick={navigate_to_create_room} className="btn btn-primary">
          Send
        </button>
        <button onClick={navigate_to_receive} className="btn btn-primary">
          Receive
        </button>
      </div>
    </div>
  );
}

export default Home;
