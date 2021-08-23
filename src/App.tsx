import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Player, { Video } from "./components/Player";
import TrimSlider from "./components/TrimSlider";
import axios from "axios";
import { Box, Button, Container } from "@material-ui/core";
import clsx from "clsx";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { fakeVideosArr } from "./data/data";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
const { v4: uuidv4 } = require("uuid");

const ENDPOINT = "http://localhost:3000/";

type Cols = 1 | 2 | 3 | 4 | 6 | 12;

function App() {
  const classes = useStyles();

  const [limit, setLimit] = useState(3);
  const cols: Cols[] = [1, 2, 3, 4, 6, 12];
  const [col, setCol] = useLocalStorage<Cols>("col", cols[0]);
  const [videos, setVideos] = useLocalStorage<Video[]>("videos", []);
  console.log(cols, col);
  useEffect(() => {
    // if there are video dont make request to not to override those from local storage
    if (videos.length > 0) return;

    axios
      .get(ENDPOINT)
      .then((res) => {
        // if res.data is a string then use a test data fakeVideosArr
        if (typeof res.data === "string") return setVideos(fakeVideosArr);

        setVideos(
          res.data.videos.map((video: string) => ({
            id: video,
            name: video,
            src: ENDPOINT + video,
            trimStart: 0,
            trimStop: 0,
            duration: 0,
            isPlaying: false,
            active: true,
          }))
        );
      })
      .catch((err) => {
        console.log("err =>", err);
        setVideos(fakeVideosArr);
      });
  }, [videos.length, setVideos]);

  const produceVideo = () => {
    const dataForBackend = videos
      .filter((video) => video.active !== false)
      .map((video) => ({
        id: video.id,
        name: video.name,
        trimStart: video.trimStart,
        trimStop: video.trimStop,
      }));

    console.log("sending data => ", dataForBackend);
    axios
      .post(ENDPOINT, dataForBackend)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const moveVideoRight = (id: string) => {
    const index = videos.findIndex((video) => video.id === id);
    const before = videos.slice(0, index);
    const current = videos[index];
    const next = videos[index + 1];
    const after = videos.slice(index + 2, videos.length);
    setVideos([...before, next, current, ...after]);
  };

  const moveVideoLeft = (id: string) => {
    const index = videos.findIndex((video) => video.id === id);
    const before = videos.slice(0, index - 1);
    const current = videos[index];
    const prev = videos[index - 1];
    const after = videos.slice(index + 1, videos.length);
    setVideos([...before, current, prev, ...after]);
  };

  const toogleActive = (id: string) => {
    setVideos(
      videos.map((video) =>
        video.id === id ? { ...video, active: !video.active } : video
      )
    );
  };

  const stopAllVideos = () => {
    setVideos(videos.map((video) => ({ ...video, isPlaying: false })));
  };

  const duplicateVideo = (id: string) => {
    const index = videos.findIndex((video) => video.id === id);
    const videosBefore = videos.slice(0, index + 1);
    const duplicate = { ...videos[index] };
    duplicate.id = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

    const videosAfter = videos.slice(index + 1);
    setVideos([...videosBefore, duplicate, ...videosAfter]);
  };

  const updateisPlaying = (id: string, isPlaying: boolean) => {
    setVideos(
      videos.map((video) => (video.id === id ? { ...video, isPlaying } : video))
    );
  };

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
    setVideos(
      videos.map((video) =>
        video.id === id
          ? { ...video, trimStart, isPlaying: true, isManuallyTrimmed: true }
          : video
      )
    );
  };

  const updateTrimStop = (id: string, trimStop: number) => {
    setVideos(
      videos.map((video) =>
        video.id === id
          ? { ...video, trimStop, isPlaying: true, isManuallyTrimmed: true }
          : video
      )
    );
  };

  const randomTrim = () => {
    const trimmedVideos = videos.map((v) => {
      if (v.isManuallyTrimmed) return v;

      const trimBy = v.duration * 0.2 + Math.random() * v.duration * 0.2;
      const trimStart = parseFloat(trimBy.toFixed(1));
      const trimStop = parseFloat((v.duration - trimBy).toFixed(1));

      return { ...v, trimStart, trimStop };
    });
    setVideos(trimmedVideos);
  };

  return (
    <>
      <CssBaseline />
      <Navbar
        stopAllVideos={stopAllVideos}
        produceVideo={produceVideo}
        randomTrim={randomTrim}
      />

      <Container>
        {/* <pre>{JSON.stringify(videos, null, 2)}</pre> */}
        <Box mt={1} mb={1}>
          {cols.map((c) => (
            <Button
              className={classes.mr}
              variant="contained"
              color={c === col ? "primary" : "default"}
              onClick={() => setCol(c)}
            >
              {c}
            </Button>
          ))}
        </Box>
        <Box mt={0} mb={120}>
          <Grid container spacing={1}>
            {/* left column  */}

            {videos.length > 0
              ? videos.slice(0, limit).map((video, i) => (
                  <Grid
                    key={video.id}
                    item
                    xs={12}
                    md={col}
                    className={clsx(video.active || classes.notActive)}
                  >
                    {/* <Paper className={classes.paper}> */}
                    <div>
                      <Card
                        video={video}
                        count={videos.length}
                        i={i}
                        updateDuration={updateDuration}
                        updateisPlaying={updateisPlaying}
                        duplicateVideo={duplicateVideo}
                        toogleActive={toogleActive}
                        updateTrimStart={updateTrimStart}
                        updateTrimStop={updateTrimStop}
                        moveVideoRight={moveVideoRight}
                        moveVideoLeft={moveVideoLeft}
                      />
                    </div>
                  </Grid>
                ))
              : "Waiting for response from: http://localhost:3000/"}
          </Grid>

          {/* right column  */}
          {/* <Grid item md={12}>
            <Paper className={classes.paper}>
              <pre>{JSON.stringify(videos, null, 2)}</pre>
            </Paper>
          </Grid> */}
          <Box mt={1}>
            <Button
              fullWidth
              variant="contained"
              // color={c === col ? "primary" : "default"}
              onClick={() => setLimit((p) => p + 10)}
            >
              Load more videos
            </Button>
          </Box>
        </Box>
      </Container>
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
      // padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    notActive: {
      opacity: "0.1",
    },
    globalControls: {
      position: "fixed",
      top: 0,
      padding: "10px 20px",
      backgroundColor: "gray",
      width: "100%",
    },
    mr: {
      marginRight: "0.4rem",
    },
  })
);
