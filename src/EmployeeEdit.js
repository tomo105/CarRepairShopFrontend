import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
//import AppNavbar from "./AppNavbar";

// import Combobox from "react-widgets/lib/Combobox";
// import "../node_modules/react-widgets/dist/css/react-widgets.css";

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
}

export default withRouter(EmployeeEdit);