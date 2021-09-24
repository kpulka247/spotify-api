import React from "react";
import {detailProps} from "./Details";
import {Row} from "react-bootstrap";
import lyricsFinder from "lyrics-finder";

const Lyrics = ({track}: detailProps) => {

  // const lyrics = lyricsFinder(track.artists[0].name, track.name) || "Not found!"
  // console.log('lyrics', lyrics)

  return (
    <Row className="justify-content-center text-center">
      <Row>
        <label className="text-muted" htmlFor={'TU BEDZIE TEXT TRACKA'}>
          {'TU BEDZIE TEXT TRACKA'}
        </label>
      </Row>
    </Row>
  )
}

export default Lyrics