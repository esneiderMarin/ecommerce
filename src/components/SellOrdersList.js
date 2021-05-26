import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { OrdersContext } from "../context/OrdersContext";
import { Table, Row, Col, Button } from "reactstrap";

export const SellOrdersList = props => {
  let { orders, addOrders } = useContext(OrdersContext);
  const history = useHistory();

  const viewOrder = order => {
    history.push({
      pathname: `/view-order-details/${order.internalOrderNumber}`,
      state: { order: order }
    });
    //history.push(`/view-order-details/${orderId}`);
  };

  const ordersMap = orders.map(order => {
    return (
      <tr key={order.internalOrderNumber} onClick={() => viewOrder(order)}>
        <th scope="row">{order.internalOrderNumber}</th>
        <td>{order.sellerStore}</td>
        <td>{order.creationDate}</td>
        <td>{order.shippingMethodDesc}</td>
      </tr>
    );
  });

  return (
    <div>
      <Button type="submit" onClick={() => history.push("/create")}>
        Create Order
      </Button>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} className="text-center">
          <h2>Orders</h2>
        </Col>
      </Row>
      {ordersMap.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Store</th>
              <th>Creation Date</th>
              <th>Shipping Method</th>
            </tr>
          </thead>
          <tbody>{ordersMap}</tbody>
        </Table>
      ) : (
        <div>It looks like there is still no orders to show</div>
      )}
    </div>
  );
};
