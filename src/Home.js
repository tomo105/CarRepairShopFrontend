import React, { Component } from "react";
import { Button, Container } from "reactstrap";
import { withCookies } from "react-cookie";
import carImg from "./assets/car-list-black.png";
import appointmentImg from "./assets/appointments-black.png";
import employeeImg from "./assets/employees-black.png";
import repairImg from "./assets/repairs-black.png";

import "./App.css";
import AppNavbar from "./AppNavbar";

class Home extends Component {

    state = {
        isLoading: true,
        isAuthenticated: false,
        user: undefined,
        isManager: false,
        isLogistician: false,
        isAccountant: false,
        isMechanic: false
    };

    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state.csrfToken = cookies.get("XSRF-TOKEN");
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        const response = await fetch("/api/login", { credentials: "include" });
        const body = await response.text();
        if (body === "") {
            this.setState({ isAuthenticated: false });
        } else {
            this.setState({ isAuthenticated: true, user: JSON.parse(body) });
            if (this.state.user.setRole === "Manager") {
                this.setState({ isManager: true });
            } else if (this.state.user.setRole === "Logistician") {
                this.setState({ isLogistician: true });
            } else if (this.state.user.setRole === "Accountant") {
                this.setState({ isAccountant: true });
            } else if (this.state.user.setRole === "Mechanic") {
                this.setState({ isMechanic: true });
            }
        }
    }

    login() {
        let port = window.location.port ? ":" + window.location.port : "";
        if (port === ":3000") {
            port = ":8080";
        }
        window.location.href = "//" + window.location.hostname + port + "/login";
    }

    logout() {
        this.setState({ isAuthenticated: false });
        this.setState.csrfToken = "";
    }

    render() {
        const welcomeMessage = this.state.user ? (
            <h2>Welcome, {this.state.user.name} {this.state.user.surname}!</h2>
        ) : (
          <h2>Welcome</h2>
        );
        const loginMessage = (
            <h3>Please log in to Service Station App.</h3>
        );

        const manager = this.state.isManager ? (
          <div>
              <div className="row">
                  <div className="col-lg-3 col-md-3">
                      <a href="/cars"><img src={carImg} alt="Car List"/></a>
                  </div>
                  <div className="col-lg-3 col-md-3">
                      <a href="/appointments"><img src={appointmentImg} alt="Appointments List"/></a>
                  </div>
                  <div className="col-lg-3 col-md-3">
                      <a href="/repairs"><img src={repairImg} alt="Repairs List"/></a>
                  </div>
                  <div className="col-lg-3 col-md-3">
                      <a href="/employees"><img src={employeeImg} alt="Employees List"/></a>
                  </div>
              </div>
          </div>
        ) : (
          <div/>
        );

        const logistician = this.state.isLogistician ? (
            <div>
                <div className="row">
                    <div className="col-lg-3 col-md-3">
                        <a href="/cars"><img src={carImg} alt="Car List" /></a>
                    </div>
                    <div className="col-lg-3 col-md-3">
                        <a href="/appointments"><img src={appointmentImg} alt="Appointments List" /></a>
                    </div>
                    <div className="col-lg-3 col-md-3">
                        <a href="/repairs"><img src={repairImg} alt="Repairs List" /></a>
                    </div>
                    <div className="col-lg-3 col-md-3">
                        <a href="/employees"><img src={employeeImg} alt="Employees List" /></a>
                    </div>
                </div>
            </div>
        ) : (
            <div/>
        );

        const mechanic = this.state.isMechanic ? (
            <div className="row">
                <div className="col-lg-3 col-md-3">
                    <a href="/cars"><img src={carImg} alt="Car List" /></a>
                </div>
                <div className="col-lg-3 col-md-3">
                    <a href="/repairs"><img src={repairImg} alt="Repairs List" /></a>
                </div>
                <div className="col-lg-3 col-md-3">
                    <a href="/employees"><img src={employeeImg} alt="Employees List" /></a>
                </div>
            </div>
        ) : (
            <div/>
        );

        const accountant = this.state.isAccountant ? (
            <div className="row">
                <div className="col-lg-3 col-md-3">
                    <a href="/repairs"><img src={repairImg} alt="Repairs List" /></a>
                </div>
                <div className="col-lg-3 col-md-3">
                    <a href="/employees"><img src={employeeImg} alt="Employees List" /></a>
                </div>
            </div>
        ) : (
            <div/>
        );

        const logoutButton = (
            <div>
                <Button color="primary" onClick={this.logout} className="mainPageButton">
                    Logout
                </Button>
            </div>
        );

        const loginButton = (
            <Button color="primary" onClick={this.login} className="mainPageButton">
                Login
            </Button>
        );

        return this.state.isAuthenticated ? (
          <div>
                <AppNavbar />
                <Container fluid>
                  {welcomeMessage}
                  {manager}
                  {logistician}
                  {mechanic}
                  {accountant}
                  {logoutButton}
                </Container>
          </div>
        ) : (
            <div>
            <AppNavbar />
            <Container fluid>
              {loginMessage}
              {loginButton}
            </Container>
          </div>
        );
    }
}

export default withCookies(Home);