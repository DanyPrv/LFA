import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Regex from "./Regex";
import MainApp from "./MainApp";
import GraphContainer from "./Graph";

const App = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={null}>
        <Switch>
          <Route exact path="/regex" name="Regex Page" render={(props) => <Regex {...props} />} />
          <Route exact path="/graph" name="Regex Page" render={(props) => <GraphContainer {...props} />} />
          <Route name="Main Page" render={(props) => <MainApp {...props} />} />
        </Switch>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
