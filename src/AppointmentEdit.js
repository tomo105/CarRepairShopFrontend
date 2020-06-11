import React, {Component} from "react";
import {Button, Container, Form, FormGroup, Input, Label} from "reactstrap";
import {Link, withRouter} from "react-router-dom";
import AppNavbar from "./AppNavbar";
import Combobox from "react-widgets/lib/Combobox";

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
      itemLoading: true,
      employeesLoading: true,
      carsLoading: true,
      employees: [],
      cars: [],
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.usernameChange = this.usernameChange.bind(this);
    this.numberCarChange = this.numberCarChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    fetch("/api/employees")
        .then(response => response.json())
        .then(data => this.setState({ employees: data, employeesLoading: false }));

    fetch("/api/cars")
        .then(response => response.json())
        .then(data => this.setState({ cars: data, carsLoading: false }));

    if (this.props.match.params.id !== "new") {
      fetch(`/api/appointment/${this.props.match.params.id}`)
          .then(response => response.json())
          .then(data => this.setState({ item: data, itemLoading: false }));
    } else {
      this.setState({itemLoading: false});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({ item });
  }

  usernameChange(event) {
    let item = {...this.state.item};
    item.nameUser = event;
    this.setState( { item });
  }

  numberCarChange(event) {
    let item = {...this.state.item};
    item.numberCar = event;
    this.setState( { item });
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
    const { item, cars, employees, itemLoading, employeesLoading, carsLoading } = this.state;
    const title = <h2>{item.id ? "Edit Appointment" : "Add Appointment"}</h2>;

    if (itemLoading || employeesLoading || carsLoading) {
      return <p>Loading...</p>;
    }

    let usersList = [];
    employees.map(employee => {
      usersList.push(employee.surname);
    });

    let registrationNumbersList = [];
    cars.map(car => {
      registrationNumbersList.push(car.registrationNumber);
    });

    return (
      <div>
        <AppNavbar/>
        <Container>
          {title}
          <Form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="nameUser">User</Label>
                  <Combobox className="input" type="text" name="nameUser" id="nameUser" data={usersList}
                            onChange={this.usernameChange} defaultValue={ item.nameUser || "" }/>
                </FormGroup>
              </div>
              <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="numberCar">Registration number</Label>
                  <Combobox className="input" type="text" name="numberCar" id="numberCar" data={registrationNumbersList}
                            onChange={this.numberCarChange} defaultValue={ item.numberCar || "" } />
                </FormGroup>
              </div>
              <div className="form-group col-md-4">
                <FormGroup>
                  <Label for="data">Data</Label>
                  <Input className="input" type="date" name="data" id="data" value={item.data || ""}
                         onChange={this.handleChange} autoComplete="data"/>
                </FormGroup>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-12">
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input className="input" type="value" name="description" id="description" value={item.description || ""}
                         onChange={this.handleChange} autoComplete="description"/>
                </FormGroup>
              </div>
            </div>

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
