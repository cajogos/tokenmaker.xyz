import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
    children: JSX.Element
};

const Layout = ({ children }: LayoutProps) =>
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