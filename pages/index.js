import Head from "next/head";
import styles from "./css/styles.module.css";
import React, { useEffect, useState } from "react";
import { initSpeechRecognition, synthVoice, changeVoice } from "../utils/utils";
import Pusher from "pusher-js";

let pusher;
let channel;
let recognition;

export default function IndexPage() {
  const [buttonText, setButtonText] = useState("PRESS TO TALK!");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    changeVoice().then((utterance) => {
      recognition = initSpeechRecognition();
      recognition.addEventListener("result", recognitionResultHandler);
      recognition.addEventListener("speechend", recognitionEndHandler);

      // Pusher.logToConsole = true;
      pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
        cluster: process.env.NEXT_PUBLIC_CLUSTER,
      });

      channel = pusher.subscribe("my-channel");
      channel.bind("my-event", function (data) {
        synthVoice(utterance, data.message);
        utterance.addEventListener("start", () => setButtonText("SPEAKING!"));
        utterance.addEventListener("end", () => {
          setSpeaking(false);
          setButtonText("PRESS TO TALK!");
        });
      });
    });
  }, []);

  function pushData(data) {
    fetch("/api/server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      setButtonText("WAITING FOR SAMANTHA'S ANSWER!");

      if (!res.ok) {
        console.error("failed to push data", res);
      }
    });
  }

  const recognitionResultHandler = (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    setButtonText("SENDING ANSWER TO SAMANTHA!");

    pushData(text);
  };

  const recognitionEndHandler = () => {
    recognition.stop();
  };
  const recognitionStart = () => {
    setButtonText("LISTENING!");
    setSpeaking(true);
    recognition.start();
  };

  return (
    <main>
      <Head>
        <title>Next.js Chatbot by Jose Msrtinez</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <div>
        <button
          className={styles.talkButton}
          onClick={() => recognitionStart()}
          disabled={speaking}
        >
          {buttonText}
        </button>
      </div>
    </main>
  );
}
