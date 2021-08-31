// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import common from 'constants/Messages';
import { orange } from 'constants/Theme';

type DefaultProps = {
    classes: Object
};

type Props = {
    messages: Array<string>,
    ignoreJumpTo: boolean,
    intl: intlShape
} & DefaultProps;

const styles = {
    root: {
        marginBottom: '2em',
        paddingTop: '1em',
        '& #error': {
            backgroundColor: orange,
            color: '#FFF',
            padding: '.5em .5em',
            borderRadius: '5px'
        },
        '& #error ul': { margin: 0, padding: 0, listStyle: 'none' },
        '& #error ul li': {
            padding: '0 .5em',
            lineHeight: '1.75em'
        }
    }
};

class FormUserEditError extends Component<Props> {
    componentWillUpdate(nextProps) {
        if (
            !this.props.ignoreJumpTo &&
            !_.isEmpty(nextProps.messages) &&
            !(`${window.location}`.indexOf('#error') > -1)
        ) {
            setTimeout(() => {
                window.scrollTo(
                    0,
                    // $FlowFixMe
                    document.getElementById('error').offsetTop - 50
                );
            }, 500);
        }
    }

    renderMessage = (message: string) => {
        const { intl } = this.props;
        const messageText = _.isEmpty(common[message])
            ? message
            : intl.formatMessage(common[message]);

        return (
            <li key={message}>
                {message === 'required'
                    ? intl.formatMessage(common.globalRequiredEmptyMessage)
                    : messageText}
            </li>
        );
    };

    render() {
        const { messages, classes } = this.props;
        if (!messages || messages.length === 0) return null;

        return (
            <div className={classes.root}>
                <div id="error" className="error-box">
                    <ul>
                        {_.map(messages, message =>
                            this.renderMessage(message)
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}
export default injectIntl(withStyles(styles)(FormUserEditError));
