## Transaction Bot

### Overview
* Deploy a simple ERC-20 token contract.
  * Bonus: Include a transfer fee, if applicable.
* Provide liquidity for the ERC-20 token paired with WETH on the Goerli testnet using a platform of your choice (Uniswap is preferred).
* Write a script (in any language) with the following features:
  1. Mempool Monitoring: Track the mempool for transactions involving the router of your newly deployed token contract.
  2. Frontrun Sell: If a transaction is detected, execute a frontrun by selling all your token holdings before the detected transaction is confirmed.
* Ensure that the sell transaction you initiate is confirmed before the original transaction from the mempool.

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
