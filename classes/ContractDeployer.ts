import Web3 from 'web3';

// This sole purpose of this class is to deploy contracts on the blockchain
class ContractDeployer
{
    public static async deploy(compiledContract: CompiledContract, args: any = []): Promise<string>
    {
        // Load up the Web3 object for the MetaMask provider
        const web3 = new Web3(Web3.givenProvider);

        // Obtain the accounts currently in use by the wallet provider
        const accounts = await web3.eth.getAccounts();

        // Prepare the contract object using its bytecode and arguments
        let contractToDeploy = new web3.eth.Contract(compiledContract.abi).deploy({
            data: compiledContract.bytecode.object,
            arguments: args
        });

        // Calculate the gas estimates for the contract deployment
        const gasEstimates = await contractToDeploy.estimateGas({
            from: accounts[0]
        });

        // Initiate the contract deployment call
        const contractDeployed = await contractToDeploy.send({
            from: accounts[0],
            gas: gasEstimates,
            gasPrice: web3.utils.toWei('30', 'gwei')
        });

        // Once the contract is deployed we return the address
        return contractDeployed.options.address;
    }
}

export default ContractDeployer;