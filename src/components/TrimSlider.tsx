import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { Video } from "./Player";

interface Props {
  video: Video;
  updateVideos: (newVideo: Video) => void;
}

export default function TrimSlider(props: Props) {
  const classes = useStyles();

  const { video, updateVideos } = props;
  const trimStart = video.trimStart || 0;
  const trimStop = video.trimStop || 0;

  const disabled = false;
  const marks = [
    {
      value: trimStart,
      // label: "0:00",
    },
    {
      value: trimStop,
      // label: "3:20",
    },
  ];

  const handleChange = (event: any, newValue: number | number[]) => {
    if (newValue instanceof Array) {
      const [trimStart, trimStop] = newValue;
      const newVideo = {
        ...video,
        trimStart,
        trimStop,
        play: false,
        currentTime: trimStart,
      };
      updateVideos(newVideo);
    }
  };

  const handleCommitedChange = () => {
    updateVideos({
      ...video,
      play: true,
    });
  };

  return (
    <div className={classes.root}>
      <Slider
        track="normal"
        aria-labelledby="track-inverted-range-slider"
        defaultValue={[trimStart, trimStop]}
        min={0}
        max={video.duration || 0}
        step={1}
        valueLabelDisplay={disabled ? "off" : "on"}
        marks={marks}
        disabled={disabled}
        onChange={handleChange}
        onChangeCommitted={handleCommitedChange}
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
