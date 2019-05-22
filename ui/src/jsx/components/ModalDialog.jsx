import React from 'react';
import PropTypes from 'prop-types';

import {
    BaseLinkButton,
    BaseLinkGroup,
} from '../components/BaseLinkGroup/index.jsx';

import '../../sass/_modal-dialog.scss';


const ModalDialog = function({
    label, subheading, children, onHelp, helpLabel,
    onDone, doneLabel, onCancel, cancelLabel,
}) {
    return (
        <div
            className="nice-modal-overlay"
            onClick={(e) => e.defaultPrevented || (onCancel || onDone)()}
        >
            <div
                className="modal-dialog nice-modal viewport-center accent tall wide"
                onClick={(e) => e.preventDefault()}
            >
                <div className="nice-modal-content">
                    <div className="nice-modal-header">
                        {onCancel ? (
                            <a
                                className="nice-modal-close"
                                onClick={onCancel}
                            >
                                <i className="icon fa-times" />
                            </a>
                        ) : null}
                        <h4>{ label }</h4>
                    </div>

                    {subheading ? (
                        <div className="nice-modal-sub">
                            { subheading }
                        </div>
                    ) : null}

                    <div className="nice-modal-body overflow-y-auto overflow-x-hidden">
                        { children }
                    </div>

                    <div className="nice-modal-footer">
                        {onHelp ? (
                            <a
                                className="nice-btn link icon fa-question"
                                onClick={ onHelp }
                            >
                                { helpLabel }
                            </a>
                        ) : null}
                        <BaseLinkGroup className="pull-right">
                            <BaseLinkButton
                                label={cancelLabel}
                                icon="cross"
                                action={onCancel}
                                available={!!onCancel}
                            />
                            <BaseLinkButton
                                label={doneLabel}
                                icon="check"
                                className="primary"
                                action={onDone}
                                available={!!onDone}
                            />
                        </BaseLinkGroup>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalDialog.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired,
    subheading: PropTypes.any,
    onCancel: PropTypes.func,
    cancelLabel: PropTypes.string,
    onDone: PropTypes.func,
    doneLabel: PropTypes.string,
    onHelp: PropTypes.func,
    helpLabel: PropTypes.string,
};

ModalDialog.defaultProps = {
    subheading: null,
    onCancel: null,
    cancelLabel: 'Cancel',
    onDone: null,
    doneLabel: 'Done',
    onHelp: null,
    helpLabel: 'Help',
};

export default ModalDialog;
