import React, {Component} from "react";
import {Button, ButtonGroup, Container} from "reactstrap";
import {Link} from "react-router-dom";
import AppNavbar from "./AppNavbar";

export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined,
      appointments: [],
      isLoading: true
    };
    this.remove = this.remove.bind(this);
  }

  async componentDidMount() {
    this.setState({ isLoading: true });

    const response = await fetch("/api/login", { credentials: "include" });
    const body = await response.text();
    if (body !== "") {
      this.setState({ currentUser: JSON.parse(body)});
    }

    fetch("api/appointments")
      .then(response => response.json())
      .then(data => this.setState({
        appointments: data,
        isLoading: false
      }));
  }

  async remove(id) {
    await fetch(`/api/appointment/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      let updatedAppointments = [...this.state.appointments].filter(appointment => appointment.id !== id);
      this.setState({
        appointments: updatedAppointments
      });
    });
  }

  render() {
    const {appointments, isLoading, currentUser} = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }

    const appointmentList = appointments.map(appointment => {
      return (
        <tr key={appointment.id}>
          <td style={{whiteSpace: "nowrap"}}>{appointment.nameUser}</td>
          <td>{appointment.numberCar}</td>
          <td>{appointment.data}</td>
          <td>{appointment.description}</td>
          <td>
            <ButtonGroup>
              <Button
                size="sm"
                color="primary"
                tag={Link}
                to={"/appointments/" + appointment.id}
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => this.remove(appointment.id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </td>
        </tr>
      );
    });

    function AddButton() {
      if (currentUser.setRole === "Manager" || currentUser.setRole === "Logistician") {
        return (
            <Button color="success" tag={Link} to="/appointments/new">
              Make an appointment
            </Button>
        );
      }
      return <div/>;
    }

    return (
      <div>
        <AppNavbar />
        <Container fluid>
          <div className="float-right">
            <AddButton/>
          </div>
          <h3>Appointment panel</h3>
          <table className="mt-4 table table-hover">
            <thead>
            <tr>
              <th width="17.5%">User</th>
              <th width="20%"> Registration number</th>
              <th>Data</th>
              <th width="20%">Description</th>
              <th width="20%">Actions</th>
            </tr>
            </thead>
            <tbody>{appointmentList}</tbody>
          </table>
        </Container>
      </div>
    );
  }
}
