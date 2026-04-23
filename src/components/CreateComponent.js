import React from 'react';
import { Form, Button, Col, Row, InputGroup } from 'react-bootstrap';

const Create = (props) => {
    return (
        <div className="container border p-3 mt-3">
            <h2>Add Product</h2>
            <hr />
            <Form onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.target);
                // Enhanced form submission: now passes category to smart contract
                // Improvement: Category data is captured from form and sent along with name and price
                props.createProduct(
                    data.get('productName'),
                    data.get('productCategory'),  // New parameter passed to contract
                    window.web3.utils.toWei(data.get('productPrice')).toString(),
                    'Ether'
                );
            }}>
                <Form.Group as={Row} controlId="formProductName">
                    <Form.Label column sm="1">Name</Form.Label>
                    <Col sm="4">
                        <Form.Control
                            name="productName"
                            type="text" 
                            placeholder="Enter product name" 
                            // ref={name => this.productName = name}
                        />
                    </Col>
                </Form.Group>

                {/* New Form Group: Category input field */}
                {/* Improvement: Users can now specify product category during creation */}
                <Form.Group as={Row} controlId="formProductCategory">
                    <Form.Label column sm="1">Category</Form.Label>
                    <Col sm="4">
                        <Form.Control
                            name="productCategory"
                            type="text"
                            placeholder="Enter product category"
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formProductPrice">
                    <Form.Label column sm="1">Price</Form.Label>
                    <Col sm="4">
                        <Form.Control
                            name="productPrice"
                            type="number" 
                            placeholder="Enter product price"
                            // ref={price => this.productPrice = price}
                        />
                    </Col>
                    <Col sm="1">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">ETH</InputGroup.Text>
                        </InputGroup.Prepend>
                    </Col>
                </Form.Group>
                <hr />
                <Button variant="primary" type="submit">Create</Button>
            </Form>
        </div>
    );
}

export default Create;
