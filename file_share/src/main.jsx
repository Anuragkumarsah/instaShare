import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5001");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
