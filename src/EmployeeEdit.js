import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import AppNavbar from "./AppNavbar";

import Combobox from 'react-widgets/lib/Combobox'
import "../node_modules/react-widgets/dist/css/react-widgets.css";

class EmployeeEdit extends Component {
    emptyItem = {
        name: "",
        surname: "",
        setRole: "",
        experience: "",
        experienceInCompany: "",
        login: "",
        password: ""
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
            const employee = await (await fetch(
                `/api/employee/${this.props.match.params.id}`
            )).json();
            this.setState({ item: employee });
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

    async handleSubmit(event) {
        event.preventDefault();
        const { item } = this.state;

        await fetch("/api/employee", {
            method: item.id ? "PUT" : "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });
        this.props.history.push("/employees");
    }

    render() {
        const { item } = this.state;
        const title = <h2>{item.id ? "Edit Employee" : "Add Employee"}</h2>;

        let roles = ["Manager", "Logistician", "Mechanic", "Accountant"];

        return (
            <div>
                <AppNavbar />
                <Container >
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" id="name" value={item.name || ""}
                                onChange={this.handleChange} autoComplete="name" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="surname">Surname</Label>
                            <Input type="text" name="surname" id="surname" value={item.surname || ""}
                                onChange={this.handleChange} autoComplete="surname" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="setRole">Role</Label>
                            <Combobox type="text" name="setRole" id="setRole" data={roles} defaultValue={"Mechanic"}
                                onBlur={this.handleChange} autoComplete="setRole" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="experience">Experience</Label>
                            <Input type="value" name="experience" id="experience" value={item.experience || ""}
                                onChange={this.handleChange} autoComplete="experience" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="experienceInCompany">Experience in company</Label>
                            <Input type="value" name="experienceInCompany" id="experienceInCompany" value={item.experienceInCompany || ""}
                                onChange={this.handleChange} autoComplete="experienceInCompany" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="login">Login</Label>
                            <Input type="text" name="login" id="login" value={item.login || ""}
                                onChange={this.handleChange} autoComplete="login" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" id="password" value={item.password || ""}
                                onChange={this.handleChange} autoComplete="password" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">
                                Save
                            </Button>{" "}
                            <Button color="secondary" tag={Link} to="/employees">
                                Cancel
                            </Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(EmployeeEdit);
