const {Web3} = require('web3');
// Replace with your Infura project ID
const infuraProjectId = 'd8a640f732874067bed901dfd5ee21f7';
const infuraEndpoint = `https://mainnet.infura.io/v3/${infuraProjectId}`;

const web3 = new Web3(new Web3.providers.HttpProvider(infuraEndpoint));

async function findFirstContractCreationBlock() {
    let latestBlockNumber;
    try {
        latestBlockNumber = await web3.eth.getBlockNumber();
        console.log(`Current block number: ${latestBlockNumber}`);
    } catch (error) {
        console.error('Error fetching the latest block number:', error);
        return;
    }

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

    console.log("No contract creation transaction found.");
    return null;
}

findFirstContractCreationBlock().catch(err => {
    console.error('Error in findFirstContractCreationBlock:', err);
});
