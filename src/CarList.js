import React, { Component } from "react";
import Popup from "reactjs-popup";
import { Button, ButtonGroup, Container, Table } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";

class CarList extends Component {
    constructor(props) {
        super(props);
        this.state = { cars: [], isLoading: true, repairs: [] };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch("api/cars")
            .then(response => response.json())
            .then(data => this.setState({ cars: data, isLoading: false }));

        fetch("api/repairs")
            .then(response => response.json())
            .then(dataRepairs => this.setState({ repairs: dataRepairs }));
    }
    async remove(id) {
        await fetch(`/api/car/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(() => {
            let updatedCars = [...this.state.cars].filter(i => i.id !== id);
            this.setState({ cars: updatedCars });
        });
    }
    render() {
        const { cars, repairs, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const carList = cars.map(car => {
            let repairData = "";
            let repairCar = "";
            let repairUser = "";
            let sparesCosts = "";
            let serviceCosts = "";
            const repairNote = repairs.map(repair => {
                let repairInformation = "";
                if (repair.numberCar === car.registrationNumber) {
                    repairInformation = repair.note;
                    repairData = repair.data;
                    repairCar = repair.numberCar;
                    repairUser = repair.nameUser;
                    sparesCosts = repair.sparesCosts;
                    serviceCosts = repair.serviceCosts;
                }
                return repairInformation;
            });

            return (
                <tr key={car.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{car.model}</td>
                    <td>{car.brand}</td>
                    <td>{car.registrationNumber}</td>
                    <td>
                        <Popup
                            trigger={
                                <Button color="info" className="button">
                                    {" "}
                                    Show Information{" "}
                                </Button>
                            }
                            modal
                        >
                            {close => (
                                <div className="carPopup">
                                    <a className="close" onClick={close}>
                                        &times;
                                    </a>
                                    <div className="header"> All information </div>
                                    <div className="content">
                                        {" "}
                                        <h1>Note</h1>
                                        <div className="textFrame">{repairNote}</div>
                                        <h1>Data</h1>
                                        <div className="textFrame">{repairData}</div>
                                        <h1>NumberCar</h1>
                                        <div className="textFrame">{repairCar}</div>
                                        <h1>NameUser</h1>
                                        <div className="textFrame">{repairUser}</div>
                                        <h1>SpacerCosts</h1>
                                        <div className="textFrame">{sparesCosts}</div>
                                        <h1>ServiceCosts</h1>
                                        <div className="textFrame">{serviceCosts}</div>
                                    </div>
                                    <div className="actions">
                                        <Button
                                            className="button"
                                            onClick={() => {
                                                console.log("popup windows closed ");
                                                close();
                                            }}
                                        >
                                            Close popup window
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Popup>
                    </td>
                    <td>{car.phoneNumber}</td>
                    <td>{car.client}</td>
                    <td>
                        <ButtonGroup>
                            <Button
                                size="sm"
                                color="primary"
                                tag={Link}
                                to={"/cars/" + car.id}
                            >
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                color="danger"
                                onClick={() => this.remove(car.id)}
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
                        <Button color="success" tag={Link} to="/cars/new">
                            Add Car
                        </Button>
                    </div>
                    <h3>Cars service</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="17.5%">Model</th>
                            <th width="17.5%">Brand</th>
                            <th>Registration Number</th>
                            <th width="12.5%">Repairs/Damages</th>
                            <th width="10%">Phone Number</th>
                            <th width="10%">Client</th>
                            <th width="10%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>{carList}</tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default CarList;

