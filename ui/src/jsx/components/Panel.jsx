import React from 'react';
import _ from 'lodash';

import '../../sass/_panel.scss';

import LazyComponent from '../components/LazyComponent.jsx';

export class Panel extends LazyComponent
{
    render() {
        let style = _.filter([
            'nice-panel',
            this.props.className,
            ]);
        let ContentComponent = 'div';
        let contentStyle = ["nice-panel-content"];
        React.Children.map(this.props.children, (child) => {
            if (
                child
                && _.includes(
                    ['tr', 'tbody', 'thead', 'tfoot'],
                    child.type
                )
            ) {
                ContentComponent = 'table';
            }
        });
        if (ContentComponent == 'table') {
            contentStyle = contentStyle.concat([
                "nice-table", "bordered"
            ]);
        }

        return <div className={style.join(' ')} id={this.props.id}>
            {this.props.header
                ? <div className="nice-panel-heading">
                    {this.props.header}
                </div> : null
            }
            <ContentComponent className={contentStyle.join(' ')}>
                {this.props.children}
            </ContentComponent>
            {this.props.footer
                ? <div className="nice-panel-heading">
                    {this.props.header}
                </div> : null
            }
        </div>;
    }
}

export default Panel;
