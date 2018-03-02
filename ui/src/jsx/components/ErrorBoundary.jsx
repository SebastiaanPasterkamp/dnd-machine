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

        return <div class="error-boundary nice-modal bad viewport-center">
            <div class="nice-modal-content">
                <div class="nice-modal-header">
                    <h4>Error</h4>
                </div>
                <div class="nice-modal-body">
                    <pre>{error.stack}</pre>
                    <pre>{info.componentStack}</pre>
                </div>
            </div>
        </div>;
    }
}

export default ErrorBoundary;