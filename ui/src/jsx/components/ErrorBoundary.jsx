import React from 'react';

import '../../sass/_error-boundary.scss';

import ReportingActions from '../actions/ReportingActions.jsx';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
        ReportingActions.reportError(error.stack, info.componentStack);
        console.log({error, info});
    }

    render() {
        const { hasError, error, info } = this.state;
        if (!hasError) {
            return this.props.children;
        }

        return <div className="error-boundary nice-modal bad viewport-center">
            <div className="nice-modal-content">
                <div className="nice-modal-header">
                    <h4>Error</h4>
                </div>
                <div className="nice-modal-body">
                    <pre>{error.stack}</pre>
                    <pre>{info.componentStack}</pre>
                </div>
            </div>
        </div>;
    }
}

export default ErrorBoundary;