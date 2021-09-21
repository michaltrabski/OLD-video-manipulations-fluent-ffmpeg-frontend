import video1 from "../videos/video1.mp4";
import video2 from "../videos/video2.mp4";

export const videoShema = {
  id: "",
  name: "",
  src: "",
  trimStart: 0,
  trimStop: 0,
  duration: 0,
  isPlaying: false,
  active: true,
  isManuallyTrimmed: false,
  rotate: 0,
};

export const fakeVideosArr = [
  {
    ...videoShema,
    id: "id1",
    name: video1,
    src: video1,
  },
  {
    ...videoShema,
    id: "id2",
    name: video2,
    src: video2,
  },
];
