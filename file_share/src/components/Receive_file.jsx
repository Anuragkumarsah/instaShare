import { nanoid } from "nanoid";

import React, { useEffect, useRef, useState } from "react";
import Title from "./Title";

function Receive_file({ socket }) {
  const sender_uid = useRef();
  const file = useRef({});
  const [downloadAble, setDownoadAble] = useState(false);

  useEffect(() => {
    const meta_handler = (metaData) => {
      file.current.metaData = metaData;
      file.current.transmitted = 0;
      file.current.buffer = [];
      socket.emit("file_share_start", {
        sender_uid: sender_uid.current,
      });
    };
    socket.off("get_meta_data").on("get_meta_data", meta_handler);

    const raw_file_handler = (buffer) => {
      file.current.buffer.push(buffer);
      file.current.transmitted += buffer.byteLength;
      console.log(
        (file.current.transmitted / file.current.metaData.total_buffer_size) *
          100
      );
      if (file.current.transmitted == file.current.metaData.total_buffer_size) {
        setDownoadAble((downloadAble) => {
          return true;
        });
        return;
      } else {
        socket.emit("file_share_start", {
          sender_uid: sender_uid.current,
        });
      }
    };

    socket.off("get_raw_file").on("get_raw_file", raw_file_handler);

    return () => {
      socket.removeListener("get_meta_data", meta_handler);
      socket.off("get_meta_data");
      socket.removeAllListeners("get_meta_data");
      socket.removeListener("get_raw_file", raw_file_handler);
      socket.off("get_raw_file");
      socket.removeAllListeners("get_raw_file");
    };
  }, []);

  const download = (blob, file_name) => {
    if (window.navigator && window.navigator.msSaveOrOpenBlob)
      return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = data;
    link.download = file_name;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    setTimeout(() => {
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);
  };

  const connect_to_sender = () => {
    sender_uid.current = document.querySelector("#join-id").value;
    if (!sender_uid.current) {
      alert("Please enter the 8 digit unique room ID");
      return;
    }
    const receiver_uid = nanoid(8);
    socket.emit("receiver_join", {
      sender_uid: sender_uid.current,
      receiver_uid: receiver_uid,
    });
    const bf_connection = document.getElementById("bf_connection");
    bf_connection.classList.add("screen");
  };

  const handle_download = () => {
    download(new Blob(file.current.buffer), file.current.metaData.fileName);
  };

  return (
    <div>
      <Title />
      <div id="bf_connection">
        <div>
          <label> Join ID </label>
          <input id="join-id" type="text" />
        </div>
        <div>
          <button className="btn btn-primary" onClick={connect_to_sender}>
            Connect
          </button>
        </div>
      </div>
      {downloadAble === true && (
        <div>
          <button className="btn btn-primary" onClick={handle_download}>
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default Receive_file;
