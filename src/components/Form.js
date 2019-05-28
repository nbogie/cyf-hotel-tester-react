import React, { Component } from "react";
import "../App.css";
import _ from "lodash";
import randomNames from "random-name";
import moment from "moment";

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

function randomDateStrings() {
  const d1 = _.random(1, 364);
  const dur = _.random(1, 14);
  const checkIn = moment()
    .dayOfYear(d1)
    .format("DD/MM/YYYY");
  const checkOut = moment()
    .dayOfYear(d1 + dur)
    .format("DD/MM/YYYY");
  return { checkIn, checkOut };
}

class Form extends Component {
  constructor(props) {
    super(props);
    const st = {};
    fieldNames.forEach(n => (st[n] = ""));
    this.state = st;
  }

  getBookingFromForm = () => {
    const booking = {};
    fieldNames.forEach(k => {
      booking[k] = this.state[k];
    });
    return booking;
  };

  clearForm = () => {
    const blankBooking = {};
    fieldNames.forEach(k => {
      blankBooking[k] = "";
    });
    this.setState(blankBooking);
  };

  handleSendBooking = event => {
    const booking = this.getBookingFromForm();

    this.props.api.create("bookings", booking).then(json => {
      this.clearForm();
      this.props.callAfterSend();
    });
  };

  populateForEditing = msg => {};

  generateRandomBooking = () => {
    const title = _.sample(["Mr", "Mrs", "Ms", "Sir"]);
    const firstName = randomNames.first();
    const surname = randomNames.last();
    const email = firstName.toLowerCase() + "@example.com";
    const roomId = _.random(1, 44);
    const dates = randomDateStrings();
    return {
      checkInDate: dates.checkIn,
      checkOutDate: dates.checkOut,
      title,
      firstName,
      surname,
      email,
      roomId
    };
  };

  handleSendRandomBooking = event => {
    const booking = this.generateRandomBooking();
    this.props.api
      .create("bookings", booking)
      .then(json => this.props.callAfterSend());
  };

  handleChange = (key, event) => {
    this.setState({ [key]: event.target.value });
  };

  render() {
    return (
      <div className="booking-form-container">
        <div className="booking-form">
          <div className="booking-inputs">
            {fieldNames.map(n => (
              <input
                key={n}
                type="text"
                value={this.state[n]}
                onChange={event => this.handleChange(n, event)}
                name={n}
                placeholder={n}
              />
            ))}
          </div>
          <div className="form-buttons">
            <button
              className="btn btn-primary"
              onClick={this.handleSendBooking}
            >
              Send
            </button>
            <button
              className="btn btn-secondary"
              onClick={this.handleSendRandomBooking}
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
