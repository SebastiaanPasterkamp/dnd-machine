import React from 'react';
import PropTypes from 'prop-types';

import '../../sass/_modal-dialog.scss';

import LazyComponent from '../components/LazyComponent.jsx';

import BaseLinkGroup from './BaseLinkGroup.jsx';

class ModalDialogLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const {
            onDone,
            doneLabel = 'Done',
            onCancel,
            cancelLabel = 'Cancel',
        } = this.props;

        return {
            'cancel': () => ({
                label: cancelLabel,
                icon: 'fa-cross',
                action: onCancel,
                available: !!onCancel,
            }),
            'done': () => ({
                label: doneLabel,
                icon: 'fa-check',
                action: onDone,
                className: 'primary',
                available: !!onDone,
            })
        };
    }
}

ModalDialogLinks.propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDone: PropTypes.func,
};

export class ModalDialog extends LazyComponent
{
    render() {
        const {
            onCancel, label, subheading, children,
            onHelp, helpLabel = 'Help', ...props
        } = this.props;

        return <div
            className="nice-modal viewport-center accent wide"
            >
            <div className="nice-modal-content">
                <div className="nice-modal-header">
                    <a
                        className="nice-modal-close"
                        onClick={ onCancel }
                        >
                        <i className="icon fa-times"></i>
                    </a>
                    <h4>{ label }</h4>
                </div>

                {subheading && <div className="nice-modal-sub">
                    { subheading }
                </div>  }

                <div className="nice-modal-body overflow-x-scroll">
                    { children }
                </div>

                <div className="nice-modal-footer">
                    {onHelp && <a
                        className="nice-btn link icon fa-question"
                        onClick={ onHelp }
                        >
                        { helpLabel }
                    </a> }
                    <ModalDialogLinks
                        className="pull-right"
                        {...props}
                        onCancel={ onCancel }
                        />
                </div>
            </div>
        </div>;
    }
}

ModalDialog.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    subheading: PropTypes.string,
    onCancel: PropTypes.func,
    cancelLabel: PropTypes.string,
    onDone: PropTypes.func,
    doneLabel: PropTypes.string,
    onHelp: PropTypes.func,
    helpLabel: PropTypes.string,
};

export default ModalDialog;
