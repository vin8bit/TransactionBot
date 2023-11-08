/*
Liquidity added on uniswapV2 Goerli https://app.uniswap.org/add/v2/ETH/0xb40CB0012A00c1cFA1be4518d53bFb9Ab694EBDf
addLiquidityETH transaction https://goerli.etherscan.io/tx/0xc4b7c5618e7af9aa20a130520c22db5127829839046eaacaf80ab4c9907608e1 
PAIR_CONTRACT = 0xAC7f2d83A0A2865f5422DecB2fa162B76fD23CA5
*/

const Web3 = require("web3");
const Web3WsProvider = require("web3-providers-ws");

// ABIS
const routerABI = require("./RouterABI.json");
const tokenABI = require("./TokenABI.json");

// ADDRESSES
const ROUTER_ADDRESS = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
const WETH_ADDRESS = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
const TOKEN_ADRESS = "0xb40cb0012a00c1cfa1be4518d53bfb9ab694ebdf";

const myAccount = "0xa6db821efaf686b71a94e254420d1202ff285d1e";
const privateKey =
  "0x94126ead564e038ba4449b510c533588edbb03eda3be66bdbe1fd43ef136509f";

const options = {
  timeout: 30000,

  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,

    keepalive: true,
    keepaliveInterval: 60000,
  },

  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 5,
    onTimeout: false,
  },
};
const web3 = new Web3(
  "https://goerli.infura.io/v3/5316a9154f5e4c05b57bdbd423e4fc00"
);
const web3socket = new Web3(
  new Web3WsProvider(
    "wss://goerli.infura.io/ws/v3/5316a9154f5e4c05b57bdbd423e4fc00",
    options
  )
);

const routerContract = new web3.eth.Contract(routerABI, ROUTER_ADDRESS);
const tokenContract = new web3.eth.Contract(tokenABI, TOKEN_ADRESS);

const mempoolSubscription = web3socket.eth.subscribe(
  "pendingTransactions",
  (err, res) => {
    if (err) console.error(err);
  }
);

async function main() {
  console.log("Monitoring Started...\n");
  mempoolSubscription.on("data", (txHash) => {
    setTimeout(async () => {
      let tx = await web3.eth.getTransaction(txHash);

      if (
        tx &&
        tx.to &&
        tx.to.toLowerCase() === ROUTER_ADDRESS.toLowerCase() &&
        tx.input
      ) {
        const tokenAddressRaw = TOKEN_ADRESS.toLowerCase().slice(2);
        console.log("tokenAddressRaw", tokenAddressRaw);

        const inputData = tx.input;
        const isTokenTx = inputData.indexOf(tokenAddressRaw);
        console.log("isTokenTx", isTokenTx);

        if (isTokenTx >= 0) {
          try {
            const swapTx = await swapTokensForETH();
            console.log("Execute Swap -=-->", swapTx?.transactionHash);
            mempoolSubscription.unsubscribe(async function (error, success) {
              console.log(
                "<><>----unsubscribing from mempoolSubscription logs----<><>"
              );
            });
            return;
          } catch (error) {
            // console.error(error);
          }
        }
      }
    });
  });
}

async function swapTokensForETH() {
  const amountBal = await tokenContract.methods.balanceOf(myAccount).call();
  console.log("\nToken Balance --> ", amountBal);
  const amountsOutMin = "0"; // slippage 100%
  const tx =
    routerContract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
      amountBal,
      amountsOutMin,
      [TOKEN_ADRESS, WETH_ADDRESS],
      myAccount,
      Math.floor(Date.now() / 1000) + 60 * 20
    );
    const currentGasPrice = await web3.eth.getGasPrice();
    const gasPrice = web3.utils.toBN(currentGasPrice).mul(web3.utils.toBN(2));
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(myAccount);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: ROUTER_ADDRESS,
        data,
        gasLimit: web3.utils.toHex("500000"),
        gasPrice: web3.utils.toHex(gasPrice),//web3.utils.toHex("5000000000"),  // gas price should be more than current gas price
        nonce,
        chainId: 5,
      },
      privateKey
    );

    return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

main().catch((error) => {
  //   console.error(error);
  process.exitCode = 1;
});
