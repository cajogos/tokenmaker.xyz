import Web3 from 'web3';

class ContractDeployer
{
    public static async deploy(compiledContract: CompiledContract, args: any = [])
    {
        const web3 = new Web3(Web3.givenProvider);
        const accounts = await web3.eth.getAccounts();
        console.log('accounts', accounts);

        let contract = new web3.eth.Contract(compiledContract.abi);

        let contractToDeploy = contract.deploy({
            data: compiledContract.bytecode.object,
            arguments: args
        });

        // TODO: Use gas estimates from compiledContract
        console.log('gas estimates', compiledContract.gasEstimates);
        const gasEstimates = compiledContract.gasEstimates;
        const contractDeployed = await contractToDeploy.send({
            from: accounts[0],
            gas: Math.floor(gasEstimates.creation.totalCost * 1.25),
            gasPrice: web3.utils.toWei('30', 'gwei')
        });

        console.log('Contracted deployed at: ', contractDeployed.options.address);
        return contractDeployed;
    }
}

export default ContractDeployer;