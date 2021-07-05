const Layout = ({ children }) =>
{
    return (
        <>
            <header>
                Header
            </header>
            <div>{children}</div>
            <footer>
                Footer
            </footer>
        </>
    );
};

export default Layout;