import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
import AppNavbar from "./AppNavbar";

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
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const repair = await (await fetch(
            `/api/repair/${this.props.match.params.id}`
        )).json();
        this.setState({ item: repair });
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
        const { item } = this.state;
        const title = <h2>{item.id ? "Edit Repair" : "Add Repair"}</h2>;

        return (
            <div>
                <AppNavbar />
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="nameUser">User</Label>
                            <Input type="text" name="nameUser" id="nameUser" value={item.nameUser || ""}
                                   onChange={this.handleChange} autoComplete="nameUser" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="numberCar">Registration number</Label>
                            <Input type="text" name="numberCar" id="numberCar" value={item.numberCar || ""}
                                   onChange={this.handleChange} autoComplete="numberCar" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="data">Data</Label>
                            <Input type="date" name="data" id="data" value={item.data || ""}
                                onChange={this.handleChange} autoComplete="data" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="sparesCosts">Spares Costs</Label>
                            <Input type="value" name="sparesCosts" id="sparesCosts" value={item.sparesCosts || ""}
                                onChange={this.handleChange} autoComplete="sparesCosts" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="serviceCosts">Service Costs</Label>
                            <Input type="value" name="serviceCosts" id="serviceCosts" value={item.serviceCosts || ""}
                                onChange={this.handleChange} autoComplete="serviceCosts" style={{width: "350px"}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="note">Note</Label>
                            <Input type="text" name="note" id="note" value={item.note || ""}
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