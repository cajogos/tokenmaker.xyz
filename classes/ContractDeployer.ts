import Web3 from 'web3';

class ContractDeployer
{
    public static async deploy(compiledContract: CompiledContract, args: any = []): Promise<string>
    {
        const web3 = new Web3(Web3.givenProvider);
        const accounts = await web3.eth.getAccounts();

        let contract = new web3.eth.Contract(compiledContract.abi);

        let contractToDeploy = contract.deploy({
            data: compiledContract.bytecode.object,
            arguments: args
        });

        // Calculate the cost of the gas using the contract estimate and an abitrary factor
        const gasEstimates = Math.floor(compiledContract.gasEstimates.creation.totalCost * 12.5);

        const contractDeployed = await contractToDeploy.send({
            from: accounts[0],
            gas: gasEstimates,
            gasPrice: web3.utils.toWei('30', 'gwei')
        });

        return contractDeployed.options.address;
    }
}

export default ContractDeployer;