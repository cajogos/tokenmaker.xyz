import Link from 'next/link';
import { useRouter } from 'next/router';

type NavLinkProps = {
    path: string,
    text: string,
    title: string
};

// The navbar of the site
const NavLink = ({ path, text, title }: NavLinkProps) =>
{
    // Get the current path to enable the correct link
    const { asPath } = useRouter();
    return (
        <Link href={{ pathname: path }}>
            <a title={title} className={'nav-link px-2 ' + (asPath === path ? 'text-white' : 'text-secondary')}>
                <span>{text}</span>
            </a>
        </Link>
    );
};

export default NavLink;