import React from 'react';

import '../../sass/_panel.scss';

import LazyComponent from '../components/LazyComponent.jsx';

export class Panel extends LazyComponent
{
    render() {
        let style = _.filter([
            'nice-panel',
            this.props.className,
            ]);

        return <div className={style.join(' ')} id={this.props.id}>
            {this.props.header
                ? <div className="nice-panel-heading">
                    {this.props.header}
                </div> : null
            }
            <div className="nice-panel-content">
                {this.props.children}
            </div>
            {this.props.footer
                ? <div className="nice-panel-heading">
                    {this.props.header}
                </div> : null
            }
        </div>;
    }
}

export default Panel;
