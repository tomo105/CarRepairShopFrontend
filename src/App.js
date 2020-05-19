import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import "./App.css";
import Appointment from "./Appointment";
import CarList from "./CarList";
import CarEdit from "./CarEdit";

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
                </Switch>
            </Router>
        );
    }
}

export default App;
