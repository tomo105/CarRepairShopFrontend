import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import "./App.css";
import Appointment from "./Appointment";
import AppointmentEdit from "./AppointmentEdit";
import CarList from "./CarList";
import CarEdit from "./CarEdit";
import EmployeeList from "./EmployeeList";
import EmployeeEdit from "./EmployeeEdit";
import Repairs from "./Repairs";
import RepairsEdit from "./RepairsEdit";

import Home from "./Home";

class App extends Component {
    render() {
        return (
            <div className="background">
            <Router>
                <Switch>
                    <Route path="/" exact={true} component={Home}/>
                    <Route path="/appointments" exact={true} component={Appointment}/>
                    <Route path="/appointments/:id" component={AppointmentEdit} />
                    <Route path="/cars" exact={true} component={CarList}/>
                    <Route path="/cars/:id" component={CarEdit}/>
                    <Route path="/employees" exact={true} component={EmployeeList} />
                    <Route path="/employees/:id" component={EmployeeEdit} />
                    <Route path="/repairs" exact={true} component={Repairs} />
                    <Route path="/repairs/:id" component={RepairsEdit} />
                </Switch>
            </Router>
            </div>
        );
    }
}

export default App;
