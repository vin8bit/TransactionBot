## Transaction Bot

### Overview
This bot performs the given task.
Deploy a simple ERC 20 Contract (a transfer fee, if included, will be considered a bonus).
Provide liquidity to the same token with WETH on Goerli, using the platform of your choice (Uniswap is preferred).
Write a script in the language of your choice with the following functionality:
a. Monitor the mempool for any transactions made on the router for your newly deployed token contract.
b. If any such transaction is found, you are required to frontrun sell all your holdings. This means the sell transaction from the mempool should be confirmed after you sell all your token holdings.

### Prerequisites

* Node.js (v14.x or later is recommended)
* npm (which comes with Node.js)

### Installation

To get the bot up and running, you need to:

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-path>

1. Clone the repository:
npm install
node .\sellMempool.js
