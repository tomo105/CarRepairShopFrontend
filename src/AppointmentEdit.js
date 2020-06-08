import React, {Component} from "react";
import {Button, Container, Form, FormGroup, Input, Label} from "reactstrap";
import {Link, withRouter} from "react-router-dom";
import AppNavbar from "./AppNavbar";

class AppointmentEdit extends Component {
  emptyItem = {
    nameUser: "",
    numberCar: "",
    data: "",
    description: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== "new") {
      const appointment = await (await fetch(
        `/api/appointment/${this.props.match.params.id}`
      )).json();
      this.setState({item: appointment});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch("/api/appointment", {
      method: item.id ? "PUT" : "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });
    this.props.history.push("/appointments");
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? "Edit Appointment" : "Add Appointment"}</h2>;

    return (
      <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="nameUser">User</Label>
              <Input type="text" name="nameUser" id="nameUser" value={item.nameUser || ""}
                onChange={this.handleChange} autoComplete="nameUser"/>
            </FormGroup>
            <FormGroup>
              <Label for="numberCar">Registration number</Label>
              <Input type="text" name="numberCar" id="numberCar" value={item.numberCar || ""}
                onChange={this.handleChange} autoComplete="numberCar"/>
            </FormGroup>
            <FormGroup>
              <Label for="data">Data</Label>
              <Input type="text" name="data" id="data" value={item.data || ""}
                onChange={this.handleChange} autoComplete="data"/>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="value" name="description" id="description" value={item.description || ""}
                onChange={this.handleChange} autoComplete="description"/>
            </FormGroup>
            <FormGroup>
              <Button color="primary" type="submit">
                Save
              </Button>{" "}
              <Button color="secondary" tag={Link} to="/appointments">
                Cancel
              </Button>
            </FormGroup>
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(AppointmentEdit);
