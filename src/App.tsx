import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Player, { Video } from "./components/Player";
import video1 from "./videos/video1.mp4";
import video2 from "./videos/video2.mp4";
import TrimSlider from "./components/TrimSlider";
import axios from "axios";
import { Box } from "@material-ui/core";

const ENDPOINT = "http://localhost:3000/";

function App() {
  const classes = useStyles();
  const [videos, setVideos] = useState<Video[]>([
    {
      id: "id1",
      src: video1,
      trimStart: 0,
      trimStop: 0,
      duration: 0,
    },
    {
      id: "id2",
      src: video1,
      trimStart: 0,
      trimStop: 0,
      duration: 0,
    },
  ]);

  const updateDuration = (id: string, duration: number) => {
    setVideos(
      videos.map((video) =>
        video.id === id
          ? { ...video, duration, trimStart: 0, trimStop: duration }
          : video
      )
    );
  };

  const updateTrimStart = (id: string, trimStart: number) => {
    // console.log(id, trimStart);
    setVideos(
      videos.map((video) => (video.id === id ? { ...video, trimStart } : video))
    );
  };

  const updateTrimStop = (id: string, trimStop: number) => {
    // console.log(id, trimStart);
    setVideos(
      videos.map((video) => (video.id === id ? { ...video, trimStop } : video))
    );
  };

  const updateVideos = (newVideo: Video) => {
    // if (!newVideo.duration) return;
    // newVideo.trimStart = newVideo.trimStart || 0;
    // newVideo.trimStop = newVideo.trimStop || newVideo.duration;
    // newVideo.ready = true;
    // setVideos(
    //   videos.map((video) => (video.id === newVideo.id ? newVideo : video))
    // );
  };

  useEffect(() => {
    // fetch("http://localhost:3000/")
    //   .then((response) => response.json())
    //   .then((data) => console.log("data", data));
    // axios
    //   .post(ENDPOINT, videos)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  }, [videos]);

  return (
    <>
      <CssBaseline />
      <Box p={2}>
        <Grid container spacing={3}>
          {/* left column  */}
          <Grid item md={6}>
            {videos.map((video) => (
              <Grid key={video.id} container spacing={3}>
                <Grid item>
                  <Paper className={classes.paper}>
                    <Player
                      video={video}
                      updateVideos={updateVideos}
                      updateDuration={updateDuration}
                    />

                    {video.duration && (
                      <TrimSlider
                        video={video}
                        updateTrimStart={updateTrimStart}
                        updateTrimStop={updateTrimStop}
                      />
                    )}
                  </Paper>
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* right column  */}
          <Grid item md={6}>
            <Paper className={classes.paper}>
              <pre>{JSON.stringify(videos, null, 2)}</pre>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);
