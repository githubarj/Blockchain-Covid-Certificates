# Blockchain Covid Vaccine Certifications

This project aims to implement a system that solves a known problem of trust in the COVID-19 vaccine supply chain using blockchain technology

# Team : Bro code {}

## Members : 2

Richard Jeremy Githuba  
Eddy Bogonko

# Problem

Vaccine certificates can be falsified and some vaccine certificates may not be recognized by destination countries.
This affects the 3rd sustainable development goal that is good health and well being.

# Languages and Frameworks

Solidity  
Truffle  
JavaScript  
Web3.js

# Blockchain Protocol Used

Ethereum

# How to run the code

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [truffle](https://trufflesuite.com/tutorial/)
  - You'll know you did it right if you can run `truffle version` and you see a response like
    `truffle vx.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an output like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## Quickstart

```
git clone https://github.com/githubarj/Blockchain-Covid-Certificates
cd Blockchain-Covid-Certificates
yarn
```

# Usage

Run ganache server with the development account:

```
ganache -m "void inflict sail case speak inject lift garden suspect bone cotton blush"
```

Deploy: **in a different terminal**

```
truffle deploy
```

## Testing

```
truffle test
```

## Deployment to a testnet or mainnet

1. Switch yout git branch to hardhat
1. Setup environment variables

You'll want to set your `RINKEBY_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `RINKEBY_RPC_URL`: This is url of the rinkeby testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

```
yarn hardhat run scripts/deploy.js --network rinkeby
```

### Verify on etherscan

If you deploy to a testnet or mainnet, you can verify it if you get an [API Key](https://etherscan.io/myapikey) from Etherscan and set it as an environment variable named `ETHERSCAN_API_KEY`. You can pop it into your `.env` file as seen in the `.env.example`.

In it's current state, if you have your api key set, it will auto verify rinkeby contracts!

However, you can manual verify with:

```
npx hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```
