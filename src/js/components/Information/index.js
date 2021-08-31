// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';
import ReadMoreAndLess from 'react-read-more-less';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    limit?: number,
    message: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        background: '#FDFFD4',
        padding: '1em',
        color: '#888A5C',
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: '1.25em',

        '& span.readMoreText': {
            borderBottom: '1px solid #bfc16a',
            color: '#7b7e43!important',
            fontWeight: 400,
            marginLeft: '0.5em'
        }
    }
});

const Information = (props: Props) => {
    const { intl, message, limit } = props;

    const classes = useStyles();
    const messageProp = messages[message];
    return (
        <div className={classes.root}>
            <ReadMoreAndLess
                charLimit={limit || 200}
                readMoreText={intl.formatMessage(messages.readMore)}
                readLessText={intl.formatMessage(messages.readLess)}
            >
                {messageProp
                    ? intl.formatMessage(messageProp)
                    : `intl: ${message}`}
            </ReadMoreAndLess>
        </div>
    );
};

export default injectIntl(Information);
