import React, { Component } from "react";
import { Button, Container } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";


class EmployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whichOne: "",
            employees: [],
            appointments: [],
            isLoading: true,
            period: ""
        };
    }

    managerClick() {
        this.setState({ whichOne: "Manager" });
    }
    mechanicClick() {
        this.setState({ whichOne: "Mechanic" });
    }
    logisticianClick() {
        this.setState({ whichOne: "Logistician" });
    }
    accountantClick() {
        this.setState({ whichOne: "Accountant" });
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch("api/employees")
            .then(response => response.json())
            .then(data => this.setState({ employees: data, isLoading: false }));

        fetch("api/appointments")
            .then(response => response.json())
            .then(dataAppointments =>
                this.setState({ appointments: dataAppointments })
            );
    }
    render() {
        const { employees, appointments, isLoading } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const dateToFormat = new Date();
        var weekStamp = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        var monthStamp = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        var yearStamp = new Date().getTime() + 365 * 24 * 60 * 60 * 1000;

        function appointmentsMap(employee, appointmentWeekly, appointmentMonthly, appointmentAnnual) {
            appointments.map(appointment => {
                let appointmentInformation = "";
                let d = new Date(appointment.data);
                if (appointment.nameUser === employee.surname) {
                    if (d >= dateToFormat && d <= weekStamp) {
                        appointmentWeekly.push(appointment.nameUser);
                        appointmentWeekly.push(appointment.numberCar);
                        appointmentWeekly.push(appointment.data);
                        appointmentWeekly.push(appointment.description);
                    }
                    if (d >= dateToFormat && d <= monthStamp) {
                        appointmentMonthly.push(appointment.nameUser);
                        appointmentMonthly.push(appointment.numberCar);
                        appointmentMonthly.push(appointment.data);
                        appointmentMonthly.push(appointment.description);
                    }
                    if (d >= dateToFormat && d <= yearStamp) {
                        appointmentAnnual.push(appointment.nameUser);
                        appointmentAnnual.push(appointment.numberCar);
                        appointmentAnnual.push(appointment.data);
                        appointmentAnnual.push(appointment.description);
                    }
                }
                return appointmentInformation;
            });
            return {appointmentWeekly, appointmentMonthly, appointmentAnnual};
        }

        function AppointmentDetails(props) {
            let appointment = props.details;
            if (appointment.length === 0) {
                return <div/>
            }
            let count = appointment.length / 4;

            const items = [];
            for (let i = 0; i < count; i++) {
                items.push(<td>{appointment[i*4]}</td>);
                items.push(<td>{appointment[i*4+1]}</td>);
                items.push(<td>{appointment[i*4+2]}</td>);
                items.push(<td>{appointment[i*4+3]}</td>);
            }
            return <div>
                <thead>
                <tr>
                    <th width="25%">Name</th>
                    <th width="25%">Surname</th>
                    <th width="20%">Experience</th>
                    <th>Experience in company</th>
                </tr>
                </thead>
                {items}
            </div>;
        }

        function AppointmentList(props) {
            let appointment = props.appointment;
            console.log("?????", appointment);
            return <div>
                <Popup trigger={
                        <Button color="info" className="button">
                            {" "} {props.period} Schedule {" "}
                        </Button>
                    } modal >
                    {close => (
                        <div className="carPopup">
                            <div className="content">
                                {" "}
                                <h1>{props.period} Schedule</h1>
                                <div className="textFrame">
                                    <AppointmentDetails details={appointment} />
                                </div>
                            </div>
                            <div className="actions">
                                <Button className="button" onClick={() => {
                                    close(); } }>Close popup window</Button>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
        }

        const allEmployees = employees.map(employee => {
            let appointmentWeekly = [];
            let appointmentMonthly = [];
            let appointmentAnnual = [];
            const __ret = appointmentsMap(employee, appointmentWeekly, appointmentMonthly, appointmentAnnual);
            appointmentWeekly = __ret.appointmentWeekly;
            appointmentMonthly = __ret.appointmentMonthly;
            appointmentAnnual = __ret.appointmentAnnual;
            return (
                <tr key={employee.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{employee.name}</td>
                    <td>{employee.surname}</td>
                    <td>{employee.experience}</td>
                    <td>{employee.experienceInCompany}</td>
                    <td>{employee.setRole}</td>
                    <td>
                        <AppointmentList appointment={appointmentWeekly} period="Weekly"/>
                    </td>
                    <td>
                        <AppointmentList appointment={appointmentMonthly} period="Monthly"/>
                    </td>
                    <td>
                        <AppointmentList appointment={appointmentAnnual} period="Annual"/>
                    </td>
                    <td>
                        <Button size="md" color="primary" tag={Link}
                                to={"/employees/" + employee.id}>Edit</Button>
                    </td>
                </tr>
            );
        });

        const employeeList = employees.map(employee => {
            let appointmentWeekly = "";
            let appointmentMonthly = "";
            let appointmentAnnual = [];
            if (this.state.whichOne !== null && employee.setRole === this.state.whichOne) {
                appointmentsMap(employee, appointmentWeekly, appointmentMonthly, appointmentAnnual);
                return (
                    <tr key={employee.id}>
                        <td style={{whiteSpace: "nowrap"}}>{employee.name}</td>
                        <td>{employee.surname}</td>
                        <td>{employee.experience}</td>
                        <td>{employee.experienceInCompany}</td>
                        <td>{employee.setRole}</td>
                        <td>
                            <AppointmentList appointment={appointmentWeekly} period="Weekly"/>
                        </td>
                        <td>
                            <AppointmentList appointment={appointmentMonthly} period="Monthly"/>
                        </td>
                        <td>
                            <AppointmentList appointment={appointmentAnnual} period="Annual"/>
                        </td>
                        <td>
                            <Button size="md" color="primary" tag={Link}
                                    to={"/employees/" + employee.id}>Edit</Button>
                        </td>
                    </tr>
                );
            }
            return <div/>
        });

        const isRole = this.state.whichOne;
        let res;
        if (isRole === "Manager") {
            res = <tbody>{employeeList}</tbody>;
        } else if (isRole === "Mechanic") {
            res = <tbody>{employeeList}</tbody>;
        } else if (isRole === "Logistician") {
            res = <tbody>{employeeList}</tbody>;
        } else if (isRole === "Accountant") {
            res = <tbody>{employeeList}</tbody>;
        } else res = <tbody>{allEmployees}</tbody>;
        return (
            <div>
                <AppNavbar />
                <Container fluid>
                    <div className="float-right">
                        <Button color="info" onClick={this.managerClick.bind(this)}>
                            Search Managers
                        </Button>
                        <Button color="info" onClick={this.mechanicClick.bind(this)}>
                            Search Mechanics
                        </Button>
                        <Button color="info" onClick={this.logisticianClick.bind(this)}>
                            Search Logisticians
                        </Button>
                        <Button color="info" onClick={this.accountantClick.bind(this)}>
                            Search Accountants
                        </Button>
                        <Button color="success" tag={Link} to="/employees/new">
                            Add Employee
                        </Button>
                    </div>
                    <h3>Employees</h3>
                    <table className="mt-4 table table-hover">
                        <thead>
                        <tr>
                            <th width="25%">Name</th>
                            <th width="25%">Surname</th>
                            <th width="20%">Experience</th>
                            <th width="20%">Experience in company</th>
                            <th width="10%">Role</th>
                        </tr>
                        </thead>
                        {res}
                    </table>
                </Container>
            </div>
        );
    }
}

export default EmployeeList;