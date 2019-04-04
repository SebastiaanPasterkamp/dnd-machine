import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_message-stack.scss';

import MessageWrapper from '../hocs/MessageWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';

export class MessageBox extends LazyComponent
{
    render() {
        const {
            id, message, title, onClose, type = 'info'
        } = this.props;

        return <div className={['message-stack__message', 'nice-alert', type].join(' ')}>
            {title
                ? <div className="nice-alert-heading">
                    {title}
                </div>
                : null
            }
            {onClose ?
                <a
                    href="#"
                    className="nice-alert-dismiss"
                    onClick={(e) => {
                        e.preventDefault();
                        onClose(id);
                    }}
                >
                    <i className="icon fa-angle-down"></i>
                </a>
                : null
            }
            <MDReactComponent
                text={message || ''}
                />
        </div>;
    }
}

MessageBox.propTypes = {
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
    title: PropTypes.string,
    onClose: PropTypes.func
};

class MessageStack extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            messages, onClose
        } = this.props;

        return <div
            className="message-stack"
        >
            {_.map(messages, message => (
                <MessageBox
                    key={message.id}
                    {...message}
                    onClose={onClose}
                    />
            ))}
        </div>;
    }
}

MessageStack.propTypes = {
    messages: PropTypes.array.isRequired,
    onClose: PropTypes.func
};

export default MessageWrapper(MessageStack);
