import React, { Component } from "react";
import Form from "./Form.js";
import API from "./API.js";
import APISelector from "./APISelector.js";
import moment from "moment";

class Client extends Component {
  state = {
    bookings: [],
    settingsHidden: true,
    bookingBeingEdited: null
  };
  api = new API("https://cyf-hotel-sample-soln.glitch.me");

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
    this.setState({ bookingBeingEdited: booking });
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
          callAfterSend={this.refreshList}
        />
      </section>
    );
  }
}

function BookingList(props) {
  return (
    <section className="booking-list">
      <ul>
        {props.bookings.map(m => (
          <Booking
            key={m.id}
            data={m}
            onDeleteClicked={props.handleDeleteBooking}
            onEditClicked={props.handleEditBooking}
          />
        ))}
      </ul>
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
    <li className="booking-li">
      <div className="booking-row">
        {fieldNames.map(k => (
          <span key={k} className={`booking-${k}`}>
            {props.data[k]}
          </span>
        ))}

        <div className="controls">
          <button onClick={event => props.onEditClicked(props.data)}>
            EDIT
          </button>
          <div className="delete">
            <button
              className="btn btn-warning"
              onClick={event => props.onDeleteClicked(props.data.id)}
            >
              X
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Client;
