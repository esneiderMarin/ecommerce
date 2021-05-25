import React, { useState, useEffect, useContext } from "react";
import melonn from "../apis/melonn";
import purchases from "../apis/purchases";
import { OrdersContext } from "../context/OrdersContext";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
export const NewOrderForm = props => {
  let { orders, addOrders } = useContext(OrdersContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState();
  const [selected, setSelected] = useState();
  //const formData = useRef();
  const [formData, setFormData] = useState({
    sellerStore: "",
    shippingMethod: "",
    externalOrderNumber: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    region: "",
    country: "",
    itemsData: { productName: "", productQty: 0, productWeight: 0 }
  });
  const [itemsData, setItemsData] = useState({
    itemsProductName: "",
    itemsProductQty: 0,
    itemsProductWeight: 0
  });

  const toggle = () => setDropdownOpen(prevState => !prevState);

  useEffect(() => {
    const response = async () => {
      const response = await melonn.get("/shipping-methods");
      setDropdownOptions(response);
      console.log(response);
    };

    response();
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      itemsData
    });
    console.log("effectItemsData");
    console.log(formData);
    console.log(itemsData);
  }, [itemsData]);

  const renderedOptions =
    dropdownOptions !== undefined ? (
      //console.log("options", dropdownOptions),
      //console.log("ref", formData),
      dropdownOptions.data.map(option => {
        return (
          <DropdownItem
            key={option.id}
            onClick={() => {
              setSelected(option);
              setFormData({
                ...formData,
                ["shippingMethod"]: option.id
              });
              console.log("formData in render", formData);
            }}
            //onChange={e => updateFormData(e)}
            // ref={formData}
          >
            {option.name}
          </DropdownItem>
        );
      })
    ) : (
      <DropdownItem></DropdownItem>
    );

  const updateFormData = event => {
    if (!event.target.name.includes("items")) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    } else {
      setItemsData({
        ...itemsData,
        [event.target.name]: event.target.value
      });
    }
    console.log(itemsData);
    console.log(formData);
  };

  const submitForm = e => {
    e.preventDefault();

    setFormData({
      ...formData,
      itemsData
    });

    const response = async () => {
      const response = await purchases
        .post(`/orders`, { formData })
        .then(res => {
          console.log(res);
          console.log(res.data);
          let orderData = {
            ...formData,
            ...res.data,
            shippingMethodDesc: selected.name
          };
          if (res.data.status == "OK") {
            addOrders(orderData);
          }
        });
    };

    response();

    const form = e.target;
    const data = new FormData(form);
    console.log(formData);
  };

  return (
    <div>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} className="text-center">
          <h2>New Order Info</h2>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Form onSubmit={submitForm}>
            <FormGroup required>
              <Label for="sellerStore">Seller store</Label>
              <Input
                name="sellerStore"
                placeholder="Store"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="shippingMethod">Shipping method</Label>
              <Dropdown
                name="shippingMethod"
                isOpen={dropdownOpen}
                toggle={toggle}
                onChange={e => () => updateFormData(e)}
              >
                <DropdownToggle name="shippingMethod" caret>
                  {selected ? selected.name : "Select"}
                </DropdownToggle>
                <DropdownMenu
                  onChange={e => updateFormData(e)}
                  name="shippingMethod"
                >
                  <DropdownItem header>Select</DropdownItem>
                  {renderedOptions}
                </DropdownMenu>
              </Dropdown>
              {/* <Dropdown
                name="shippingMethod"
                placeholder="ship method"
              ></Dropdown> */}
            </FormGroup>
            <FormGroup>
              <Label for="externalOrderNumber">External order number</Label>
              <Input
                name="externalOrderNumber"
                placeholder="order number"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="name">Buyer full name</Label>
              <Input
                name="name"
                placeholder="full name"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="phone">Buyer phone number</Label>
              <Input
                name="phone"
                placeholder="phone number"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="email">Buyer email</Label>
              <Input
                name="email"
                placeholder="email"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="address">Shipping address</Label>
              <Input
                name="address"
                placeholder="shipping address"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="city">Shipping city</Label>
              <Input
                name="city"
                placeholder="city"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="region">Shipping region</Label>
              <Input
                name="region"
                placeholder="region"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="country">Shipping country</Label>
              <Input
                name="country"
                placeholder="country"
                onChange={e => updateFormData(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="items">Line items (Product Info)</Label>
            </FormGroup>
            <FormGroup row>
              <Label for="productName" sm={2} size="md">
                Name
              </Label>
              <Col sm={2}>
                <Input
                  type="productName"
                  name="itemsProductName"
                  id="productName"
                  placeholder="name"
                  bsSize="md"
                  onChange={e => updateFormData(e)}
                />
              </Col>

              <Label for="productQty" sm={2} size="md">
                Quantity
              </Label>
              <Col sm={2}>
                <Input
                  type="number"
                  name="itemsProductQty"
                  id="productQty"
                  placeholder="qty"
                  bsSize="md"
                  onChange={e => updateFormData(e)}
                />
              </Col>

              <Label for="productWeight" sm={2} size="md">
                Weight
              </Label>
              <Col sm={2}>
                <Input
                  type="number"
                  name="itemsProductWeight"
                  id="productWeight"
                  placeholder="weight"
                  bsSize="md"
                  onChange={e => updateFormData(e)}
                />
              </Col>
            </FormGroup>

            <br></br>
            <Button type="submit" onSubmit={submitForm}>
              Create Order
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
