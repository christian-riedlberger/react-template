// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { CHART_LEGEND_SUMMARY } from 'constants/Config';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import getChartColors from '../../utils/chartColors';

type DefaultProps = {
    classes: Object
};
type Props = {
    data: Array<Object>
} & DefaultProps;

const styles = {
    root: {
        marginTop: '-4em',
        marginBottom: '-3em',

        '& .MuiExpansionPanelSummary-expandIcon': {
            position: 'absolute',
            bottom: 0,
            right: '.75em'
        }
    },
    legendItem: {
        borderTop: '1px solid #ecf0f6',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '1.2em 1.2em',
        fontWeight: 100
    },
    circle: {
        'border-radius': '50%',
        width: '1em',
        height: '1em',
        display: 'inline-block',
        marginRight: '0.6em'
    },
    panelDetails: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'visible'
    },
    panel: {
        padding: '0',
        overflow: 'visible',
        '& .MuiButtonBase-root': {
            alignItems: 'baseline'
        }
    },
    panelSummary: {
        padding: 0,
        '& div.MuiExpansionPanelSummary-content.Mui-expanded': {
            margin: '0'
        },
        '& .MuiExpansionPanelSummary-content': {
            display: 'flex',
            flexDirection: 'column'
        },
        '& .MuiIconButton-root': {
            alignItems: 'baseline'
        }
    },
    summaryItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '0.8em 0',
        padding: '0'
    },
    summaryItemBorder: {
        border: 'none'
    },
    detailsItemBorder: {
        borderTop: 'solid 1px #ECEDEF'
    }
};

class ChartLegend extends Component<Props> {
    renderLegend = (legend: Object, color: string) => {
        const { classes } = this.props;
        const legendColor = legend.color ? legend.color : color;

        return (
            <div className={classes.legendItem}>
                <span
                    className={classes.circle}
                    style={{ backgroundColor: legendColor }}
                />
                <span>{legend.label}</span>
            </div>
        );
    };

    renderDetailsPanel = (data: Array<Object>, colorArr: Array<string>) => {
        const filteredData = data.filter((val, i) => {
            return i > CHART_LEGEND_SUMMARY - 1;
        });
        return _.map(filteredData, (legend, i) => {
            const color = colorArr[i + CHART_LEGEND_SUMMARY];
            return (
                <div key={`${legend.id}${i}`}>
                    {this.renderLegend(legend, color)}
                </div>
            );
        });
    };

    renderSummaryPanel = (data: Array<Object>, colorArr: Array<string>) => {
        const filteredData = data.filter((val, i) => {
            return i <= CHART_LEGEND_SUMMARY - 1;
        });
        return _.map(filteredData, (legend, i) => {
            const color = colorArr[i];
            return (
                <div key={`${legend.id}${i}`}>
                    {this.renderLegend(legend, color)}
                </div>
            );
        });
    };

    render() {
        const { data, classes } = this.props;
        const colorArr = getChartColors(data);

        return (
            <div className={classes.root}>
                <ExpansionPanel className={classes.panel}>
                    <ExpansionPanelSummary
                        className={classes.panelSummary}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        {this.renderSummaryPanel(data, colorArr)}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        {this.renderDetailsPanel(data, colorArr)}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

export default withStyles(styles)(ChartLegend);
