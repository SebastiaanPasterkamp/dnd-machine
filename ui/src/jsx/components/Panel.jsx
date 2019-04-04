import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_panel.scss';

import utils from '../utils.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

export class Panel extends LazyComponent
{
    render() {
        const {
            className, children, id, header, footer,
            contentComponent
        } = this.props;

        let style = utils.makeStyle({}, [
            'nice-panel',
            className,
        ]);
        let ContentComponent = contentComponent;
        let contentStyle = utils.makeStyle({}, [
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
            contentStyle = utils.makeStyle({}, [
                contentStyle,
                "nice-table", "bordered"
            ]);
        }

        return <div className={style} id={id}>
            {header
                ? <div className="nice-panel-heading">
                    {header}
                </div>
                : null
            }
            <ContentComponent className={contentStyle}>
                {children}
                {ContentComponent != 'table'
                    ? <div className="clearfix"></div>
                    : null
                }
            </ContentComponent>
            {footer
                ? <div className="nice-panel-heading">
                    {footer}
                </div>
                : null
            }
        </div>;
    }
}

Panel.defaultProps = {
    contentComponent: 'div',
};

Panel.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    header: PropTypes.string,
    footer: PropTypes.string,
    ContentComponent: PropTypes.oneOf([
        'div', 'table'
    ]),
};

export default Panel;
