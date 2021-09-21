import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardMui from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Player, { Video } from "./Player";
import TrimSlider from "./TrimSlider";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TextRotateUpIcon from "@material-ui/icons/TextRotateUp";
import TextRotationDownIcon from "@material-ui/icons/TextRotationDown";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const useStyles = makeStyles({
  root: {},
});

interface Props {
  video: Video;
  count: number;
  i: number;
  hideTrimSliderInfo: boolean;
  updateDuration: (id: string, duration: number) => void;
  updateisPlaying: (id: string, play: boolean) => void;
  duplicateVideo: (id: string) => void;
  toogleActive: (id: string) => void;
  updateTrimStart: (id: string, trimStart: number) => void;
  updateTrimStop: (id: string, trimStop: number) => void;
  moveVideoRight: (id: string) => void;
  moveVideoLeft: (id: string) => void;
  rotate: (id: string) => void;
}

export default function Card(props: Props) {
  const classes = useStyles();

  return (
    <CardMui className={classes.root}>
      <Player
        video={props.video}
        i={props.i}
        updateDuration={props.updateDuration}
        updateisPlaying={props.updateisPlaying}
        duplicateVideo={props.duplicateVideo}
        toogleActive={props.toogleActive}
      />
      {/* <CardMedia
        component="video"
        //   alt="Contemplative Reptile"
        //   height="140"
        image={props.video.src}
        //   title="Contemplative Reptile"
        controls
      /> */}
      <CardContent>
        {/* <Typography gutterBottom variant="h5" component="h2">
          Lizard
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.video.src}
        </Typography> */}
        {props.video.duration && (
          <TrimSlider
            video={props.video}
            hideTrimSliderInfo={props.hideTrimSliderInfo}
            updateTrimStart={props.updateTrimStart}
            updateTrimStop={props.updateTrimStop}
          />
        )}
      </CardContent>
      <pre>{JSON.stringify(props.video, null, 2)}</pre>

      <CardActions>
        <strong>{props.i + 1}</strong>
        <Button
          // variant="contained"
          color="primary"
          size="small"
          onClick={() => props.duplicateVideo(props.video.id)}
          disabled={!props.video.active}
        >
          <FileCopyIcon />
        </Button>
        <Button
          color={props.video.active ? "secondary" : "primary"}
          size="small"
          onClick={() => props.toogleActive(props.video.id)}
        >
          <RemoveCircleOutlineIcon />
        </Button>
        <Button
          size="small"
          color="primary"
          disabled={props.i === 0}
          onClick={() => props.moveVideoLeft(props.video.id)}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          size="small"
          color="primary"
          disabled={props.i + 1 === props.count}
          onClick={() => props.moveVideoRight(props.video.id)}
        >
          <ArrowForwardIcon />
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => props.rotate(props.video.id)}
        >
          {props.video.rotate === 0 && <TextRotateUpIcon />}
          {props.video.rotate === 180 && <TextRotationDownIcon />}
        </Button>
      </CardActions>
    </CardMui>
  );
}
