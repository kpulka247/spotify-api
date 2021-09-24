import React from "react";
import {ListGroup, ListGroupItem} from "react-bootstrap";

const List = (
  {items, clicked}: {
    items: {}[],
    clicked: (track: {}) => void // Wynoszenie ponad stan komponentu
  }
) => {

  const handleClicked = (e: any, track: {}) => {
    e.preventDefault()
    clicked(track)
    console.log('clicked', track)
  }

  return (
    <ListGroup className="justify-content-center">
      {
        items.map((item: any, idx: any) =>
          <ListGroupItem
            action
            key={idx}
            onClick={(event) => handleClicked(event, item.track)}
            id={item.track.id}>
            {item.track.name}
          </ListGroupItem>)
      }
    </ListGroup>
  )
}

export default List