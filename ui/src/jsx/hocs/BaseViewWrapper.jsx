import React from 'react';

function BaseViewWrapper(
    WrappedComponent, config
) {
    return class extends React.Component {
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
};

export default BaseViewWrapper;
