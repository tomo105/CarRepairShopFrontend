import React, { Component } from "react";
import Popup from "reactjs-popup";
import { Button, ButtonGroup, Container } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";

class CarList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cars: [],
            repairs: [],
            carsLoading: true,
            repairsLoading: true,
            currentPage: 1,
            currentItemLength: 0,
             };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch("api/cars")
            .then(response => response.json())
            .then(data => this.setState({ cars: data, carsLoading: false }));

        fetch("api/repairs")
            .then(response => response.json())
            .then(dataRepairs => this.setState({ repairs: dataRepairs, repairsLoading: false }));
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
        let { cars, repairs, carsLoading, repairsLoading, currentPage, currentItemLength } = this.state;

        if (carsLoading || repairsLoading) {
            return <p>Loading...</p>;
        }

        const carList = cars.map(car => {
            var repairCount = 0;
            var repairItems = [];
            let repairItem = repairs.map(repair => {
                let repairItemMap = [];
                if (repair.numberCar === car.registrationNumber) {
                    repairItemMap.push(repair.numberCar);
                    repairItemMap.push(repair.note);
                    repairItemMap.push(repair.data);
                    repairItemMap.push(repair.nameUser);
                    repairItemMap.push(repair.sparesCosts);
                    repairItemMap.push(repair.serviceCosts);
                    repairItemMap.push(++repairCount);
                    repairItems.push(repairItemMap);
                }
                return repairItemMap;
            });

            function RepairPopup(props) {
                var item = props.repairItems;
                for (let i = 0; i < item.length; i++) {
                    if (item[i].length === 0) {
                        item.splice(i--,1);
                    }
                }
                for (let i = 0; i < item.length; i++) {
                    if (currentPage === item[i][(item[i].length-1)]) {
                        currentItemLength = item.length;
                        return (
                            <div>
                                <h1>Registration Number</h1>
                                <div className="textFrame">{item[i][0]}</div>
                                <h1>Note</h1>
                                <div className="textFrame">{item[i][1]}</div>
                                <h1>Date</h1>
                                <div className="textFrame">{item[i][2]}</div>
                                <h1>Employee</h1>
                                <div className="textFrame">{item[i][3]}</div>
                                <h1>Spares Costs</h1>
                                <div className="textFrame">{item[i][4]}</div>
                                <h1>Service Costs</h1>
                                <div className="textFrame">{item[i][5]}</div>
                            </div>
                        );
                    }
                }
                return <h1>No repairs yet</h1>
            }

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
                            } modal>

                            { close => (
                                <div className="carPopup">
                                    <div className="content">
                                        {" "}
                                        <RepairPopup repairItems={repairItem} />
                                        <div className="actions">
                                            <Button className="button"
                                                    onClick={() => {
                                                        if (currentPage > 1) {
                                                            this.setState(() =>
                                                                ({currentPage: currentPage-1}))
                                                        }}}>-</Button>

                                            <Button className="button"
                                                    onClick={() => {
                                                        if (currentPage < currentItemLength) {
                                                            this.setState(() =>
                                                                ({currentPage: currentPage+1}))
                                                        }}}>+</Button>
                                        </div>
                                        <Button className="button"
                                                onClick={() => {
                                                    currentPage = 1;
                                                    close();
                                                }}
                                        >Close popup window</Button>
                                    </div>
                                </div>
                            )}
                        </Popup>
                    </td>
                    <td>{car.phoneNumber}</td>
                    <td>{car.client}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/cars/" + car.id}>Edit</Button>
                            <Button size="sm" color="danger"
                                    onClick={() => this.remove(car.id)}>Delete</Button>
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
                    <table className="mt-4 table table-hover">
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
                    </table>
                </Container>
            </div>
        );
    }
}

export default CarList;

