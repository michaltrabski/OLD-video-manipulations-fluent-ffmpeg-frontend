import React, { useCallback, SyntheticEvent, useRef, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import TrimSlider from "./TrimSlider";

export interface Video {
  id: string;
  videoSrc: string;
  trimStart: null | number;
  trimStop: null | number;
  duration: null | number;
  ready: boolean;
  play: boolean;
  currentTime: number;
}
interface Props {
  video: Video;
  updateVideos: (newVideo: Video) => void;
}
export default function Player(props: Props) {
  const classes = useStyles();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { video, updateVideos } = props;
  const { videoSrc } = video;

  useEffect(() => {
    console.log(video.trimStart);
    if (videoRef && videoRef.current) {
      videoRef.current.currentTime = video.currentTime;
      console.log("cccc", video.play);
      if (video.play) videoRef.current.play();
    }
  }, [video]);

  return (
    <video
      ref={videoRef}
      className={classes.video}
      controls
      src={videoSrc}
      onLoadedData={(loadedData: any) => {
        const newVideo = { ...video, duration: loadedData.target.duration };
        updateVideos(newVideo);
      }}
    ></video>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    video: {
      maxWidth: "100%",
    },
  })
);
