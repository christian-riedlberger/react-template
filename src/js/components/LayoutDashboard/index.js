// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { SEARCH_CATEGORIES } from 'constants/Config';
import SearchbarCategories from 'components/SearchbarCategories';
import UserContainer from 'containers/UserContainer';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import messages from 'constants/Messages';
import { green } from 'constants/Theme';

// Typography
type DefaultProps = {
    intl: intlShape,
    userProfile: Object
};

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '75vh',
        '& h1.MuiTypography-root.MuiTypography-h1': {
            fontSize: '2.5em!important',
            marginBottom: '0!important',
            textAlign: 'center'
        },
        '& .MuiTypography-root.MuiTypography-h5': {
            marginTop: '.25em!important',
            marginBottom: '1.5em!important',
            color: '#919191!important',
            textAlign: 'center'
        }
    },
    loading: {
        color: green
    }
});

const LayoutDashboard = ({ intl, userProfile }: DefaultProps) => {
    const classes = useStyles();

    if (!userProfile)
        return (
            <div className={classes.root}>
                <div className={classes.loading}>
                    <CircularProgress color="inherit" size={40} />
                </div>
            </div>
        );
    return (
        <div className={classes.root}>
            <div style={{ width: '90%' }}>
                <Typography variant="h1">
                    {intl.formatMessage(messages.helloUser, {
                        firstName: userProfile.firstName
                    })}
                </Typography>

                <Typography variant="h5">
                    {intl.formatMessage(messages.whatToDoFirst)}
                </Typography>
                <SearchbarCategories
                    categories={SEARCH_CATEGORIES}
                    category={SEARCH_CATEGORIES[0]}
                    onSearch={() => {}}
                    placeholder="placeholderSearchDocument"
                    size="large"
                    round
                />
            </div>
        </div>
    );
};

export default UserContainer({
    userProfile: true
})(injectIntl(LayoutDashboard));
