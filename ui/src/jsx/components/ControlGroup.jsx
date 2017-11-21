import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

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
        let childCount = React.Children.count(this.props.children);
        let labels = []
        if ('labels' in this.props) {
            labels = this.props.labels;
        } else if ('label' in this.props) {
            labels = [this.props.label];
        }


        return <div className="nice-control-group">
            {React.Children.map(this.props.children, (child, index) => {
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