import React, { Component } from "react";
import { Button, Container } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";


class EmployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: undefined,
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

    async componentDidMount() {
        this.setState({ isLoading: true });

        const response = await fetch("/api/login", { credentials: "include" });
        const body = await response.text();
        if (body !== "") {
            this.setState({ currentUser: JSON.parse(body)});
        }

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
        const { employees, appointments, isLoading, currentUser } = this.state;

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
            let allAppointments = [];
            for (let i = 0; i < count; i++) {
                let sepAppointment = [];
                sepAppointment.push("id" + i);
                sepAppointment.push(appointment[i*4]);
                sepAppointment.push(appointment[i*4+1]);
                sepAppointment.push(appointment[i*4+2]);
                sepAppointment.push(appointment[i*4+3]);
                allAppointments.push(sepAppointment);
            }

            const items = allAppointments.map(appointment => {
                return (
                    <tr key={appointment[0]}>
                        <td>{appointment[1]}</td>
                        <td>{appointment[2]}</td>
                        <td>{appointment[3]}</td>
                        <td>{appointment[4]}</td>
                    </tr>
                );
            });

            return <div>
                <table>
                    <thead>
                        <tr>
                            <th width="20%">Employee</th>
                            <th width="20%">Registration number</th>
                            <th width="20%">Appointment Date</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>{items}</tbody>
                </table>
            </div>;
        }

        function AppointmentList(props) {
            let appointment = props.appointment;
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

        function Schedule(props) {
            let appointmentWeekly = [];
            let appointmentMonthly = [];
            let appointmentAnnual = [];
            const __ret = appointmentsMap(props.employee, appointmentWeekly, appointmentMonthly, appointmentAnnual);
            appointmentWeekly = __ret.appointmentWeekly;
            appointmentMonthly = __ret.appointmentMonthly;
            appointmentAnnual = __ret.appointmentAnnual;
            if (props.employee.setRole !== "Mechanic" && props.employee.setRole !== "Manager") {
                return ( <div><td/><td/><td/></div> );
            } else {
                return (
                    <div>
                        <td><AppointmentList appointment={appointmentWeekly} period="Weekly"/></td>
                        <td><AppointmentList appointment={appointmentMonthly} period="Monthly"/></td>
                        <td><AppointmentList appointment={appointmentAnnual} period="Annual"/></td>
                    </div>
                );
            }
        }

        function Action(props) {
            if ( (currentUser.id === props.employee.id) || currentUser.setRole === "Manager" ) {
                return (
                    <td>
                        <Button size="md" color="primary" tag={Link}
                                to={"/employees/" + props.employee.id}>Edit</Button>
                    </td>
                );
            } else {
                return ( <td/> );
            }
        }

        const allEmployees = employees.map(employee => {
            return (
                <tr key={employee.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{employee.name}</td>
                    <td>{employee.surname}</td>
                    <td>{employee.experience}</td>
                    <td>{employee.experienceInCompany}</td>
                    <td>{employee.setRole}</td>
                    <Schedule employee={employee}/>
                    <Action employee={employee}/>
                </tr>
            );
        });

        const employeeList = employees.map(employee => {
            let appointmentWeekly = [];
            let appointmentMonthly = [];
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
                        <Schedule employee={employee}/>
                        <Action employee={employee}/>
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
        } else {
            res = <tbody>{allEmployees}</tbody>;
        }

        function AddButton() {
            if (currentUser.setRole === "Manager") {
                return (
                <Button color="success" tag={Link} to="/employees/new">
                    Add Employee
                </Button>
                );
            }
            return <div></div>;
        }

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
                        <AddButton />
                    </div>
                    <h3>Employees</h3>
                    <table className="mt-4 table table-hover">
                        <thead>
                        <tr>
                            <th width="10%">Name</th>
                            <th width="10%">Surname</th>
                            <th width="10%">Experience</th>
                            <th width="10%">Experience in company</th>
                            <th width="10%">Role</th>
                            <th width="30%">Schedule</th>
                            <th width="20%">Action</th>
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