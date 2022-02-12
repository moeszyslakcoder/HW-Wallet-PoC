# Hash Works Browser Wallet PoC

> This project is a PoC for a Hash Works Chrome browser extension using TypeScript and React.

In the end, it aims to be:
- The first browser wallet for XRP
- The first multi-chain browser wallet

As an early PoC, we're looking for the following features:
- key generation (based on user input password)
- viewing balance
- sending payment transaction

Interaction with networks is done through a [gateway API](https://hash-works.readme.io/reference/getaccounttransactions) that currently supports XRPL and Eth. The API supports:
- viewing balances
- viewing transactions
- sending pre-signed transactions
- viewing fees
- viewing account info
- viewing FX rate in USD, GBP or EUR

## Building

1.  Clone repo
2.  `npm i`
3.  `npm run dev` to compile once or `npm run watch` to run the dev task in watch mode
4.  `npm run build` to build a production (minified) version

## Installation

1. Install Chromium `brew install --cask chromium`
2. Trust Chromium `xattr -cr /Applications/Chromium.app`
3. Launch with `npm run launch`