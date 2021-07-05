import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = ({ path, text, title}) =>
{
    const { asPath } = useRouter();

    return (
        <Link href={{ pathname: path }}>
            <a
                title={title}
                className={'nav-link px-2 ' + (asPath === path ? 'text-white' : 'text-secondary')}>
                <span>{text}</span>
            </a>
        </Link>
    );
};

export default NavLink;