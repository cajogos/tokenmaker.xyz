import Web3 from 'web3';

class ContractDeployer
{
    public static async deploy(compiledContract: CompiledContract, args: any = []): Promise<string>
    {
        const web3 = new Web3(Web3.givenProvider);

        // Obtain the accounts currently in use by the wallet provider
        const accounts = await web3.eth.getAccounts();

        // Preparet the contract object
        let contractToDeploy = new web3.eth.Contract(compiledContract.abi).deploy({
            data: compiledContract.bytecode.object,
            arguments: args
        });

        // Calculate the gas estimates for the contract deployment
        const gasEstimates = await contractToDeploy.estimateGas({
            from: accounts[0]
        });

        const contractDeployed = await contractToDeploy.send({
            from: accounts[0],
            gas: gasEstimates,
            gasPrice: web3.utils.toWei('30', 'gwei')
        });

        return contractDeployed.options.address;
    }
}

export default ContractDeployer;