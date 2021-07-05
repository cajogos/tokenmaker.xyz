import Image from 'next/image';
import Link from 'next/link';

// Styles
import headerStyles from '../styles/Header.module.scss'

// Components
import WalletButton from './WalletButton';

const Header = () => {
    return (
        <header class="p-3 bg-dark text-white">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link href="/">
                        <a class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                            <div className={headerStyles.logo}>
                                <Image src="/images/ethereum.svg" width="24" height="24" />
                                <span>Tokenmaker.xyz</span>
                                <small>Decentralised-Tokens-as-a-Service</small>
                            </div>
                        </a>
                    </Link>
                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <Link href="/">
                                <a class="nav-link px-2 text-secondary">Home</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/create">
                                <a class="nav-link px-2 text-white">Create a Token</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/tutorial">
                                <a class="nav-link px-2 text-white">Learn*</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/faqs">
                                <a class="nav-link px-2 text-white">FAQs</a>
                            </Link>
                        </li>
                    </ul>         
                    <div class="text-end">
                        <WalletButton />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;