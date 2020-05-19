import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";
// import AppNavbar from "./AppNavbar";

class GroupEdit extends Component {
    emptyItem = {
        model: "",
        brand: "",
        registrationNumber: "",
        client: "",
        phoneNumber: "",
        damage: "",
        amendments: ""
    };
}

export default withRouter(GroupEdit);