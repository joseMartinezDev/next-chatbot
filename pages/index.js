import Head from "next/head";
import styles from "./css/styles.module.css";
import React, { useEffect } from "react";
import { initSpeechRecognition } from "../utils/utils";
import Pusher from "pusher-js";

let pusher;
let channel;

function pushData(data) {
  fetch("/api/server", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      console.error("failed to push data");
    }
  });
}

export default function IndexPage() {
  let recognition;

  useEffect(() => {
    recognition = initSpeechRecognition();

    recognition.addEventListener("result", recognitionResultHandler);

    Pusher.logToConsole = true;
    pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: process.env.NEXT_PUBLIC_CLUSTER,
    });

    channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function (data) {
      alert(JSON.stringify(data));
    });
  }, []);

  const recognitionResultHandler = (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    pushData(text);
  };

  return (
    <main>
      <Head>
        <title>Next.js Chatbot by Jose MArtinez</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <div>
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
