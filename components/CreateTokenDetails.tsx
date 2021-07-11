import React from 'react';
import { FaInfoCircle, FaRocket, FaExclamationTriangle } from 'react-icons/fa';

type CreateTokenDetailsProps = {
    disabled: boolean
};
type CreateTokenDetailsState = {
    readyToDeploy: boolean
};

class CreateTokenDetails extends React.Component<CreateTokenDetailsProps, CreateTokenDetailsState>
{
    constructor(props: CreateTokenDetailsProps)
    {
        super(props);
        this.state = {
            readyToDeploy: true
        };
    }

    async deployContract()
    {
        // ContractDeployer.deploy(output.compiled.contracts[this.state.contractType])
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
                        <p className="card-text">
                            <strong>Contract Type: </strong><span>XXX</span>
                        </p>
                    </div>
                    <div className="card-footer">
                        <div className="row">
                            <div className="col text-start">
                                <span className="small"><strong><FaExclamationTriangle /> Status: </strong> Not Deployed</span>
                            </div>
                            <div className="col text-end">
                                <button className="btn btn-sm btn-primary"
                                    onClick={this.deployContract.bind(this)}
                                    disabled={!this.state.readyToDeploy || this.props.disabled}>
                                    <span><FaRocket /> Deploy Your Contract!</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CreateTokenDetails;