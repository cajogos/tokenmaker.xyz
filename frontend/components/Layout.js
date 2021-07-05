import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) =>
{
    return (
        <div className="site-wrapper">
            <Header />
            <div className="content-wrapper container">{children}</div>
            <Footer />
        </div>
    );
};

export default Layout;