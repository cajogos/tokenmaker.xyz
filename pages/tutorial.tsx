import Head from 'next/head';
import MarkdownParser from '../classes/MarkdownParser';

type TutorialPageProps = {
    tutorial: string;
};

const TutorialPage = ({ tutorial }: TutorialPageProps) =>
{
    return (
        <>
            <Head>
                <title>How to create your own ERC20 Token | TokenMaker</title>
            </Head>
            {/* The result from the Markdown is HTML */}
            <div dangerouslySetInnerHTML={{ __html: tutorial }} />
        </>
    );
};

// The markdown will be parsed once and rendered as HTML
export async function getStaticProps()
{
    // The tutorial page is a single markdown file
    const content = await MarkdownParser.parse('tutorial');
    return { props: { tutorial: content } };
};

export default TutorialPage;