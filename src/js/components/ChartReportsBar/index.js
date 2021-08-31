// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RequestsContainer from 'containers/RequestsContainer';
import type { ContainerProps as RequestsContainerProps } from 'containers/RequestsContainer';
import ChartBar from 'components/ChartBar';
import { getConfig, formatRequests } from './config';

type DefaultProps = {
    intl: intlShape
} & RequestsContainerProps;

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const ChartReports = (props: Props) => {
    const { intl, allRequests, isLoading } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div style={{ marginTop: '-2em' }}>
                <Grid container direction="row">
                    <Grid item>
                        <ChartBar
                            height={250}
                            width={500}
                            data={
                                isLoading
                                    ? []
                                    : formatRequests(
                                        allRequests,
                                        'status',
                                        intl
                                    )
                            }
                            config={getConfig({ indexBy: 'status' })}
                        />
                    </Grid>
                    <Grid item>
                        <ChartBar
                            height={250}
                            width={500}
                            data={
                                isLoading
                                    ? []
                                    : formatRequests(
                                        allRequests,
                                        'progress',
                                        intl
                                    )
                            }
                            config={getConfig({ indexBy: 'progress' })}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default compose(
    RequestsContainer({}),
    injectIntl
)(ChartReports);
