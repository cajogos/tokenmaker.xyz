import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import MetaMaskConnector from '../classes/MetaMaskConnector';
import CreateForm from '../components/CreateForm';
import CreateTokenDetails from '../components/CreateTokenDetails';

type CreatePageProps = {};
type CreatePageState = {
    walletInstalled: boolean,
    pageDisabled: boolean
};

class CreatePage extends React.Component<CreatePageProps, CreatePageState>
{
    /**
     * Contract deploying steps:
     * - Connect the wallet (external)
     * - Select the contract type
     * - Fill the required params
     * - Compile the contract
     * - Deploy the contract
     */

    constructor(props: CreatePageProps)
    {
        super(props);
        this.state = {
            walletInstalled: false,
            pageDisabled: true
        };
    }

    componentDidMount()
    {
        let pageShouldBeDisabled = true;
        if (MetaMaskConnector.getState() === MetaMaskConnector.STATE_CONNECTED)
        {
            pageShouldBeDisabled = false;
        }
        this.setState({
            walletInstalled: MetaMaskConnector.getState() !== MetaMaskConnector.STATE_NOT_INSTALLED,
            pageDisabled: pageShouldBeDisabled
        });
    }

    render()
    {
        return (
            <>
                <h1>Create your Token</h1>
                <button className="btn btn-secondary" onClick={(e) => this.setState({ pageDisabled: !this.state.pageDisabled })}>Test Disable/Enable</button>
                {this.state.walletInstalled ?
                    <div className="row">
                        <div className="col">
                            <CreateForm disabled={this.state.pageDisabled} />
                        </div>
                        <div className="col">
                            <CreateTokenDetails disabled={this.state.pageDisabled} />
                        </div>
                    </div>
                    :
                    <div className="alert alert-warning">
                        <span><FaExclamationTriangle /> Please install MetaMask!</span>
                    </div>
                }
            </>
        );
    }
};

export default CreatePage;