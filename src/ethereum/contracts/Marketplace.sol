//SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

contract Marketplace {
    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        string category;
        address payable owner;
        bool purchased;
    }

    event ProductCreated (
        uint id,
        string name,
        uint price,
        string category,
        address payable owner,
        bool purchased
    );

    event ProductPurchased (
        uint id,
        string name,
        uint price,
        address payable seller,
        address buyer,
        bool purchased
    );

    constructor() public {
        name = "My Marketplace";
    }

    function createProduct(string memory _name, uint _price, string memory _category) public {
        require(bytes(_name).length > 0, "Product name cannot be blank");
        require(_price > 0, "Product price should be greater than 0");
        require(bytes(_category).length > 0, "Product category cannot be blank");

        productCount++;

        products[productCount] = Product(productCount, _name, _price, _category, msg.sender, false);

        emit ProductCreated(productCount, _name, _price, _category, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        Product memory myProduct = products[_id];

        require(bytes(myProduct.name).length > 0 && myProduct.price > 0, "Invalid ID");
        require(msg.value >= myProduct.price, "Insufficient ether sent");
        require(!myProduct.purchased, "Product has been sold");

        address payable seller = myProduct.owner;
        myProduct.owner = msg.sender;
        myProduct.purchased = true;
        products[_id] = myProduct;
        seller.transfer(msg.value);

        emit ProductPurchased(_id, myProduct.name, myProduct.price, seller, myProduct.owner, true);
    }
}
