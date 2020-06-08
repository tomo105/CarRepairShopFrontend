import React, { Component } from "react";
import { Button, Container } from "reactstrap";
import { withCookies } from "react-cookie";

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
            <h2>Welcome, {this.state.user.setRole}!</h2>
        ) : (
          <h2>Welcome</h2>
        );
        const loginMessage = (
            <h3>Please log in to Service Station App.</h3>
        );

        const manager = this.state.isManager ? (
          <div>
            <Button
              href="/appointments"
              color="outline-primary"
              style={{
                margin: "10px",
                marginLeft: "0px"
              }}>
              Appointments
            </Button>
            {' '}

            <Button
              href="/cars"
              color="outline-primary"
              style={{
                margin: "10px",
              }}>
              Car list
            </Button>
            {' '}

            <Button
              href="/employees"
              color="outline-primary"
              style={{
                margin: "10px",
              }}>
              Employees
            </Button>
            {' '}

            <Button
              href="/repairs"
              color="outline-primary"
              style={{
                margin: "10px",
              }}>
              Repairs
            </Button>
            {' '}

          </div>
        ) : (
          <div/>
        );

        const logistician = this.state.isLogistician ? (
          <div>
            <Button
              href="/appointments"
              color="outline-primary"
              style={{
                margin: "10px",
                marginLeft: "0px"
              }}>
              Appointments
            </Button>
            <Button
              href="/cars"
              color="outline-primary"
              style={{
                margin: "10px",
              }}>
              Car list
            </Button>
          </div>
        ) : (
          <div />
        );

        const mechanic = this.state.isMechanic ? (
          <div>
            <Button
              href="/repairs"
              color="outline-primary"
              style={{
                margin: "10px",
                marginLeft: "0px"
              }}>
              Repairs
            </Button>
          </div>
        ) : (
            <div />
        );

        const logoutButton = (
            <div>
                <Button
                  color="primary"
                  onClick={this.logout}
                  style={{
                    margin: "10px",
                    marginLeft: "0px"
                  }}>
                    Logout
                </Button>
            </div>
        );

        const loginButton = (
            <Button
              color="primary"
              onClick={this.login}
              style={{
                margin: "10px",
                marginLeft: "0px"
              }}>
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