import React, { Component } from "react";
import "../App.css";

const allFieldNames = "id|title|firstName|surname|email|roomId|checkInDate|checkOutDate".split(
  "|"
);

const fieldInfos = Object.fromEntries(
  allFieldNames.map(n => {
    return [n, { name: n, type: "text", editable: true }];
  })
);
fieldInfos.id.editable = false;

const fieldNames = Object.values(fieldInfos)
  .filter(i => i.editable)
  .map(i => i.name);

class Form extends Component {
  render() {
    return (
      <div className="booking-form-container">
        <div className="booking-form">
          <p>ID: {this.props.bookingBeingEdited.id}</p>
          <div className="booking-inputs">
            {fieldNames.map(n => (
              <input
                key={n}
                type="text"
                id={n}
                value={this.props.bookingBeingEdited[n]}
                onChange={this.props.handleChange}
                name={n}
                placeholder={n}
              />
            ))}
          </div>
          <div className="form-buttons">
            <button className="btn btn-primary" onClick={this.props.handleSend}>
              Send
            </button>
            <button
              className="btn btn-secondary"
              onClick={this.props.handleSendRandom}
            >
              Send Random!
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
