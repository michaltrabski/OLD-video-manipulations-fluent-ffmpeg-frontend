import React, { useEffect, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Video } from "./components/Player";
import axios from "axios";
import { Box, Button, Container } from "@material-ui/core";
import clsx from "clsx";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { fakeVideosArr, videoShema } from "./data/data";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import { rnd } from "./utils/utils";
import audio from "./mp3/text.mp3";
import SpeachToText from "./components/SpeachToText";

// const audio = require("./mp3/text.mp3");
const { v4: uuidv4 } = require("uuid");

const ENDPOINT = "http://localhost:3000/";

type Cols = 1 | 2 | 3 | 4 | 6 | 12;

function App() {
  const classes = useStyles();
  const [hideTrimSliderInfo, setHideTrimSliderInfo] = useState(true);
  const cols: Cols[] = [1, 2, 3, 4, 6, 12];
  const [col, setCol] = useLocalStorage<Cols>("col", cols[3]);
  const [videos, setVideos] = useLocalStorage<Video[]>("videos", []);
  console.log(33333, videos);
  useEffect(() => {
    // if there are video dont make request to not to override those from local storage
    console.log(1111, videos);
    if (videos.length > 0) return;
    console.log(2222, videos);
    axios
      .get(ENDPOINT)
      .then((res) => {
        console.log(1, "ENDPOINT => ", ENDPOINT);
        // if res.data is a string then use a test data fakeVideosArr
        if (typeof res.data === "string") {
          console.log(2, "res.data => ", res.data);
          return setVideos(fakeVideosArr);
        }
        console.log(2, "res.data => ", res.data);
        setVideos(
          res.data.videos.map((video: string) => ({
            ...videoShema,
            id: video,
            name: video,
            src: ENDPOINT + video,
          }))
        );
      })
      .catch((err) => {
        console.log("err =>", err);
        setVideos(fakeVideosArr);
      });
  }, []);

  const produceVideo = () => {
    const dataForBackend = videos.filter((video) => video.active !== false);
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

  const rotate = (id: string) => {
    const item = videos.find((video) => video.id === id);
    const rotate = item?.rotate === 0 ? 180 : 0;
    setVideos(
      videos.map((video) => (video.id === id ? { ...video, rotate } : video))
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
    document.location.reload();
  };

  const convertToMp3 = () => {
    const dataForBackend = videos.filter((video) => video.active !== false);
    console.log("sending data => ", dataForBackend);
    axios
      .post(ENDPOINT + "convertToMp3", dataForBackend)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const createShortVideo = (min_lenght: number, max_lenght: number) => {
    const trimmedVideos = videos.map((video) => {
      const newVideo = { ...video };
      const { duration } = video;

      const condition1 = duration > 12 && duration < 16;

      if (condition1) {
        const center = duration / 2;

        for (let i = 0; i < 101; i++) {
          const random = rnd(min_lenght * 10, max_lenght * 10) / 10;
          const start = parseFloat((center - random / 2).toFixed(1));
          const stop = parseFloat((center + random / 2).toFixed(1));
          console.log("xx", parseFloat((stop - start).toFixed(1)));
        }
        const random = rnd(min_lenght * 10, max_lenght * 10) / 10;
        const start = parseFloat((center - random).toFixed(1));
        const stop = parseFloat((center + random).toFixed(1));
        newVideo.trimStart = start;
        newVideo.trimStop = stop;
      }

      return newVideo;
    });

    setVideos(trimmedVideos);
    // document.location.reload();
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
        <Box mt={1} mb={1}>
          <Box>
            <audio controls src={audio}></audio>
          </Box>
          <Box>
            <SpeachToText videos={videos} />
          </Box>
        </Box>

        <Box mt={1} mb={1}>
          <Button
            className={classes.mr}
            variant="contained"
            color="primary"
            onClick={convertToMp3}
          >
            convertToMp3
          </Button>
          <Button
            className={classes.mr}
            variant="contained"
            color="primary"
            onClick={() => createShortVideo(100, 103)}
          >
            createShortVideo5sek
          </Button>
        </Box>

        <Box mt={1} mb={1}>
          {cols.map((c) => (
            <Button
              key={c}
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
            {videos.length > 0
              ? videos.map((video, i) => (
                  <Grid
                    key={video.id}
                    item
                    xs={12}
                    md={col}
                    className={clsx(video.active || classes.notActive)}
                  >
                    <div>
                      <Card
                        video={video}
                        count={videos.length}
                        i={i}
                        hideTrimSliderInfo={hideTrimSliderInfo}
                        updateDuration={updateDuration}
                        updateisPlaying={updateisPlaying}
                        duplicateVideo={duplicateVideo}
                        toogleActive={toogleActive}
                        updateTrimStart={updateTrimStart}
                        updateTrimStop={updateTrimStop}
                        moveVideoRight={moveVideoRight}
                        moveVideoLeft={moveVideoLeft}
                        rotate={rotate}
                      />
                    </div>
                  </Grid>
                ))
              : "Waiting for response from: http://localhost:3000/"}
          </Grid>
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
