import React from 'react';
import { FaInfoCircle, FaRocket, FaExclamationTriangle, FaStar, FaCheckCircle, FaPlusCircle, FaExternalLinkAlt, FaSpinner, FaCross, FaCheck, FaTimes, FaAddressBook, FaAddressCard, FaEthereum } from 'react-icons/fa';
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
    // The contract is only allowed to be in these states
    contractStatus: 'Not Compiled' | 'Ready to Deploy' | 'Failed to Deploy' | 'Deployed';
    disabled: boolean;
    compiled: boolean;
    deploying: boolean;
    deployed: boolean;
    detailsHTML: React.ReactElement;
    tokenAddedToWallet: boolean;
};

class TokenDetails extends React.Component<TokenDetailsProps, TokenDetailsState>
    implements ICreatePageListener
{
    constructor(props: TokenDetailsProps)
    {
        super(props);
        this.state = {
            contractStatus: 'Not Compiled',
            // Flag used to enable / disable the elements on the page
            disabled: this.props.disabled,
            // Flag to tell if the contract is compiled
            compiled: false,
            // Flag to check if the contract is being deployed
            deploying: false,
            // Flag to tell if the contract is deployed
            deployed: false,
            // The details of the contract (JSX fragment by default)
            detailsHTML: <></>,
            // Flag to track if the token was added to the wallet
            tokenAddedToWallet: false
        };

        // Add this component to the Create Page Controller listeners
        this.props.pageManager.addListener(this);
    }

    public onPageEnabled(isEnabled: boolean): void
    {
        this.setState({
            disabled: !isEnabled
        });
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

    private getDetailsHTML(contracts: any, args: any): React.ReactElement
    {
        // This returns a JSX element with the contract details
        return (
            <>
                <div className={TokenDetailsStyles.tokenDetail + ' mb-3'}>
                    <strong>Arguments</strong>
                    <pre>{JSON.stringify(args, null, 2)}</pre>
                </div>
                {/* Loop through the contracts obtained (this is usually one contract) */}
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

    // Gets a button to Ethercan (only works on public testnets)
    private getEtherscanButton(): React.ReactElement
    {
        const tokenAddress = this.props.pageManager.getContract().deployedAddress as string;
        const networkId = MetaMaskConnector.getInstance().getCurrentNetwork();
        const accountAddress = MetaMaskConnector.getInstance().getCurrentAccount();
        if (tokenAddress === null || networkId === null || accountAddress === null)
        {
            return <></>;
        }
        const link = etherscanLink.createTokenTrackerLink(
            tokenAddress,
            networkId.toString(),
            accountAddress
        );
        // Failed to obtain link (usually happens for non-public testnets)
        if (!link) return <></>;

        // Return the link with a nofollow attribute
        return (
            <a href={link} className="btn btn-primary ms-2" target="_blank" rel="nofollow">
                <span><FaExternalLinkAlt /> View on Etherscan</span>
            </a>
        );
    }

    public onContractChanged(): void { }

    // Function to allow to easily add the new token to MetaMask wallet
    private async addTokenToWallet(): Promise<void>
    {
        const deployedAddress = this.props.pageManager.getContract().deployedAddress as string;
        if (deployedAddress === null) return;

        const tokenSymbol = this.props.pageManager.getContract().arguments.tokenSymbol;

        // Call MetaMask to add the new token
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
                        {this.state.compiled ?
                            <div>
                                <h5 className="card-title">Token Details</h5>
                                <div>{this.state.detailsHTML}</div>
                            </div>
                            :
                            <div className="alert alert-danger">
                                <span><FaExclamationTriangle /> The token has not been compiled yet, please confirm its details.</span>
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

                {/* When the token is deployed */}
                {this.state.deployed &&
                    <div className="border-top mt-3 pt-3 px-2">
                        <h4><FaCheckCircle color="green" /> Token Deployed!</h4>
                        <div className="my-3">
                            <strong><FaEthereum /> Address: </strong> <span className="fst-italic">{this.props.pageManager.getContract().deployedAddress}</span>
                        </div>
                        <button className="btn btn-success" onClick={this.addTokenToWallet.bind(this)}>
                            {this.state.tokenAddedToWallet ?
                                <span><FaCheckCircle /> Token Added to Wallet!</span>
                                :
                                <span><FaPlusCircle /> Add Token to your Wallet</span>
                            }
                        </button>
                        {this.getEtherscanButton()}
                    </div>
                }
            </>
        );
    }
}

export default TokenDetails;