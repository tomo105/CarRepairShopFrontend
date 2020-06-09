import AppNavbar from "./AppNavbar";
import { Button, ButtonGroup, Container } from "reactstrap";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Repairs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            repairs: [],
            user: undefined
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch("api/login")
            .then(response => response.json())
            .then(data => this.setState({ user: data }));

        fetch("api/repairs")
            .then(response => response.json())
            .then(dataRepairs => this.setState({ repairs: dataRepairs, isLoading: false }));
    }

    async remove(id) {
        await fetch(`/api/repair/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(() => {
            let updatedRepairs = [...this.state.repairs].filter(i => i.id !== id);
            this.setState({ repairs: updatedRepairs });
        });
    }

    render() {
        const { repairs, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading...</p>;
        }

        const repairList = repairs.map(repair => {
            return (
                <tr key={repair.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{repair.nameUser}</td>
                    <td>{repair.numberCar}</td>
                    <td>{repair.data}</td>
                    <td>{repair.sparesCosts}</td>
                    <td>{repair.serviceCosts}</td>
                    <td>{repair.note}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/repairs/" + repair.id}>Edit</Button>
                            <Button size="sm" color="danger"
                                    onClick={() => this.remove(repair.id)}>Delete</Button>
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
                        <Button color="success" tag={Link} to="/repairs/new">
                            Add new repair
                        </Button>
                    </div>
                    <h3>Repair panel</h3>
                    <table className="mt-4 table table-hover">
                        <thead>
                        <tr>
                            <th width="15%">User</th>
                            <th width="15%"> Registration number</th>
                            <th width="10%">Data</th>
                            <th width="15%">Spares cost</th>
                            <th width="15%">Service cost</th>
                            <th width="30%">Note</th>
                        </tr>
                        </thead>
                        <tbody>{repairList}</tbody>
                    </table>
                </Container>
            </div>
        );
    }
}

export default Repairs;