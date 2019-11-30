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
        const { children, label, labels, className, ...props } = this.props;
        const { labels: l = [label] } = this.props;
        const childCount = React.Children.count(children);

        return <div className={utils.makeStyle({}, ['nice-control-group', className])} {...props}>
            {React.Children.map(children, (child, index) => {
                if (index >= l.length) {
                    return [child];
                }
                return [
                    this.renderLabel(index, l[index]),
                    child
                ];
            })}
            {l.length > childCount
                ? this.renderLabel(
                    childCount,
                    l[childCount]
                ) : null
            }
        </div>;
    }
}

export default ControlGroup;
