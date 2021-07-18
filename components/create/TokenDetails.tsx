import React from 'react';
import { FaInfoCircle, FaRocket, FaExclamationTriangle, FaStar, FaCheckCircle, FaPlusCircle } from 'react-icons/fa';
import CreatePageController from '../../controllers/CreatePageController';
import ICreatePageListener from '../../interfaces/ICreatePageListener';

type TokenDetailsProps = {
    pageManager: CreatePageController
};
type TokenDetailsState = {
    contractStatus: 'Not Deployed' | 'Ready to Deploy' | 'Deployed';
    readyToDeploy: boolean;
    deployed: boolean;
};

class TokenDetails extends React.Component<TokenDetailsProps, TokenDetailsState>
    implements ICreatePageListener
{
    constructor(props: TokenDetailsProps)
    {
        super(props);
        this.state = {
            contractStatus: 'Not Deployed',
            readyToDeploy: false,
            deployed: false
        };

        this.props.pageManager.addListener(this);
    }

    public onContractCompiled(): void
    {
        console.log('contract compiled TokenDetails');

        this.setState({
            contractStatus: 'Ready to Deploy',
            readyToDeploy: true,
            deployed: false
        });
    }

    public onContractDeployed(): void
    {
        console.log('contract deployed TokenDetails');

        this.setState({
            contractStatus: 'Deployed',
            readyToDeploy: false,
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
                        <span className="small"><FaInfoCircle /> Information message goes here...</span>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Token Details</h5>
                        <p className="card-text">...</p>
                    </div>
                    <div className="card-footer">
                        <div className="row">
                            <div className="col text-start">
                                <span className="small"><strong><FaExclamationTriangle /> Status: </strong> {this.state.contractStatus}</span>
                            </div>
                            <div className="col text-end">
                                <button className="btn btn-sm btn-primary"
                                    onClick={(e) => this.props.pageManager.deployContract()}
                                    disabled={!this.state.readyToDeploy}>
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