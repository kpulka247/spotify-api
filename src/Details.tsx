import React from "react";
import {Col, Image, Row} from "react-bootstrap";

export interface detailProps {
  track: any
}

const Details = ({track}: detailProps) => {

  return (
    <Row className="justify-content-center text-center">
      <Col>
        <Image fluid src={track.album.images[0].url} rounded/>
      </Col>
      <Col>
        <Row>
          <label htmlFor={track.name}>
            {track.name}
          </label>
        </Row>
        <Row>
          <label className="text-muted" htmlFor={track.artists[0].name}>
            {track.artists[0].name}
          </label>
        </Row>
      </Col>
    </Row>
  )
}

export default Details