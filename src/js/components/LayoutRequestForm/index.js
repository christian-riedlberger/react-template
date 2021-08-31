import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import WizardForm from 'components/WizardForm';
import { logRender } from 'utils/logger';

type DefaultProps = {
    params: {
        document?: string
    },
    router: Object
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

const LayoutRequests = (props: Props) => {
    const classes = useStyles();
    const { params, router } = props;

    const handleFinish = () => {
        router.push('/requests/issued');
    };

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <WizardForm
                        nodeRef={`workspace://SpacesStore/${params.documentId}`}
                        onFinish={handleFinish}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default withRouter(logRender(LayoutRequests));
