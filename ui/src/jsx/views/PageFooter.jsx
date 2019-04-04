import React from 'react';

import InlineDataWrapper from '../hocs/InlineDataWrapper.jsx';

export class PageFooter extends React.Component
{
    render() {
        const { date, title } = this.props;

        return <footer>
            <div className="nice-container">
                <p className="pull-left">
                    &copy; {date} <span className="text-brand">{title}</span>
                </p>
                <ul className="nice-footer-menu">
                    <li>
                        <a
                            href="https://github.com/SebastiaanPasterkamp/dnd-machine/blob/master/LICENSE.md"
                            target="_blank"
                            className="icon fa-balance-scale"
                            >
                            Project License
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/SebastiaanPasterkamp/dnd-machine"
                            target="_blank"
                            className="icon fa-github"
                            >
                            Source
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://nice.textkernel.nl/"
                            target="_blank"
                            className="product-icon textkernel"
                            >
                            Nice!
                        </a>
                    </li>
                    <li>
                        <a
                            href="http://dnd.wizards.com/articles/features/basicrules"
                            target="_blank"
                            className="icon fa-book"
                            >
                            Basic Rules for Dungeons &amp; Dragons
                        </a>
                    </li>
                </ul>
            </div>
        </footer>;
    }
};

export default InlineDataWrapper(
    PageFooter,
    'authenticate'
);
