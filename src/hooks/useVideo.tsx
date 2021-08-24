import { createElement, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface VideoState {
  audio: any;
  duration: number;
  isPlaying: boolean;
}
export const useVideo = (src: string) => {
  // console.log("useVideo");
  const [videoState, setVideoState] = useLocalStorage<VideoState>("useVideos", {
    audio: null,
    duration: 0,
    isPlaying: false,
  });

  const ref = useRef<HTMLVideoElement | null>(null);

  const videoElement = createElement("video", {
    src,
    ref,
    controls: false,
    onPlay: () => {
      console.log("onPlay");
      setVideoState((s) => ({ ...videoState, isPlaying: true }));
    },
    onPause: () => {
      console.log("onPause");
      setVideoState((s) => ({ ...videoState, isPlaying: false }));
    },
    onWaiting: () => console.log("onWaiting"),
    onPlaying: () => console.log("onPlaying"),
    onLoadedData: (data: any) => {
      // ugly for just now!
      if (videoState.duration) return;
      setVideoState((s) => ({ ...s, duration: data.target.duration }));
    },
    onEnded: () => console.log("onEnded"),
    onTimeUpdate: (xxx: any) => {
      // console.log("onTimeUpdate", xxx.target.currentTime, controls);
      // setTimeout(() => {
      //   controls.pause();
      // }, 3333);
    },
    onDurationChange: () => console.log("onDurationChange"),
    onError: (error) => console.log("error"),
  });

  const controls = {
    play: (currentTime: number) => {
      if (!ref.current) return;
      const audio = ref.current;
      audio.currentTime = currentTime;
      audio.play();
    },
    pause: () => {
      if (!ref.current) return;
      const audio = ref.current;
      audio.pause();
    },
    currentTime: (currentTime: number) => {
      if (!ref.current) return;
      const audio = ref.current;
      audio.currentTime = currentTime;
    },
  };
  return { videoElement, videoState, controls };
};
