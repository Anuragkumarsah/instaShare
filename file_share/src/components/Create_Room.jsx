import React, { useEffect, useMemo, useRef, useState } from "react";
import { nanoid } from "nanoid";
import Title from "./Title";
import DropFileInput from "./DropFileInput";

function Create_Room({ socket }) {
  const receiver_uid = useRef();
  const join_screen = useRef();
  const room_screen = useRef();
  const [sender_uid, setSender_uid] = useState("");
  const [file, onFileChange] = useState();
  // const join_screen = useMemo(() => calc(element), [element]);
  // function calc(element) {
  //   element = document.querySelector(".join-room");
  //   return element;
  // }

  useEffect(() => {
    /*----- Initiate the process and sends the sender to the sharing screen -------*/
    const initaite_handler = (receiverId) => {
      receiver_uid.current = receiverId;
      console.log({ join_screen, room_screen });
      console.log();
      join_screen.current.classList.remove("active");
      room_screen.current.classList.add("active");
    };
    socket.on("initiate", initaite_handler);

    return () => {
      socket.removeListener("initiate", initaite_handler);
      socket.off("initiate");
      socket.removeAllListeners("initiate");
    };
  }, []);

  // Generate the joining id for the joining room
  const generate_id = () => {
    // Generates a random 8 length long joining id
    setSender_uid("");
    const ID = nanoid(8);

    // updates the joining id section and displays the joining id

    setSender_uid((sender_uid) => {
      return sender_uid + ID;
    });

    // sending a join request from the sender to the socket server

    socket.emit("sender_join", {
      sender_uid: ID,
    });
  };

  /*--------- Shares the Meta Data of the file with the receiver ---------*/

  function share_meta_data(metaData, buffer) {
    socket.emit("share_meta_data", {
      receiver_uid: receiver_uid.current,
      metaData: metaData,
    });

    /*--------- Shares the Raw File in chunks with the receiver ---------*/

    socket.on("file_share", function () {
      const chunk = buffer.slice(0, metaData.buffer_size);
      buffer = buffer.slice(metaData.buffer_size, buffer.length);
      if (chunk.length != 0) {
        socket.emit("share_raw_file", {
          receiver_uid: receiver_uid.current,
          buffer: chunk,
        });
      } else {
        console.log("File send successfully");
      }
    });
  }

  /*--------- Converts the file into Uint8Array ---------*/

  const upload_file = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      const buffer = new Uint8Array(reader.result);
      share_meta_data(
        {
          fileName: file.name,
          total_buffer_size: buffer.length,
          buffer_size: 2048,
        },
        buffer
      );
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Title />
      <div ref={join_screen} className="join-screen screen active">
        <div id="join-id">
          <b>Room ID</b>
          <div id="join-id-field">{sender_uid}</div>
        </div>
        <div>
          <button className="btn btn-primary" onClick={generate_id}>
            Create Room ID
          </button>
        </div>
      </div>

      <div ref={room_screen} className="room_screen screen">
        <DropFileInput onFileChange={onFileChange} />
        <button className="btn btn-primary" onClick={upload_file}>
          Upload
        </button>
      </div>
    </div>
  );
}

export default Create_Room;
