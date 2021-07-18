import React from 'react';
import { FaInfoCircle, FaRocket, FaExclamationTriangle, FaStar, FaCheckCircle, FaPlusCircle } from 'react-icons/fa';
import CreatePageController from '../../controllers/CreatePageController';
import ICreatePageListener from '../../interfaces/ICreatePageListener';
import TokenDetailsStyles from '../../styles/TokenDetails.module.scss';

type TokenDetailsProps = {
    pageManager: CreatePageController
};
type TokenDetailsState = {
    contractStatus: 'Not Compiled' | 'Ready to Deploy' | 'Deployed';
    compiled: boolean;
    deployed: boolean;
    detailsHTML: JSX.Element;
};

class TokenDetails extends React.Component<TokenDetailsProps, TokenDetailsState>
    implements ICreatePageListener
{
    constructor(props: TokenDetailsProps)
    {
        super(props);
        this.state = {
            contractStatus: 'Not Compiled',
            compiled: false,
            deployed: false,
            detailsHTML: <></>
        };

        this.props.pageManager.addListener(this);
    }

    public onContractCompiled(): void
    {
        this.setState({
            contractStatus: 'Ready to Deploy',
            compiled: true,
            deployed: false
        });

        // TODO: Contract Arguments missing from compilation

        const compiled = this.props.pageManager.getContract().compiled;
        this.setState({
            detailsHTML:
                <>
                    {Object.entries(compiled.contracts).map(([contract, contractData]) =>
                    {
                        return (
                            <div key={contract} className="border-bottom border-gray">
                                <h5>{contract}</h5>
                                <div className={TokenDetailsStyles.tokenDetail}>
                                    <strong>Arguments</strong>
                                </div>
                                <div className={TokenDetailsStyles.tokenDetail}>
                                    <strong>ABI:</strong>
                                    <pre>{JSON.stringify(contractData.abi, null, 2)}</pre>
                                </div>
                                <div className={TokenDetailsStyles.tokenDetail}>
                                    <strong>Bytecode:</strong>
                                    <pre>{JSON.stringify(contractData.bytecode.object, null, 2)}</pre>
                                </div>
                                <div className={TokenDetailsStyles.tokenDetail}>
                                    <strong>Gas Estimates</strong>
                                    <pre>{JSON.stringify(contractData.gasEstimates.creation, null, 2)}</pre>
                                </div>
                                {console.log(contractData)}
                            </div>
                        );
                    })}
                </>
        });
        console.log(compiled);
    }

    public onContractDeployed(): void
    {
        this.setState({
            contractStatus: 'Deployed',
            compiled: false,
            deployed: true
        });
    }

    public onContractChanged(): void
    {
        console.log('contract changed TokenDetails');
    }

    render()
    {
        return (
            <>
                <div className="card">
                    <div className="card-header">
                        <span className="small"><FaInfoCircle /> Confirm the token details below before deployment.</span>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Token Details</h5>
                        {this.state.compiled ?
                            <div>{this.state.detailsHTML}</div>
                            :
                            <div className="alert alert-danger">
                                <span>The token has not been compiled yet, please confirm its details.</span>
                            </div>
                        }

                    </div>
                    <div className="card-footer">
                        <div className="row">
                            <div className="col text-start">
                                <span className="small"><strong><FaExclamationTriangle /> Status: </strong> {this.state.contractStatus}</span>
                            </div>
                            <div className="col text-end">
                                <button className="btn btn-sm btn-primary"
                                    onClick={(e) => this.props.pageManager.deployContract()}
                                    disabled={!this.state.compiled}>
                                    <span><FaRocket /> Deploy Your Contract!</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.deployed &&
                    <>
                        <hr />
                        <h4><FaCheckCircle color="green" /> Token Deployed!</h4>
                        <ul>
                            <li>
                                <strong>Contract Address: </strong> 0x0000...
                            </li>
                            <li>
                                <strong>Transaction: </strong> 0x0000...
                            </li>
                            <li>
                                <strong>Block: </strong> 0x0000...
                            </li>
                        </ul>
                        <a className="btn btn-success"><FaPlusCircle /> Add Token to your Wallet</a>
                    </>
                }
            </>
        );
    }
}

export default TokenDetails;