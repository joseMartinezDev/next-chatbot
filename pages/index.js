import Link from "next/link";
import Head from "next/head";
import styles from "./css/styles.module.css";
import React, { useEffect } from "react";
import { initSpeechRecognition } from "./utils";

export default function IndexPage() {
  console.log("hello");
  let recognition;

  let socket;

  useEffect(() => {
    recognition = initSpeechRecognition();

    // const socket = socketIo.io();
    socket = require("socket.io")();

    recognition.addEventListener("result", recognitionResultHandler);
  }, []);

  const recognitionResultHandler = (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log("recog", text);
    // console.log("recog", e.results[0][0].confidence);
    socket.emit("chat message", text);
  };

  // const handleClick = () => {
  //   console.log("click2");
  //   recognition.start();
  // };
  return (
    <main>
      <Head>
        <title>Next.js Chatbot by Jose MArtinez</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div>
        {/* Hello World.{" "}
        <Link href="/about">
          <a>About</a>
        </Link>
        <Link href="/day">
          <a>Day</a>
        </Link> */}
        <button
          className={styles.talkButton}
          onClick={() => recognition.start()}
        >
          Talk
        </button>
      </div>
    </main>
  );
}

// export const getStaticProps = () => {
//   console.log("server");
//   socket = require("socket.io")();
//   const ttt = "hello";

//   return { props: {} };
// };
