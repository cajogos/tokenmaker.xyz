import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import ERC20Basic from '../../../classes/contracts/ERC20Basic';
import Counter from '../../../classes/contracts/Counter';
import { SolidityCompilerResult } from '../../../classes/SolidityCompiler';

const ERROR_NO_CONTRACT_TYPE = 601;
const ERROR_INVALID_CONTRACT = 602;
const ERROR_NO_TOKEN_NAME = 602;
const ERROR_NO_TOKEN_SYMBOL = 603;

const DisplayError = (res: NextApiResponse<ExpectedResponse>, error: APIError) =>
{
    return res.json({ success: false, error });
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

    // Validate the contract type
    let contractType = body.contractType?.trim();
    if (!contractType)
    {
        return DisplayError(res, {
            errorCode: ERROR_NO_CONTRACT_TYPE,
            errorMessage: 'No contract type provided.'
        });
    }

    let contract: any | null = null;
    switch (contractType)
    {
        case 'ERC20Basic':
            contract = new ERC20Basic();
            contract.setTokenName('TestName');
            contract.setTokenSymbol('TEST');
            break;

        case 'Counter':
            contract = new Counter();
            break;

        // Given contract type is invalid
        default:
            return DisplayError(res, {
                errorCode: ERROR_INVALID_CONTRACT,
                errorMessage: `The contract ${contractType} is an invalid type.`
            });
    }

    let result: SolidityCompilerResult = contract.compile();

    // TODO Check the requirements for each given contract
    let tokenName = body.tokenName;
    let tokenSymbol = body.tokenSymbol;

    let input = { contractType, tokenName, tokenSymbol };
    let output = {
        compiled: result
    };
    res.json({ success: true, result: { input, output } });
};