import React, {Component} from "react";
import {Button, ButtonGroup, Container, Table} from "reactstrap";
import {Link} from "react-router-dom";
import AppNavbar from "./AppNavbar";

export default class Appointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      isLoading: true
    };
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

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
    const {appointments, isLoading} = this.state;
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

    return (
      <div>
        <AppNavbar />
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/appointments/new">
              Make an appointment
            </Button>
          </div>
          <h3>Appointment panel</h3>
          <Table className="mt-4">
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
          </Table>
        </Container>
      </div>
    );
  }
}
