import { createElement, useEffect, useRef, useState } from "react";
// import { FileI } from "../components/FixedContainer";
// import { getStorage, setStorage } from "../utils/utils";

interface VideoState {
  // ready: boolean;
  // currentTime: number;
  duration: number;
  isPlaying: boolean;
}
export const useVideo = (src: string) => {
  const [videoState, setVideoState] = useState<VideoState>({
    // ready: false,
    // currentTime: 0,
    duration: 0,
    isPlaying: false,
  });

  const ref = useRef<HTMLVideoElement | null>(null);

  const videoElement = createElement("video", {
    src,
    ref,
    controls: true,
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
      setVideoState((s) => ({ ...s, duration: data.target.duration }));
    },
    onEnded: () => console.log("onEnded"),
    onTimeUpdate: () => console.log("onTimeUpdate"),
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
  };
  return { videoElement, videoState, controls };
};

// export const useAudio = (
//   folderWithMp3: string,
//   subFolder: string,
//   files: FileI[]
// ) => {
//   const index = getStorage(`${subFolder}-fileNameIndex`, 0);
//   const fileNameIndex = index < files.length ? index : 0;

//   const [resetTimer, setResetTimer] = useState(0);

//   const [state, setState] = useState({
//     ready: false,
//     files,
//     fileNameIndex,
//     paused: true,
//     waiting: false,
//     autoplay: false,
//     currentTime: getStorage(`${subFolder}-currentTime`, 0),
//     duration: 0,
//     buffered: {
//       start: 0,
//       end: 0,
//     },
//   });

//   const ref = useRef<HTMLAudioElement | null>(null);
//   const src = folderWithMp3 + subFolder + files[state.fileNameIndex].mp3;

//   const audioElement = createElement("audio", {
//     src,
//     ref,
//     controls: false,
//     onPlay: () => {
//       if (state.currentTime > 0) setResetTimer((t) => t + 1);
//       setState((s) => ({ ...s, paused: false }));
//     },
//     onPause: () => setState((s) => ({ ...s, paused: true })),
//     onWaiting: () => setState((s) => ({ ...s, waiting: true })),
//     onPlaying: () =>
//       setState((s) => ({ ...s, waiting: false, autoplay: true })),
//     onLoadedData: () => {
//       const audio = ref.current;
//       if (!audio) return;
//     },
//     onEnded: () => {
//       const audio = ref.current;
//       if (!audio) return;
//       setState((s) => ({
//         ...s,
//         ended: true,
//         fileNameIndex:
//           files.length > s.fileNameIndex + 1
//             ? s.fileNameIndex + 1
//             : s.fileNameIndex,
//       }));
//     },
//     onTimeUpdate: () => {
//       const audio = ref.current;
//       if (!audio) return;

//       if (Math.floor(audio.currentTime) !== Math.floor(state.currentTime)) {
//         setState((s) => ({ ...s, currentTime: audio.currentTime }));
//         setStorage(`${subFolder}-fileNameIndex`, state.fileNameIndex);
//         setStorage(`${subFolder}-currentTime`, Math.floor(state.currentTime));
//       }
//     },
//     onDurationChange: () => {
//       const audio = ref.current;
//       if (!audio) return;
//       const { duration, buffered } = audio;
//       setState((s) => ({ ...s, duration }));
//     },
//     onError: (error) => console.log(error),
//   });

//   const controls = {
//     play: () => {
//       const audio = ref.current;
//       if (!audio) return;

//       audio.currentTime = state.currentTime;
//       audio.play();
//     },
//     pause: () => ref?.current?.pause(),
//     seek: (newCurrentTime: number | number[]) => {
//       const audio = ref.current;
//       if (!audio) return;

//       if (newCurrentTime instanceof Array) newCurrentTime = newCurrentTime[0];
//       audio.currentTime = Math.floor(newCurrentTime) || 0;
//       audio.play();
//     },
//     changeFile: (fileNameIndex: number) => {
//       setState((s) => ({ ...s, fileNameIndex }));
//     },
//   };

//   useEffect(() => {
//     const audio = ref.current;
//     if (!audio) return;
//     if (state.autoplay) audio.play();

//     setState((s) => ({ ...s, ended: false, duration: 0 }));
//   }, [src]);

//   useEffect(() => {
//     setState((s) => ({ ...s, ready: false }));
//     if (state.duration > 0) setState((s) => ({ ...s, ready: true }));
//   }, [src, state.duration]);

//   return {
//     audioElement,
//     state,
//     setState,
//     controls,
//     ready: state.ready,
//     src,
//     resetTimer,
//   };
// };
