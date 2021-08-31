// @flow
import React from 'react';
import FormSelfOnboarding from 'components/FormSelfOnboarding';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import theme from 'constants/muiTheme';

type Props = {
    tempKey: string,
    username: string,
    workflowId: string
};

const useStyles = makeStyles({
    root: {
        maxWidth: 740,
        margin: '0 auto',
        flexGrow: 1
    }
});

const LayoutSelfOnboarding = (props: Props) => {
    const { tempKey, username, workflowId } = props;
    const classes = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <div className={classes.root}>
                <FormSelfOnboarding
                    tempKey={tempKey}
                    userName={username}
                    workflowId={workflowId}
                />
            </div>
        </MuiThemeProvider>
    );
};

export default LayoutSelfOnboarding;
