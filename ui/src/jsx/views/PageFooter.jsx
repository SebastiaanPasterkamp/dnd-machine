import React from 'react';

import InlineDataWrapper from '../hocs/InlineDataWrapper.jsx';

function FooterItem({ link, class: className, label }) {
    return (
        <li key={label}>
            <a href={link} target="_blank" className={className}>
                {label}
            </a>
        </li>
    );
};

export function PageFooter ({ date, title, footer }) {
    return (
        <footer>
            <div className="nice-container">
                <p className="pull-left">
                    &copy; {date} <span className="text-brand">{title}</span>
                </p>
                <ul className="nice-footer-menu">
                    {footer.map((item) => FooterItem(item))}
                </ul>
            </div>
        </footer>
    );
};

PageFooter.defaultProps = {
    date: null,
    title: "DnD Machine",
    footer: [],
};

export default InlineDataWrapper(
    PageFooter,
    'authenticate'
);
