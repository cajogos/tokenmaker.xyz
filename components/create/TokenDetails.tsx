import React from 'react';
import { FaInfoCircle, FaRocket, FaExclamationTriangle, FaStar, FaCheckCircle, FaPlusCircle, FaExternalLinkAlt, FaSpinner, FaCross, FaCheck, FaTimes } from 'react-icons/fa';
import MetaMaskConnector from '../../classes/MetaMaskConnector';
import CreatePageController from '../../controllers/CreatePageController';
import ICreatePageListener from '../../interfaces/ICreatePageListener';
import TokenDetailsStyles from '../../styles/TokenDetails.module.scss';
import etherscanLink from '@metamask/etherscan-link';

type TokenDetailsProps = {
    pageManager: CreatePageController;
    disabled: boolean;
};
type TokenDetailsState = {
    contractStatus: 'Not Compiled' | 'Ready to Deploy' | 'Failed to Deploy' | 'Deployed';
    disabled: boolean;
    compiled: boolean;
    deploying: boolean;
    deployed: boolean;
    detailsHTML: JSX.Element;
    tokenAddedToWallet: boolean;
};

class TokenDetails extends React.Component<TokenDetailsProps, TokenDetailsState>
    implements ICreatePageListener
{
    constructor(props: TokenDetailsProps)
    {
        super(props);
        this.state = {
            disabled: this.props.disabled,
            contractStatus: 'Not Compiled',
            compiled: false,
            deploying: false,
            deployed: false,
            detailsHTML: <></>,
            tokenAddedToWallet: false
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

        const compiled = this.props.pageManager.getContract().compiled;
        const args = this.props.pageManager.getContract().arguments;

        this.setState({
            detailsHTML: this.getDetailsHTML(compiled.contracts, args)
        });
    }

    public onContractCompiledError(errorCode: number, errorMessage: string): void { }

    private getDetailsHTML(contracts: any, args: any): JSX.Element
    {
        return (
            <>
                <div className={TokenDetailsStyles.tokenDetail + ' mb-3'}>
                    <strong>Arguments</strong>
                    <pre>{JSON.stringify(args, null, 2)}</pre>
                </div>
                {Object.entries(contracts).map(([contract, contractData]: any) =>
                {
                    return (
                        <div key={contract.toLowerCase()}>
                            <h5>{contract}</h5>
                            <div className={TokenDetailsStyles.tokenDetail}>
                                <strong>ABI:</strong>
                                <pre>{JSON.stringify(contractData.abi, null, 2)}</pre>
                            </div>
                            <div className={TokenDetailsStyles.tokenDetail}>
                                <strong>Bytecode:</strong>
                                <pre>{JSON.stringify(contractData.bytecode.object, null, 2)}</pre>
                            </div>
                            <hr />
                        </div>
                    );
                })}
            </>
        );
    }

    private async startDeployment(): Promise<void>
    {
        this.setState({
            deploying: true,
            disabled: true
        });
        try
        {
            await this.props.pageManager.deployContract();
        }
        catch (e)
        {
            this.setState({
                contractStatus: 'Failed to Deploy'
            });
        }
        this.setState({
            deploying: false,
            disabled: false
        });
    }

    public onContractDeployed(): void
    {
        this.setState({
            contractStatus: 'Deployed',
            deployed: true
        });
    }

    private getEtherscanButton(): JSX.Element
    {
        const tokenAddress = this.props.pageManager.getContract().deployedAddress;
        const networkId = MetaMaskConnector.getInstance().getCurrentNetwork();
        const accountAddress = MetaMaskConnector.getInstance().getCurrentAccount();
        if (tokenAddress === null || networkId === null || accountAddress === null)
        {
            return <></>;
        }
        const link = etherscanLink.createTokenTrackerLink(tokenAddress, networkId.toString(), accountAddress);
        if (!link)
        {
            return <></>;
        }
        return (
            <a
                href={link}
                className="btn btn-primary ms-2"
                target="_blank"
                rel="nofollow"><FaExternalLinkAlt /> View on Etherscan</a>
        );
    }

    public onContractChanged(): void { }

    private async addTokenToWallet(): Promise<void>
    {
        const deployedAddress = this.props.pageManager.getContract().deployedAddress;
        if (deployedAddress === null)
        {
            return;
        }
        const tokenSymbol = this.props.pageManager.getContract().arguments.tokenSymbol;
        const added = await MetaMaskConnector.addTokenToWallet({
            type: 'ERC20',
            options: {
                address: deployedAddress,
                symbol: tokenSymbol,
                decimals: 18
            }
        });
        this.setState({
            tokenAddedToWallet: added
        });
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
                                <span className="small">
                                    <strong><FaExclamationTriangle /> Status: </strong>
                                    {this.state.contractStatus === 'Failed to Deploy' ?
                                        <span className="text-danger fw-bold">{this.state.contractStatus} <FaTimes /></span>
                                        :
                                        this.state.contractStatus === 'Deployed' ?
                                            <span className="text-success fw-bold">{this.state.contractStatus} <FaCheck /></span>
                                            :
                                            <span>{this.state.contractStatus}</span>
                                    }
                                </span>
                            </div>
                            <div className="col text-end">
                                <button className="btn btn-sm btn-primary"
                                    onClick={this.startDeployment.bind(this)}
                                    disabled={!this.state.compiled || this.state.disabled}>
                                    <span><FaRocket /> Deploy Your Contract!</span>
                                </button>
                                {this.state.deploying &&
                                    <div className="small fst-italic mt-2">
                                        <FaSpinner className="icon-spin" /> Deploying... This may take a few minutes.
                                    </div>
                                }
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
                                <strong>Contract Address: </strong> {this.props.pageManager.getContract().deployedAddress}
                            </li>
                        </ul>
                        <button
                            className="btn btn-success"
                            onClick={this.addTokenToWallet.bind(this)}>
                            {this.state.tokenAddedToWallet ?
                                <span><FaCheckCircle /> Token Added to Wallet!</span>
                                :
                                <span><FaPlusCircle /> Add Token to your Wallet</span>
                            }
                        </button>
                        {this.getEtherscanButton()}
                    </>
                }
            </>
        );
    }
}

export default TokenDetails;