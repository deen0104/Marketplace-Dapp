//SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

contract Marketplace {
    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    // Enhanced Product struct with category field
    // Improvement: Added category to provide richer product metadata beyond name and price
    struct Product {
        uint id;
        string name;
        string category;  // New field: stores product category for classification
        uint price;
        address payable owner;
        bool purchased;
    }

    // Enhanced ProductCreated event with category parameter
    // Improvement: Event now emits category data for frontend to capture and display
    event ProductCreated (
        uint id,
        string name,
        string category,  // New parameter: allows clients to track category on product creation
        uint price,
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

    // Enhanced createProduct function now accepts category parameter
    // Improvement: Function signature updated to include _category, enabling product categorization
    function createProduct(string memory _name, string memory _category, uint _price) public {
        require(bytes(_name).length > 0, "Product name cannot be blank");
        // New validation: category field cannot be blank, ensuring complete product data
        require(bytes(_category).length > 0, "Product category cannot be blank");
        require(_price > 0, "Product price should be greater than 0");

        productCount++;

        // Category is now stored on-chain as part of product data
        products[productCount] = Product(productCount, _name, _category, _price, msg.sender, false);

        // Enhanced event emission now includes category for frontend tracking
        emit ProductCreated(productCount, _name, _category, _price, msg.sender, false);
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
