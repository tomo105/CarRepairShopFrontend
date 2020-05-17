import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';

import Home from "./Home";

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path="/" exact={true} component={Home} />
          </Switch>
        </Router>
    );
  }
}

export default App;
