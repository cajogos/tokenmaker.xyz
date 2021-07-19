import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import Counter from '../../../classes/contracts/Counter';
import ERC20 from '../../../classes/contracts/ERC20';
import { SolidityCompilerResult } from '../../../classes/SolidityCompiler';
import Web3 from 'web3';

const ERROR_NO_CONTRACT_TYPE = 601;
const ERROR_INVALID_CONTRACT = 602;
const ERROR_NO_TOKEN_NAME = 602;
const ERROR_NO_TOKEN_SYMBOL = 603;
const ERROR_NO_INITIAL_SUPPLY = 604;
const ERROR_INITIAL_SUPPLY_MUST_BE_NUMBER = 605;
const ERROR_INITIAL_SUPPLY_MUST_BE_POSITIVE = 606;

const DisplayError = (res: NextApiResponse<ExpectedResponse>, error: APIError) =>
{
    return res.json({ success: false, error });
};

const HandleContractCounter = (res: NextApiResponse<ExpectedResponse>, args: {}) =>
{
    let contract = new Counter();
    let compiled: SolidityCompilerResult = contract.compile();
    return res.json({
        success: true, result: {
            input: args,
            output: {
                compiled
            }
        }
    });
};

type ERC20Arguments = {
    tokenName: string;
    tokenSymbol: string;
    initialSupply: string;
};
const HandleContractERC20 = (res: NextApiResponse<ExpectedResponse>, args: ERC20Arguments) =>
{
    // Validate Token Name
    let tokenName = args.tokenName.trim();
    if (!tokenName)
    {
        return DisplayError(res, {
            errorCode: ERROR_NO_TOKEN_NAME,
            errorMessage: 'Token name is required'
        });
    }

    // Validate Token Symbol
    let tokenSymbol = args.tokenSymbol.trim().toUpperCase();
    if (!tokenSymbol)
    {
        return DisplayError(res, {
            errorCode: ERROR_NO_TOKEN_SYMBOL,
            errorMessage: 'Token symbol is required'
        });
    }

    // Validate Initial Supply
    let initialSupply = args.initialSupply.trim();
    if (!initialSupply)
    {
        return DisplayError(res, {
            errorCode: ERROR_NO_INITIAL_SUPPLY,
            errorMessage: 'Initial supply is required'
        });
    }
    let initialSupplyNumber = parseInt(initialSupply, 10);
    if (isNaN(initialSupplyNumber))
    {
        return DisplayError(res, {
            errorCode: ERROR_INITIAL_SUPPLY_MUST_BE_NUMBER,
            errorMessage: 'Initial supply must be a number'
        });
    }
    if (initialSupplyNumber <= 0)
    {
        return DisplayError(res, {
            errorCode: ERROR_INITIAL_SUPPLY_MUST_BE_POSITIVE,
            errorMessage: 'Initial supply must be a positive number'
        });
    }

    // The contract's initial supply must be multiplied by the power of 10 on the number of decimals (18 default)
    let realInitialSupply = Web3.utils.toBN(initialSupplyNumber).mul(
        Web3.utils.toBN(10).pow(
            Web3.utils.toBN(18)
        )
    );
    let contract = new ERC20();
    contract.addArgument(tokenName);
    contract.addArgument(tokenSymbol);
    // The number of initial supply is replaced in the contract (arbitrary value is used)
    contract.addReplacement('111222333444555666777', realInitialSupply.toString());
    let compiled: SolidityCompilerResult = contract.compile();
    return res.json({
        success: true, result: {
            input: {
                tokenName: tokenName,
                tokenSymbol: tokenSymbol,
                initialSupply: initialSupplyNumber
            },
            output: {
                compiled
            }
        }
    });
};

export default (req: NextApiRequest, res: NextApiResponse<ExpectedResponse>) =>
{
    // Only accept POST requests
    if (req.method !== 'POST')
    {
        res.status(StatusCodes.METHOD_NOT_ALLOWED);
        return DisplayError(res, {
            errorCode: StatusCodes.METHOD_NOT_ALLOWED,
            errorMessage: ReasonPhrases.METHOD_NOT_ALLOWED
        });
    }

    res.status(StatusCodes.OK);
    const body = req.body;

    console.log(body);

    // Validate the contract type
    let contractType = body.contractType?.trim();
    if (!contractType)
    {
        return DisplayError(res, {
            errorCode: ERROR_NO_CONTRACT_TYPE,
            errorMessage: 'No contract type provided.'
        });
    }

    switch (contractType)
    {
        case 'Counter':
            return HandleContractCounter(res, body.arguments);
        case 'ERC20':
            return HandleContractERC20(res, body.arguments);
    }

    // Given contract type is invalid
    return DisplayError(res, {
        errorCode: ERROR_INVALID_CONTRACT,
        errorMessage: `The contract ${contractType} is an invalid type.`
    });
};