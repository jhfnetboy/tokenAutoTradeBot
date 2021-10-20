const ethers = require("ethers")
const wss = 'wss://bsc-ws-node.nariox.org:443';
let priceTokenAddr = null
const args = process.argv.slice(2)
try{
    let priceTokenAddr = args[0]
}catch (err) {
    console.log("Run like : node monitor-price.js 0x130022a99f02208f2e9bdabdc5ab4bd3b9a4cd18")
    // throw err
}


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });

const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  }
];

const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; //v2
const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56";

const fetch = async (inputToken) => {
    // const amountIn = web3.utils.toWei("1", "ether")
    const amountIn = ethers.utils.parseEther("1", "ether")
    const tokenOut = inputToken.trim()

    // const provider = new ethers.providers.JsonRpcProvider(bscMainnetUrl)
    const provider = new ethers.providers.WebSocketProvider(wss);
    const router = new ethers.Contract(ROUTER, abi, provider);
    // console.log(router)
    const amounts = await router.getAmountsOut(amountIn, [tokenOut, BUSD]);
    const currentPrice = amounts[1] / Math.pow(10, 18);
    console.log("price = ", currentPrice, "USD");
}
// fetch("0xF4Ed363144981D3A65f42e7D0DC54FF9EEf559A1"); //random token

fetch("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"); //wbnb
fetch("0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51"); //bunny
fetch("0x130022a99f02208f2e9bdabdc5ab4bd3b9a4cd18");
priceTokenAddr ? fetch(priceTokenAddr) :
    console.log("Run like : node monitor-price.js 0x130022a99f02208f2e9bdabdc5ab4bd3b9a4cd18");

    // https://learnblockchain.cn/docs/ethers.js/cookbook-contracts.html#id1