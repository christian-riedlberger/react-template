// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from 'components/Card';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    aboutVisible: boolean,
    about: string,
    tagVisible: boolean,
    tag: string,
    show: Function
} & DefaultProps;

const useStyles = makeStyles({
    header: {
        fontWeight: '400!important',
        fontSize: '15px!important'
    },
    tagLine: {
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: '15px!important',
        color: '#ababab!important'
    }
});

const About = ({ aboutVisible, about, tagVisible, tag, show, intl }: Props) => {
    const classes = useStyles();
    const showAbout = show(aboutVisible, [about]);
    const showTag = show(tagVisible, [tag]);
    if (!showAbout && !showTag) return null;

    return (
        <Grid xs={12} item className="about-section">
            <Card>
                {showTag && (
                    <div className={classes.tagLine}>
                        <Typography variant="h5" component="h2">
                            {tag}
                        </Typography>
                    </div>
                )}

                {showAbout && (
                    <div>
                        <Typography
                            variant="h5"
                            component="h2"
                            className={classes.header}
                        >
                            {intl.formatMessage(messages.about)}
                        </Typography>
                        <Typography variant="body" component="p">
                            {about}
                        </Typography>
                    </div>
                )}
            </Card>
        </Grid>
    );
};

export default injectIntl(About);
