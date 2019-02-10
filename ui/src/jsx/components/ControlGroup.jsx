import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import utils from '../utils.jsx';

export class ControlGroup extends LazyComponent
{
    renderLabel(index, label) {
        return <span
                key={"label-" + index}
                className="nice-input-addon">
            {label}
        </span>;
    }

    render() {
        const { children, label, className } = this.props;
        const { labels = [label] } = this.props;
        const childCount = React.Children.count(children);

        return <div className={utils.makeStyle({}, ['nice-control-group', className])}>
            {React.Children.map(children, (child, index) => {
                if (index >= labels.length) {
                    return [child];
                }
                return [
                    this.renderLabel(index, labels[index]),
                    child
                ];
            })}
            {labels.length > childCount
                ? this.renderLabel(
                    childCount,
                    labels[childCount]
                ) : null
            }
        </div>;
    }
}

export default ControlGroup;