// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    publicUser: Object
} & DefaultProps;

const useStyles = makeStyles({
    card: {
        width: '100%',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '2em'
    },
    title: {
        margin: '0!important',
        fontWeight: '400!important'
    }
});

const About = (props: Props) => {
    const { publicUser, intl } = props;
    const { about } = publicUser;
    const classes = useStyles();

    if (!about) return null;

    return (
        <Card className={classes.card}>
            <Typography variant="h5" component="h2" className={classes.title}>
                {intl.formatMessage(messages.about)}
            </Typography>

            <Typography variant="body" component="p">
                {about}
            </Typography>
        </Card>
    );
};

export default injectIntl(About);
