// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { Grid, CircularProgress } from '@material-ui/core';
import XLSX from 'xlsx';
import { xhr } from 'actions/xhr';
import { FILE_VIEW } from 'constants/ServiceURI';

import { CustomFooter } from './sections';

type DefaultProps = {
    classes: Object
};
type Props = {
    nodeRef: string,
    fileType: string
} & DefaultProps;

type State = {
    isLoading: boolean,
    workbook: Object,
    activeTab: number
};

const styles = () => ({
    root: {
        overflowY: 'hidden',
        maxHeight: '60em',
        '& table': {
            maxWidth: '100%',
            overflowX: 'auto'
        }
    }
});

const columnsFromWorkbook = wb =>
    Array(_.max(_.map(wb, 'length')))
        .fill(null)
        .map((__, i: number) => wb[0][i] || '');

/**
 *  Component
 *  @desc
 *  @author
 */
@withStyles(styles)
class SpreadsheetViewer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            workbook: {},
            isLoading: false,
            activeTab: 0
        };
    }

    componentDidMount() {
        const { nodeRef, fileType } = this.props;
        const guid = nodeRef.split('/').slice(-1)[0];

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ isLoading: true }, () => {
            xhr.get(
                FILE_VIEW(guid),
                {
                    attachment: false,
                    v: Math.random()
                },
                { responseType: 'arraybuffer' }
            )
                .then(resp => {
                    // @docs see https://github.com/SheetJS/sheetjs/tree/master/demos/xhr#axios-wrapper-library
                    const workbook = XLSX.read(
                        // eslint-disable-next-line compat/compat
                        new Uint8Array(resp.data),
                        {
                            type: fileType === 'csv' ? 'array' : 'buffer'
                        }
                    );

                    this.setState({ workbook, isLoading: false });
                    return null;
                })
                .catch(err => {
                    throw new Error(err);
                });
        });
    }

    renderTable = (data: Object) => {
        const { classes } = this.props;
        const { isLoading, workbook, activeTab } = this.state;

        const options = {
            filter: true,
            print: false,
            download: false,
            search: true,
            selectableRows: 'multiple',
            filterType: 'dropdown',
            rowsPerPage: 25,
            rowsPerPageOptions: [25, 50, 100],
            responsive: 'scroll',
            customFooter: (
                count,
                page,
                rowsPerPage,
                changeRowsPerPage,
                changePage,
                textLabels
            ) => {
                return (
                    <CustomFooter
                        count={count}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        changeRowsPerPage={changeRowsPerPage}
                        changePage={changePage}
                        textLabels={textLabels}
                        tabs={workbook.SheetNames}
                        onTabChange={(i: number) =>
                            this.setState({ activeTab: i })
                        }
                        activeTab={activeTab}
                    />
                );
            }
        };

        const formatedData = XLSX.utils.sheet_to_json(data, { header: 1 });
        const columns = columnsFromWorkbook(formatedData);

        if (isLoading)
            return (
                <span className={classes.circularProgress}>
                    <CircularProgress size={48} />
                </span>
            );
        return (
            <div id="excel">
                <MUIDataTable
                    key="mui-datatable"
                    data={formatedData}
                    columns={columns}
                    options={options}
                />
            </div>
        );
    };

    render() {
        const { classes } = this.props;
        const { workbook, activeTab } = this.state;

        const panes = _.map(workbook.Sheets, this.renderTable);

        return (
            <Grid container direction="column" className={classes.root}>
                <Grid item>{panes[activeTab]}</Grid>
            </Grid>
        );
    }
}

export default SpreadsheetViewer;
