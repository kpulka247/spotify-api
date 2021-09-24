import React from "react";
import {FormSelect} from "react-bootstrap";

const Dropdown = (props: any) => {

  const dropdownChanged = (e: any) => {
    props.changed(e.target.value)
  }

  return (
      <FormSelect value={props.selectedValue} onChange={dropdownChanged}>
        {props.options.map((item: any, idx: any) => <option key={idx} value={item.id}>{item.name}</option>)}
      </FormSelect>
  )
}

export default Dropdown;