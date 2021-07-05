import footerStyles from '../styles/Footer.module.scss'

const Footer = () =>
{
    return (
        <footer className={footerStyles.footer}>
            <span>Carlos Ferreira &copy; {(new Date()).getFullYear()}</span><br />
            <span>MSc Advanced Software Engineering Project</span>
        </footer>
    );
};

export default Footer;