const ethers = require('ethers');
const express= require('express');
const chalk =require('chalk');
require('dotenv').config();
const app = express();
let myDate = new Date();

// const args = process.argv.slice(2)
// const tokenWantToBuy = args[0]

const data = {
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', //wbnb 
  // to_PURCHASE: tokenWantToBuy,  // token to purchase = BUSD for test
  to_PURCHASE: '0xe18841d7a75866688e291703bde66c3378bd74a3',
  factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',  //PancakeSwap V2 factory
  router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', //PancakeSwap V2 router
  recipient: '0xb65dE45A7466765Df13A04029aec63De472F78ce', //wallet address,
  AMOUNT_OF_WBNB : '0.1',
  Slippage : '1', //in Percentage
  gasPrice : '5', //in gwei
  gasLimit : '795684' //at least 21000
}
let initialLiquidityDetected = false;

const bscMainnetUrl = 'https://bsc-dataseed.binance.org/'; //ankr or quiknode
const privatekey = process.env.PRIVATE_KEY; //without 0
const provider = new ethers.providers.JsonRpcProvider(bscMainnetUrl)
const wallet = new ethers.Wallet(privatekey);
const account = wallet.connect(provider);

const factory = new ethers.Contract(
  data.factory,
  ['function getPair(address tokenA, address tokenB) external view returns (address pair)'],
  account
);

const router = new ethers.Contract(
  data.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);

const run = async () => {
  const tokenIn = data.WBNB;
  console.log("Pls check your token contract in:"+data.WBNB)
  const tokenOut = data.to_PURCHASE;
  console.log("Pls check your token contract out:"+data.to_PURCHASE)
  const pairAddress = await factory.getPair(tokenIn, tokenOut);
  console.log('Trade pair:'+pairAddress);
  let str = myDate.toTimeString(); 
  let timeStr = str.substring(0,8);
  console.log("Waintting for liquidity:",timeStr)
  const pair = new ethers.Contract(pairAddress, ['event Mint(address indexed sender, uint amount0, uint amount1)'], account);

  pair.on('Mint', async (sender, amount0, amount1) => {
    if(initialLiquidityDetected === true) {
        return;
    }

    initialLiquidityDetected = true;
   const amountIn = ethers.utils.parseUnits(`${data.AMOUNT_OF_WBNB}`, 'ether');
   const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
   const amountOutMin = amounts[1].sub(amounts[1].div(`${data.Slippage}`)); 

   console.log(
    chalk.green.inverse(`Liquidity Addition Detected\n`)
     +
     `Buying Token
     =================
     tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
     tokenOut: ${amountOutMin.toString()} ${tokenOut}
   `);
   let str = myDate.toTimeString(); 
   let newstr = str.substring(0,8);
   console.log("Waintting for liquidity:",newstr)
   console.log('Processing Transaction.....');
   console.log(chalk.yellow(`amountIn: ${amountIn}`));
   console.log(chalk.yellow(`amountOutMin: ${amountOutMin}`));
   console.log(chalk.yellow(`tokenIn: ${tokenIn}`));
   console.log(chalk.yellow(`tokenOut: ${tokenOut}`));
   console.log(chalk.yellow(`data.recipient: ${data.recipient}`));
   console.log(chalk.yellow(`data.gasLimit: ${data.gasLimit}`));
   console.log(chalk.yellow(`data.gasPrice: ${ethers.utils.parseUnits(`${data.gasPrice}`, 'gwei')}`));

   const tx = await router.swapExactTokensForTokens(
     amountIn,
     amountOutMin,
     [tokenIn, tokenOut],
     data.recipient,
     Date.now() + 1000 * 60 * 10, //10 minutes
     {
       'gasLimit': data.gasLimit,
       'gasPrice': ethers.utils.parseUnits(`${data.gasPrice}`, 'gwei')
   });
 
   const receipt = await tx.wait(); 
   console.log('Transaction receipt');
   console.log(receipt);
  });
}

run();
const PORT = 5000;
app.listen(PORT, (console.log(chalk.yellow(`Listening for Liquidity Addition to token ${data.to_PURCHASE}`))));
