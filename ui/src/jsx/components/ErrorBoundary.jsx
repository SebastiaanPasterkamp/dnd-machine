import React from 'react';

import ReportingActions from '../actions/ReportingActions.jsx';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        ReportingActions.reportError(error, info);
        console.log({error, info});
    }

    render() {
        if (this.state.hasError) {
            return <div class="nice-modal bad viewport-center">
                <div class="nice-modal-content">
                    <div class="nice-modal-header">
                        <h4>Error</h4>
                    </div>
                    <div class="nice-modal-body">
                        <pre>{JSON.stringify(error, null, 2) }</pre>
                        <pre>{JSON.stringify(info, null, 2) }</pre>
                    </div>
                </div>
            </div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;