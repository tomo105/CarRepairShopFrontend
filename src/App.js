import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import './App.css';
import Appointment from "./Appointment";

import Home from "./Home";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact={true} component={Home}/>
          <Route path="/appointments" exact={true} component={Appointment}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
