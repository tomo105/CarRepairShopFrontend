import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import AppNavbar from "./AppNavbar";
import Combobox from "react-widgets/lib/Combobox";

class RepairsEdit extends Component {
    emptyItem = {
        nameUser: "",
        numberCar: "",
        data: "",
        sparesCosts: "",
        serviceCosts: "",
        note: ""
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
            fetch(`/api/repair/${this.props.match.params.id}`)
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
        let item = { ...this.state.item };
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
        const { item } = this.state;

        await fetch("/api/repair", {
            method: item.id ? "PUT" : "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });
        this.props.history.push("/repairs");
    }

    render() {
        const { item, cars, employees, itemLoading, employeesLoading, carsLoading } = this.state;
        const title = <h2>{item.id ? "Edit Repair" : "Add Repair"}</h2>;

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
                <AppNavbar />
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="nameUser">User</Label>
                            <Combobox type="text" name="nameUser" id="nameUser" data={usersList}
                                   onChange={this.usernameChange}defaultValue={ item.nameUser || "" }/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="numberCar">Registration number</Label>
                            <Combobox type="text" name="numberCar" id="numberCar" data={registrationNumbersList}
                                      onChange={this.numberCarChange} defaultValue={ item.numberCar || "" } />
                        </FormGroup>
                        <FormGroup>
                            <Label for="data">Data</Label>
                            <Input type="text" name="data" id="data" value={item.data || ""}
                                onChange={this.handleChange} autoComplete="data"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="sparesCosts">Spares Costs</Label>
                            <Input type="value" name="sparesCosts" id="sparesCosts" value={item.sparesCosts || ""}
                                onChange={this.handleChange} autoComplete="sparesCosts"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="serviceCosts">Service Costs</Label>
                            <Input type="value" name="serviceCosts" id="serviceCosts" value={item.serviceCosts || ""}
                                onChange={this.handleChange} autoComplete="serviceCosts"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="note">Note</Label>
                            <Input type="value" name="note" id="note" value={item.note || ""}
                                onChange={this.handleChange} autoComplete="note"/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">
                                Save
                            </Button>{" "}
                            <Button color="secondary" tag={Link} to="/repairs">
                                Cancel
                            </Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(RepairsEdit);