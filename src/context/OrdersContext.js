import React, { useState, useEffect } from "react";

let OrdersContext = React.createContext();
let { Provider, Consumer } = OrdersContext;

function OrdersProvider({ children }) {
  let [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(orders);
    console.log("effectOrderss");
    console.log(orders);
  }, [orders]);

  function addOrders(newOrder) {
    setOrders([...orders, newOrder]);
    console.log("orders", orders);
  }

  return <Provider value={{ orders, addOrders }}>{children}</Provider>;
}

export { OrdersProvider, Consumer as OrdersConsumer, OrdersContext };
