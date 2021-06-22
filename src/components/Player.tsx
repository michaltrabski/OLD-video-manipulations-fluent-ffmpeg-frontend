import React, { useCallback, SyntheticEvent, useRef, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {
  Box,
  Button,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import TrimSlider from "./TrimSlider";
import { useVideo } from "../hooks/useVideo";
import { resolveTypeReferenceDirective } from "typescript";
import { dark } from "@material-ui/core/styles/createPalette";
import { generateKeyPair } from "crypto";

export interface Video {
  id: string;
  name: string;
  src: string;
  trimStart: number;
  trimStop: number;
  duration: number;
  isPlaying: boolean;
  active: boolean;
}
interface Props {
  video: Video;
  i: number;
  updateDuration: (id: string, duration: number) => void;
  updateisPlaying: (id: string, play: boolean) => void;
  duplicateVideo: (id: string) => void;
  toogleActive: (id: string) => void;
}
export default function Player(props: Props) {
  const classes = useStyles();

  const {
    video,
    i,
    updateDuration,
    updateisPlaying,
    duplicateVideo,
    toogleActive,
  } = props;

  const { videoElement, videoState, controls } = useVideo(video.src);

  // initial video setup
  useEffect(() => controls.currentTime(video.trimStart), []);

  useEffect(() => {
    if (videoState.duration != null) {
      updateDuration(video.id, videoState.duration);
    }
  }, [videoState.duration]);

  useEffect(() => {
    updateisPlaying(video.id, videoState.isPlaying === true ? true : false);
  }, [videoState.isPlaying]);

  let timeout: any;
  useEffect(() => {
    if (video.duration !== video.trimStop) {
      controls.play(video.trimStop - 2);
      timeout = setTimeout(() => controls.pause(), 2400);
    }
    return () => clearTimeout(timeout);
  }, [video.trimStop]);

  useEffect(() => controls.play(video.trimStart), [video.trimStart]);

  useEffect(() => {
    if (video.isPlaying === false) controls.pause();
  }, [video.isPlaying]);

  return (
    <>
      <Box className={classes.videoWrapper}>
        {videoElement}

        <Box className={classes.videoHead}>
          <Typography
            style={{ marginBottom: 0 }}
            variant="h4"
            component="h2"
            gutterBottom
            display="inline"
          >
            {i + 1}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => duplicateVideo(video.id)}
          >
            Duplicate
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => toogleActive(video.id)}
          >
            Toogle Active
          </Button>
        </Box>
      </Box>
      {/* <pre>{JSON.stringify(video, null, 2)}</pre> */}
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    videoWrapper: {
      position: "relative",
      "&> video": {
        width: "100%",
        border: "1px solid black",
      },
    },
    videoHead: {
      position: "absolute",
      top: 0,
      // backgroundColor: "#f44336",
      width: "100%",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },
  })
);
