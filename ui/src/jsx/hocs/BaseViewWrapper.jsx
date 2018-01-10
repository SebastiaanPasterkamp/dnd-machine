import React from 'react';

function BaseViewWrapper(
    WrappedComponent, config
) {
    return class extends React.Component {
        render() {
            return <div>
                <h2 className={["icon", config.icon].join(' ')}>
                    {config.label}
                </h2>

                <div
                    className={config.className}
                    >
                    <WrappedComponent
                        {...this.props}
                        />
                </div>
            </div>;
        }
    };
};

export default BaseViewWrapper;
