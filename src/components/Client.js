import React, { Component } from "react";
import Form from "./Form.js";
import API from "./API.js";
import APISelector from "./APISelector.js";

class Client extends Component {
  state = {
    bookings: [],
    settingsHidden: true,
    bookingBeingEdited: null
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
      <table>
        <thead>
          <tr>
            <th colspan="2">Latest Bookings</th>
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

/*
      <td className="edit">
        <button
          active="false"
          onClick={event => props.onEditClicked(props.data)}
        >
          EDIT
        </button>
              </td>

*/

export default Client;
