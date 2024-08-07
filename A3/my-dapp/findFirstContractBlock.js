const {Web3} = require('web3');

const infuraProjectId = 'd8a640f732874067bed901dfd5ee21f7'; // my infura API
const infuraEndpoint = `https://mainnet.infura.io/v3/${infuraProjectId}`; //Link with API

const web3 = new Web3(new Web3.providers.HttpProvider(infuraEndpoint));

async function findFirstContractCreationBlock() {
    //Try to get the latest block and test for connection
    let latestBlockNumber;
    try {
        latestBlockNumber = await web3.eth.getBlockNumber();
        console.log(`Current block number: ${latestBlockNumber}`);
    } catch (error) {
        console.error('Error fetching the latest block number:', error);
        return;
    }
    //Getting first contract creation transaction
    for (let i = 0; i <= latestBlockNumber; i++) {
        try {
            let block = await web3.eth.getBlock(i, true);
            for (let tx of block.transactions) {
                if (tx.to === null) {
                    console.log(`First contract creation transaction found in block: ${i}`);
                    return i;
                }
            }
        } catch (error) {
            console.error(`Error fetching block ${i}:`, error);
        }
    }
    //Print in console
    console.log("No contract creation transaction found.");
    return null;
}

findFirstContractCreationBlock().catch(err => {
    console.error('Error in findFirstContractCreationBlock:', err);
});
