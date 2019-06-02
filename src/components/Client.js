import React, { Component } from "react";
import Form from "./Form.js";
import API from "./API.js";
import APISelector from "./APISelector.js";

import randomNames from "random-name";
import moment from "moment";
import _ from "lodash";

function randomDateStrings() {
  const d1 = _.random(1, 364);
  const dur = _.random(1, 14);
  const checkIn = moment()
    .dayOfYear(d1)
    .format("YYYY-MM-DD");
  const checkOut = moment()
    .dayOfYear(d1 + dur)
    .format("YYYY-MM-DD");
  return { checkIn, checkOut };
}
const emptyBooking = {
  title: "",
  firstName: "",
  surname: "",
  roomId: "",
  id: "",
  email: "",
  checkInDate: "",
  checkOutDate: ""
};
class Client extends Component {
  state = {
    bookings: [],
    settingsHidden: true,
    bookingBeingEdited: emptyBooking
  };
  api = new API("https://localhost:3001");

  handleChangedAPI = url => {
    this.api.setEndpoint(url);
    this.refreshList();
  };

  componentDidMount() {
    this.refreshList();
  }

  handleDeleteBooking = id => {
    this.api.delete("bookings", id).then(res => this.refreshList());
  };

  handleEditBooking = booking => {
    this.setState({ bookingBeingEdited: Object.assign({}, booking) });
  };

  clearBookingBeingEdited = () => {
    this.setState({ bookingBeingEdited: Object.assign({}, emptyBooking) });
  };

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

  handleSendRandom = event => {
    const booking = this.generateRandomBooking();
    console.log("sending random: ", { booking });
    this.api.create("bookings", booking).then(json => {
      this.refreshList();
      this.clearBookingBeingEdited();
    });
  };

  refreshList = () => {
    this.api
      .getAll("bookings")
      .then(json => this.setState({ bookings: json.slice(-6) }));
  };

  toggleHideSettings = () =>
    this.setState(p => {
      return {
        settingsHidden: !p.settingsHidden
      };
    });

  handleFormFieldChanged = event => {
    const k = event.target.id;
    const v = event.target.value;
    this.setState(p => {
      p.bookingBeingEdited[k] = v;
      return p;
    });
  };

  handleSendForm = () => {
    console.log("state: ", this.state);
    console.log("send.  booking is: ", this.state.bookingBeingEdited);
    const id = parseInt(this.state.bookingBeingEdited.id);
    //TODO: do this right
    if (isNaN(id)) {
      this.api.create("bookings", this.state.bookingBeingEdited).then(res => {
        this.refreshList();
        this.clearBookingBeingEdited();
      });
    } else {
      this.api
        .update(
          "bookings",
          this.state.bookingBeingEdited.id,
          this.state.bookingBeingEdited
        )
        .then(res => {
          this.refreshList();
          this.clearBookingBeingEdited();
        });
    }
  };

  render() {
    return (
      <section className="client">
        <button onClick={this.toggleHideSettings}>
          {this.state.settingsHidden ? "Set API" : "Hide API"}
        </button>
        {this.state.settingsHidden ? null : (
          <APISelector handleChangedAPI={this.handleChangedAPI} />
        )}
        <BookingList
          bookings={this.state.bookings}
          handleDeleteBooking={this.handleDeleteBooking}
          handleEditBooking={this.handleEditBooking}
          refreshList={this.refreshList}
        />
        <Form
          api={this.api}
          bookingBeingEdited={this.state.bookingBeingEdited}
          handleChange={this.handleFormFieldChanged}
          handleSend={this.handleSendForm}
          handleSendRandom={this.handleSendRandom}
        />
      </section>
    );
  }
}

function BookingList(props) {
  return (
    <section className="booking-list">
      <table>
        <thead>
          <tr>
            <th colSpan="2">Latest Bookings</th>
          </tr>
        </thead>
        <tbody>
          {props.bookings.map(m => (
            <Booking
              key={m.id}
              data={m}
              onDeleteClicked={props.handleDeleteBooking}
              onEditClicked={props.handleEditBooking}
            />
          ))}
        </tbody>
      </table>

      <button className="refresh" onClick={props.refreshList}>
        Refresh Bookings
      </button>
    </section>
  );
}
function Booking(props) {
  const fieldNames = "id|title|firstName|surname|email|roomId|checkInDate|checkOutDate".split(
    "|"
  );
  return (
    <tr className="booking-tr">
      {fieldNames.map(k => (
        <td key={k} className={`booking-${k}`}>
          {props.data[k]}
        </td>
      ))}

      <td className="edit">
        <button
          active="false"
          onClick={event => props.onEditClicked(props.data)}
        >
          EDIT
        </button>
      </td>

      <td className="delete">
        <button
          className="btn btn-warning"
          onClick={event => props.onDeleteClicked(props.data.id)}
        >
          X
        </button>
      </td>
    </tr>
  );
}

export default Client;
