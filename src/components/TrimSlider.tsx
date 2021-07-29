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
  // console.log(video);
  const trimStart = video.trimStart || 0;
  const trimStop = video.trimStop || 0;
  const duration = video.duration || 0;

  const startPrev = useRef(trimStart);
  const stopPrev = useRef(trimStop);

  const marks = [
    {
      value: trimStart,
      label: parseFloat(trimStart.toFixed(1)),
    },
    {
      value: trimStop,
      label: parseFloat(trimStop.toFixed(1)),
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

  return (
    <div className={classes.root}>
      <Slider
        className={classes.slider}
        track="normal"
        aria-labelledby="track-inverted-range-slider"
        defaultValue={[trimStart, trimStop]}
        min={0}
        max={duration}
        step={1}
        valueLabelDisplay={"on"}
        marks={marks}
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
    slider: {
      "& > span ": {
        // backgroundColor: "orange",
        // transform: "scale(1) translate(4px, 10px)",
      },
      "& > span > span": {
        // backgroundColor: theme.palette.primary.main,
        // width: "auto",
        // paddingRight: theme.spacing(1),
        // paddingLeft: theme.spacing(1),
        // transform: "scale(1) translate(-3.5px, 27px)!important",
      },
      "& > span > span > span": {
        // backgroundColor: "transparent",
        // width: theme.spacing(3),
        // height: theme.spacing(3),
      },
    },
  })
);
