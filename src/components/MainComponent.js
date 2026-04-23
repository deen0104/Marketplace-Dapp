import React, { Component } from 'react';
import Web3 from 'web3';
import Marketplace from '../ethereum/build/Marketplace.json';
import Header from './HeaderComponent';
import Create from './CreateComponent';
import Products from './ListComponent';

class Main extends Component {
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Non-Ethereum browser detected. Try using MetaMask!');
        }
    }

    async loadBlockchainData() {
        this.setState({ loading: true });

        try {
            const web3 = window.web3;
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const networkId = await web3.eth.net.getId();
            const chainId = await web3.eth.getChainId();
            const marketplaceData = Marketplace.networks[networkId]
                || Marketplace.networks[chainId];

            this.setState({ account: accounts[0] || '0x0' });

            if (marketplaceData) {
                const marketplace = new web3.eth.Contract(Marketplace.abi, marketplaceData.address);
                const productCount = await marketplace.methods.productCount().call();
                const products = [];

                for (let i = 1; i <= productCount; i++) {
                    const product = await marketplace.methods.products(i).call();
                    products.push(product);
                }

                this.setState({ marketplace, productCount, products, loading: false });
            } else {
                this.setState({ marketplace: null, products: [], productCount: 0 });
                window.alert('Contract not deployed on given network!');
                this.setState({ loading: false });
            }
        } catch (error) {
            console.error(error);
            this.setState({ marketplace: null, loading: false });
        }
    }

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    // Enhanced createProduct method now includes category parameter
    // Improvement: Method now handles three parameters (name, category, price) for richer product data
    async createProduct(name, category, price) {
        if (!this.state.marketplace) {
            window.alert('Marketplace contract is not connected.');
            return;
        }

        this.setState({ loading: true });

        try {
            // Smart contract call updated to pass category along with name and price
            // This sends the complete product data to the blockchain
            await this.state.marketplace.methods.createProduct(name, category, price)
                .send({ from: this.state.account });

            await this.loadBlockchainData();
        } catch (error) {
            console.error(error);
            this.setState({ loading: false });
        }
    }

    async purchaseProduct(id, price) {
        if (!this.state.marketplace) {
            window.alert('Marketplace contract is not connected.');
            return;
        }

        this.setState({ loading: true });

        try {
            await this.state.marketplace.methods.purchaseProduct(id)
                .send({ from: this.state.account, value: price });

            await this.loadBlockchainData();
        } catch (error) {
            console.error(error);
            this.setState({ loading: false });
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            account: '0x0',
            marketplace: '',
            productCount: 0,
            products: [],
            loading: true,
        };

        this.createProduct = this.createProduct.bind(this);
        this.purchaseProduct = this.purchaseProduct.bind(this);
    }

    render() {
        let products;

        if (this.state.loading) {
            products = [];
        } else {
            products = this.state.products;
        }
        return (
            <div>
                <Header account={this.state.account} />
                <Create createProduct={this.createProduct} />
                <Products products={products} purchaseProduct={this.purchaseProduct} />
            </div>
        )
    }
}

export default Main;
