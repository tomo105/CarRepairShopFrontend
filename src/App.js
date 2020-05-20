import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import "./App.css";
import Appointment from "./Appointment";
import CarList from "./CarList";
import CarEdit from "./CarEdit";
import EmployeeList from "./EmployeeList";
import EmployeeEdit from "./EmployeeEdit";

import Home from "./Home";

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact={true} component={Home}/>
                    <Route path="/appointments" exact={true} component={Appointment}/>
                    <Route path="/cars" exact={true} component={CarList}/>
                    <Route path="/cars/:id" component={CarEdit}/>
                    <Route path="/employees" exact={true} component={EmployeeList} />
                    <Route path="/employees/:id" component={EmployeeEdit} />
                </Switch>
            </Router>
        );
    }
}

export default App;
