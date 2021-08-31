// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import RequestsContainer from 'containers/RequestsContainer';
import type { ContainerProps as RequestsContainerProps } from 'containers/RequestsContainer';
import PieChart from 'components/ChartPie';
import { formatRequests, getConfig } from './config';

type DefaultProps = {
    intl: intlShape
} & RequestsContainerProps;

type Props = {
    type: 'bar' | 'pie'
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const ChartReports = (props: Props) => {
    const { intl, allRequests, isLoading } = props;
    const classes = useStyles();

    if (!allRequests || allRequests.length === 0 || isLoading) return null;

    return (
        <div className={classes.root}>
            <div style={{ marginTop: '-2em' }}>
                <Grid
                    justify="center"
                    alignContent="center"
                    container
                    spacing={0}
                    direction="row"
                >
                    <Grid item>
                        <PieChart
                            height={300}
                            maxHeight={300}
                            width={450}
                            data={
                                isLoading
                                    ? []
                                    : formatRequests(
                                        allRequests,
                                        'status',
                                        intl
                                    )
                            }
                            config={getConfig()}
                        />
                    </Grid>
                    <Grid item>
                        <PieChart
                            height={300}
                            maxHeight={300}
                            width={450}
                            data={
                                isLoading
                                    ? []
                                    : formatRequests(
                                        allRequests,
                                        'progress',
                                        intl
                                    )
                            }
                            config={getConfig()}
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
