import React from 'react';
import _ from 'lodash';

import '../../sass/_panel.scss';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

export class Panel extends LazyComponent
{
    render() {
        const {
            className, children, id, header, footer
        } = this.props;

        let style = utils.makeStyle({}, [
            'nice-panel',
            className,
        ]);
        let ContentComponent = 'div';
        let contentStyle = utils.makeStyle([
            "nice-panel-content"
        ]);

        React.Children.map(children, (child) => {
            if (!child) {
                return;
            }
            if ( _.includes(
                ['tr', 'tbody', 'thead', 'tfoot'],
                child.type
            )) {
                ContentComponent = 'table';
            }
        });
        if (ContentComponent == 'table') {
            contentStyle = utils.makeStyle([
                contentStyle,
                "nice-table", "bordered"
            ]);
        }

        console.log(children);

        return <div className={style} id={id}>
            {header
                ? <div className="nice-panel-heading">
                    {header}
                </div>
                : null
            }
            <ContentComponent className={contentStyle}>
                {children}
            </ContentComponent>
            {footer
                ? <div className="nice-panel-heading">
                    {header}
                </div>
                : null
            }
        </div>;
    }
}

export default Panel;
