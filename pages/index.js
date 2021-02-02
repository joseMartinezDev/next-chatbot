import Head from "next/head";
import styles from "./css/styles.module.css";
import React, { useEffect } from "react";
import { initSpeechRecognition } from "./utils";

export default function IndexPage() {
  let recognition;

  useEffect(() => {
    recognition = initSpeechRecognition();

    recognition.addEventListener("result", recognitionResultHandler);
  }, []);

  const recognitionResultHandler = (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log("recog", text);
  };

  return (
    <main>
      <Head>
        <title>Next.js Chatbot by Jose MArtinez</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
