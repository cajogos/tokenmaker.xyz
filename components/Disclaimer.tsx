import { FaExclamationTriangle } from 'react-icons/fa';

// This is the disclaimer message presented on the top of the application
const Disclaimer = () =>
{
    return (
        <div className="alert alert-danger text-center small fw-bold text-danger">
            <FaExclamationTriangle /> Please be advised that this tool is only intended to help you deploy your own tokens. <FaExclamationTriangle />
            <br />
            <FaExclamationTriangle /> <u>TokenMaker is not liable</u> for any tokens created with this tool. Any tokens belong to the public Ethereum address that creates them. <FaExclamationTriangle />
        </div>
    );
};

export default Disclaimer;