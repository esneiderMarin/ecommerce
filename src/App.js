import React from "react";
import "./App.css";
import { NewOrderForm } from "./components/NewOrderForm";
import { SellOrdersList } from "./components/SellOrdersList";

import { OrdersProvider } from "./context/OrdersContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ViewOrderDetails from "./components/ViewOrderDetails";
// import useForm from "react-hook-form";

function App() {
  return (
    <div className="container mt-4">
      <OrdersProvider>
        <Router>
          <Switch>
            <Route path="/create" exact component={NewOrderForm}></Route>
          </Switch>
          <Switch>
            <Route
              path={["/", "/orders-list"]}
              exact
              component={SellOrdersList}
            ></Route>
          </Switch>
          <Switch>
            <Route
              path="/view-order-details/:id"
              exact
              component={ViewOrderDetails}
            ></Route>
          </Switch>

          {/* <NewOrderForm />
          <SellOrdersList /> */}
        </Router>
      </OrdersProvider>
    </div>
  );
}

export default App;
