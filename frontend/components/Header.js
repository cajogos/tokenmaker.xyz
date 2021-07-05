import Image from 'next/image';
import Link from 'next/link';
import NavLink from './NavLink';
import { useRouter } from 'next/router';

// Styles
import headerStyles from '../styles/Header.module.scss'

// Components
import WalletButton from './WalletButton';

const Header = () =>
{
    // Get the current path to match with active link
    const { asPath } = useRouter();

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link href="/">
                        <a className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                            <div className={headerStyles.logo}>
                                <Image src="/images/ethereum.svg" width="24" height="24" />
                                <span>Tokenmaker.xyz</span>
                                <small>Decentralised-Tokens-as-a-Service</small>
                            </div>
                        </a>
                    </Link>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li className="nav-item">
                            <NavLink path="/" text="Home" title="Go back to Home" />
                        </li>
                        <li className="nav-item">
                            <NavLink path="/create" text="Create a Token" title="Click here to create your token" />
                        </li>
                        <li className="nav-item">
                            <NavLink path="/tutorial" text="Tutorial" title="Learn how to create your token" />
                        </li>
                        <li className="nav-item">
                            <NavLink path="/faqs" text="FAQs" title="Get help to the most frequent questions" />
                        </li>
                    </ul>         
                    <div className="text-end">
                        <WalletButton />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;