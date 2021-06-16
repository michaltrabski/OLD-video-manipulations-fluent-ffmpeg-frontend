import React, { useRef } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Video } from "./Player";

interface Props {
  video: Video;
  updateTrimStart: (id: string, trimStart: number) => void;
  updateTrimStop: (id: string, trimStop: number) => void;
}

export default function TrimSlider(props: Props) {
  const classes = useStyles();

  const { video, updateTrimStart, updateTrimStop } = props;
  const trimStart = video.trimStart || 0;
  const trimStop = video.trimStop || 0;
  const duration = video.duration || 0;

  const startPrev = useRef(trimStart);
  const stopPrev = useRef(trimStop);
  // console.log(video);
  // const disabled = false;
  const marks = [
    {
      value: trimStart || 0,
      // label: "0:00",
    },
    {
      value: trimStop || 0,
      // label: "3:20",
    },
  ];

  const handleChange = (event: any, newValue: number | number[]) => {
    if (newValue instanceof Array) {
      const [start, stop] = newValue;

      // START CHANGED
      if (startPrev.current !== start) updateTrimStart(video.id, start);

      // STOP CHANGED
      if (stopPrev.current !== stop) updateTrimStop(video.id, stop);

      startPrev.current = start;
      stopPrev.current = stop;
    }
  };

  // const handleCommitedChange = () => {
  //   updateVideos({
  //     ...video,
  //     // play: true,
  //   });
  // };

  return (
    <div className={classes.root}>
      <Slider
        track="normal"
        aria-labelledby="track-inverted-range-slider"
        defaultValue={[trimStart, trimStop]}
        min={0}
        max={duration}
        step={1}
        valueLabelDisplay={"on"}
        marks={marks}
        // disabled={disabled}
        onChange={handleChange}
        // onChangeCommitted={handleCommitedChange}
      />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    margin: {
      height: theme.spacing(3),
    },
  })
);
