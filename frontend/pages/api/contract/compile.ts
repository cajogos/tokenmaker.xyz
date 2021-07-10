import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const ERROR_NO_CONTRACT_TYPE = 601;
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

    let contractType = body.contractType?.trim();
    if (!contractType)
    {
        return DisplayError(res, {
            errorCode: ERROR_NO_CONTRACT_TYPE,
            errorMessage: 'No contract type provided'
        });
    }


    // TODO Check the requirements for each given contract
    let tokenName = body.tokenName;
    let tokenSymbol = body.tokenSymbol;

    console.log(body);

    let input = { contractType, tokenName, tokenSymbol };
    let output = {};
    // let result = ;

    res.json({ success: true, result: { input, output } });
};