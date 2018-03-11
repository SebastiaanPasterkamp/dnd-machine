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
        return {
            'cancel': () => {
                return {
                    label: 'Cancel',
                    action: () => {
                        this.props.onCancel()
                    }
                };
            },
            'save': () => {
                return {
                    label: 'Cancel',
                    action: () => {
                        this.props.onCancel()
                    },
                    className: 'primary'
                };
            },
            'done': () => {
                return {
                    label: 'Done',
                    action: () => {
                        this.props.onDone()
                    },
                    className: 'primary'
                };
            }
        };
    }

    getAllowed() {
        let allowed = [];
        if (this.props.onCancel) {
            allowed.push('cancel');
        }
        if (this.props.onSave) {
            allowed.push('save');
        }
        if (this.props.onDone) {
            allowed.push('done');
        }
        return allowed;
    }
}

export class ModalDialog extends LazyComponent
{
    render() {
        return <div className="nice-modal viewport-center accent wide">
            <div className="nice-modal-content">
                <div className="nice-modal-header">
                    <a
                        className="nice-modal-close"
                        onClick={() => {
                            this.props.onClose
                                ? this.props.onClose()
                                : this.props.onCancel()
                        }}
                        >
                        <i className="icon fa-times"></i>
                    </a>
                    <h4>{this.props.label}</h4>
                </div>
                {this.props.subheading
                    ? <div className="nice-modal-sub">
                        {this.props.subheading}
                    </div> : null
                }
                <div className="nice-modal-body overflow-x-scroll">
                    {this.props.children}
                </div>
                <div className="nice-modal-footer">
                    {this.props.onHelp
                        ? <a
                            className="nice-btn link icon fa-question"
                            onClick={() => this.props.onHelp()}
                            >
                            Help
                        </a>
                        : null
                    }
                    <ModalDialogLinks
                        className="pull-right"
                        {...this.props}
                        />
                </div>
            </div>
        </div>;
    }
}

export default ModalDialog;
