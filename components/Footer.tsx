import footerStyles from '../styles/Footer.module.scss'

// This is the footer of the site
const Footer = () =>
{
    return (
        <footer className={footerStyles.footer}>
            <span>Copyright &copy; {(new Date()).getFullYear()}</span><br />
            <span>Carlos Jorge Lima Ferreira</span><br />
            <span>MSc Advanced Software Engineering</span><br />
            <span>University of Westminster - Academic Year 2020-21</span>
        </footer>
    );
};

export default Footer;