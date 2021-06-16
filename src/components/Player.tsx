import React, { useCallback, SyntheticEvent, useRef, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import TrimSlider from "./TrimSlider";
import { useVideo } from "../hooks/useVideo";

export interface Video {
  id: string;
  src: string;
  trimStart: number;
  trimStop: number;
  duration: number;
  // ready: boolean;
  isPlaying: boolean;
  // currentTime: number;
}
interface Props {
  video: Video;
  updateVideos: (newVideo: Video) => void;
  updateDuration: (id: string, duration: number) => void;
  updateisPlaying: (id: string, play: boolean) => void;
}
export default function Player(props: Props) {
  const classes = useStyles();

  const { video, updateVideos, updateDuration, updateisPlaying } = props;

  const { videoElement, videoState, controls } = useVideo(video.src);
  // console.log(videoState);

  useEffect(() => {
    if (videoState.duration != null) {
      updateDuration(video.id, videoState.duration);
    }
  }, [videoState.duration]);

  useEffect(() => {
    updateisPlaying(video.id, videoState.isPlaying === true ? true : false);
  }, [videoState.isPlaying]);

  useEffect(() => {
    controls.play(video.trimStart);
  }, [video.trimStart]);

  useEffect(() => {
    controls.play(video.trimStop);
  }, [video.trimStop]);

  useEffect(() => {
    if (video.isPlaying === false) controls.pause();
  }, [video.isPlaying]);

  return (
    <>
      <Box className={classes.videoWrapper}>
        {videoElement}

        {/* <TrimSlider video={props.video} updateVideos={props.updateVideos} /> */}
      </Box>
    </>
  );
  // <video
  //   ref={videoRef}
  //   className={classes.video}
  //   controls
  //   src={videoSrc}
  //   onLoadedData={(loadedData: any) => {
  //     const newVideo = { ...video, duration: loadedData.target.duration };
  //     updateVideos(newVideo);
  //   }}
  // ></video>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoWrapper: {
      "&> video": {
        width: "100%",
      },
    },
  })
);
