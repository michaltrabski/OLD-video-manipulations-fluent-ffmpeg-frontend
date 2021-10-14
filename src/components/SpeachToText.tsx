import { Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Video } from "./Player";

type Data = {
  text: string;
  timestamp: number;
};
const initialData: Data[] = [
  {
    text: "jakiś tekst",
    timestamp: 3,
  },
];

interface Props {
  videos: Video[];
}
const SpeachToText = (props: Props) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [data, setData] = useState<Data[]>(initialData);
  const [current, setCurrent] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [text, setText] = useState("");
  const [allText, setAllText] = useState("");
  const video = props.videos[current];

  //   if (!browserSupportsSpeechRecognition) {
  //     return <span>Browser doesn't support speech recognition.</span>;
  //   }

  const handleStart = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "pl-PL", //https://cloud.google.com/speech-to-text/docs/languages
    });
  };

  useEffect(() => {
    handleStart();
  }, []);

  const handleVideoEnded = () => {
    if (current === props.videos.length - 1) return;
    setCurrent((p) => p + 1);
  };

  const handleTimestampUpdate = (e: any) => {
    const delay = 2;
    const time = Math.floor(e.target.currentTime);
    if (timestamp === time) return;
    if (time - delay < 0) return;

    const newText = transcript.slice(allText.length);

    setTimestamp(time);
    setAllText(transcript);
    setData((prevData) => {
      const newData = [...prevData, { text: newText, timestamp: time - delay }];
      return newData;
    });
  };

  console.log(111111111111, video);

  if (!video) return null;

  return (
    <div>
      <video
        width={"300px"}
        controls
        autoPlay
        onEnded={handleVideoEnded}
        onTimeUpdate={handleTimestampUpdate}
        src={video.src}
      ></video>

      <div>
        {timestamp}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );
};
export default SpeachToText;
