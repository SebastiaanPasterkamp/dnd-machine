import React from 'react';

import '../../sass/_modal-dialog.scss';

import LazyComponent from '../components/LazyComponent.jsx';

import BaseLinkGroup from './BaseLinkGroup.jsx';

class ModalDialogLinks extends BaseLinkGroup
{
    constructor(props) {
        super(props);
    }

    buttonList() {
        const { onCancel, onSave, onDone } = this.props;

        return {
            'cancel': () => ({
                label: 'Cancel',
                action: () => onCancel(),
                available: !!onCancel,
            }),
            'save': () => ({
                label: 'Save',
                action: () => onSave(),
                className: 'primary',
                available: !!onSave,
            }),
            'done': () => ({
                label: 'Done',
                action: () => onDone(),
                className: 'primary',
                available: !!onDone,
            })
        };
    }
}

export class ModalDialog extends LazyComponent
{
    render() {
        const {
            onCancel, onClose, label, subheading, children,
            onHelp, ...props
        } = this.props;

        return <div
            className="nice-modal viewport-center accent wide"
            >
            <div className="nice-modal-content">
                <div className="nice-modal-header">
                    <a
                        className="nice-modal-close"
                        onClick={() => {
                            onClose
                                ? onClose()
                                : onCancel()
                        }}
                        >
                        <i className="icon fa-times"></i>
                    </a>
                    <h4>{label}</h4>
                </div>
                {subheading
                    ? <div className="nice-modal-sub">
                        {subheading}
                    </div> : null
                }
                <div className="nice-modal-body overflow-x-scroll">
                    {children}
                </div>
                <div className="nice-modal-footer">
                    {onHelp
                        ? <a
                            className="nice-btn link icon fa-question"
                            onClick={() => onHelp()}
                            >
                            Help
                        </a>
                        : null
                    }
                    <ModalDialogLinks
                        className="pull-right"
                        {...props}
                        onCancel={onCancel}
                        onClose={onClose}
                        />
                </div>
            </div>
        </div>;
    }
}

export default ModalDialog;
