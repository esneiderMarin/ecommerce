import React from "react";
import "./App.css";
import { NewOrderForm } from "./components/NewOrderForm";
import { SellOrdersList } from "./components/SellOrdersList";

import { OrdersProvider } from "./context/OrdersContext";
// import useForm from "react-hook-form";

function App() {
  return (
    <div className="container mt-4">
      <OrdersProvider>
        <NewOrderForm />
        <SellOrdersList />
      </OrdersProvider>
    </div>
  );
}

export default App;
