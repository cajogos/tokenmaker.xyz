import { useEffect } from 'react';

type FAQs = {
    question: string;
    answer: string;
}[];

const FAQsPage = () =>
{
    useEffect(() =>
    {
        typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
    }, []);

    const questions: FAQs = [{
        question: 'Is it safe to use this website?',
        answer: 'The website uses a valid MetaMask connection to the Ethereum network of your choice. The website is as safe as your device is.'
    }, {
        question: 'How much does it cost?',
        answer: 'TokenMaker does not charge you for anything. You only pay the gas fees set by the Ethereum network when you deploy your contract.'
    }, {
        question: 'Do you track me?',
        answer: 'We do not track anything you do on the website. Our servers only log your IP address and user agent for reliability purposes. These logs are deleted after 10 days.'
    }];

    return (
        <>
            <h1>Frequently Asked Questions (FAQs)</h1>
            <p>These are some of the mostly asked questions for users of TokenMaker. The list grows as needed.</p>
            <div className="accordion" id="faqsAccordion">
                {questions.map((question, index) =>
                {
                    let accordionId = `faqsaccordion${index}`;
                    return (
                        <div className="accordion-item" key={accordionId}>
                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                <button className="accordion-button collapsed" type="button"
                                    data-bs-toggle="collapse" data-bs-target={"#" + accordionId}
                                    aria-expanded="false">
                                    <strong>{question.question}</strong>
                                </button>
                            </h2>
                            <div id={accordionId} className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    {question.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default FAQsPage;