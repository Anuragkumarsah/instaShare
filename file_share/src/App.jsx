import "./assets/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./components/Loading.jsx";
import React, { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import Receive_file from "./components/Receive_file";
// import Create_Room from "./components/Create_Room";
const Receive_file = lazy(() => import("./components/Receive_file"));
const Create_Room = lazy(() => import("./components/Create_Room"));

function App({ socket }) {
  return (
    <>
      <div className="main_body">
        <div id="app_screen" className="app_body screen active">
          <div className="container">
            <header>
              <h1>Instant Share</h1>
              <a href="https://sameclip.ml/">
                <span>
                  by{" "}
                  <span className="instant-share-page-header">ShareLink</span>
                </span>
              </a>
            </header>
          </div>

          <main>
            <Router>
              <Suspense
                fallback={
                  <div
                    id="loader_container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                    className="screen active"
                  >
                    <Loading />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/create-room"
                    exact
                    element={<Create_Room socket={socket} />}
                  />
                  <Route
                    path="/receive"
                    exact
                    element={<Receive_file socket={socket} />}
                  />
                </Routes>
              </Suspense>
            </Router>
          </main>
          <footer></footer>
        </div>
      </div>
    </>
  );
}

export default App;
