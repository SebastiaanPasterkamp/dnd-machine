import React from 'react';

function BaseViewWrapper(
    WrappedComponent, config
) {
    const component = class extends React.Component {
        render() {
            return <div
                className={config.className}
                >
                <WrappedComponent
                    {...this.props}
                    />
            </div>;
        }
    };

    component.WrappedComponent = WrappedComponent;

    component.displayName = `BaseView${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return component;
};

export default BaseViewWrapper;
