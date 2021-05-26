import React, { useContext } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import { OrdersContext } from "../context/OrdersContext";
import { useHistory } from "react-router-dom";

const ViewOrderDetails = props => {
  let { orders, addOrders } = useContext(OrdersContext);
  const orderDetails = props.location.state
    ? props.location.state.order
    : undefined;
  const history = useHistory();
  console.log(orderDetails);
  if (orderDetails) {
    var {
      sellerStore,
      shippingMethod,
      externalOrderNumber,
      name,
      phone,
      email,
      address,
      city,
      region,
      country,
      itemsData,
      pack_promise_max,
      pack_promise_min,
      ready_pickup_promise_max,
      ready_pickup_promise_min,
      response,
      ship_promise_max,
      ship_promise_min,
      delivery_promise_min,
      delivery_promise_max,
      shippingMethodDesc
    } = orderDetails;
  }

  return (
    <div>
      <ListGroup>
        <h1>Order Details</h1>
        <ListGroupItem>
          Order information
          <ListGroupItem>
            external order number: {externalOrderNumber}
          </ListGroupItem>
          <ListGroupItem> buyer full name: {name} </ListGroupItem>
          <ListGroupItem> buyer phone number: {phone} </ListGroupItem>
          <ListGroupItem> buyer email: {email} </ListGroupItem>
        </ListGroupItem>
        <ListGroupItem>
          Shipping info:
          <ListGroupItem> shipping address: {address}</ListGroupItem>
          <ListGroupItem> shipping city: {city}</ListGroupItem>
          <ListGroupItem> shipping region: {region} </ListGroupItem>
          <ListGroupItem> shipping country: {country} </ListGroupItem>
        </ListGroupItem>
        <ListGroupItem>
          Promise dates
          <ListGroupItem> pack_promise_min: {pack_promise_min} </ListGroupItem>
          <ListGroupItem> pack_promise_max: {pack_promise_max} </ListGroupItem>
          <ListGroupItem> ship_promise_min: {ship_promise_min} </ListGroupItem>
          <ListGroupItem> ship_promise_min: {ship_promise_min} </ListGroupItem>
          <ListGroupItem>
            {" "}
            delivery_promise_min: {delivery_promise_min}{" "}
          </ListGroupItem>
          <ListGroupItem>
            {" "}
            delivery_promise_max: {delivery_promise_max}{" "}
          </ListGroupItem>
          <ListGroupItem>
            {" "}
            ready_pickup_promise_min: {ready_pickup_promise_min}{" "}
          </ListGroupItem>
          <ListGroupItem>
            {" "}
            ready_pickup_promise_max: {ready_pickup_promise_max}{" "}
          </ListGroupItem>
        </ListGroupItem>
        <ListGroupItem>
          Line items (list of items)
          <ListGroupItem>
            {" "}
            product name: {itemsData ? itemsData.itemsProductName : ""}{" "}
          </ListGroupItem>
          <ListGroupItem>
            {" "}
            product qty: {itemsData ? itemsData.itemsProductQty : ""}{" "}
          </ListGroupItem>
          <ListGroupItem>
            {" "}
            product weight: {itemsData ? itemsData.itemsProductWeight : ""}{" "}
          </ListGroupItem>
        </ListGroupItem>
      </ListGroup>
      <Button type="submit" onClick={() => history.push("/orders-list")}>
        Go Back
      </Button>
    </div>
  );
};

export default ViewOrderDetails;
