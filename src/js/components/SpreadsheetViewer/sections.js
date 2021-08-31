// @flow
import React, { Component } from 'react';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MuiTablePagination from '@material-ui/core/TablePagination';
import _ from 'lodash';
import clsx from 'clsx';

import TabLined from 'components/TabLined';

type Props = {
    count: number,
    classes?: Object,
    textLabels: Object,
    rowsPerPage: any,
    page: any,
    tabs: Array<string>,
    onTabChange: number => void,
    activeTab: number,
    changePage: number => void,
    changeRowsPerPage: number => void
};

export class CustomFooter extends Component<Props> {
    static defaultProps = { classes: {} };

    handleRowChange = (event: SyntheticEvent<any>) => {
        // $FlowFixMe
        this.props.changeRowsPerPage(event.target.value);
    };

    handlePageChange = (__: SyntheticEvent<any>, page: number) => {
        this.props.changePage(page);
    };

    render() {
        const {
            count,
            classes,
            textLabels,
            rowsPerPage = '10',
            page,
            tabs,
            onTabChange,
            activeTab,
            changePage
        } = this.props;

        const footerStyle = {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0px 24px 0px 24px'
        };

        return (
            <TableFooter className={clsx(_.get(classes, 'root'))}>
                <TableRow>
                    <TableCell style={footerStyle} colSpan={1000}>
                        <TabLined
                            noTranslate
                            tabs={tabs}
                            onChange={index => {
                                changePage(0);
                                onTabChange(index);
                            }}
                            activeTab={activeTab}
                        />

                        <MuiTablePagination
                            component="div"
                            count={count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage={textLabels.rowsPerPage}
                            labelDisplayedRows={({ from, to, count: total }) =>
                                `${from}-${to} ${textLabels.displayRows} ${total}`
                            }
                            backIconButtonProps={{
                                'aria-label': textLabels.previous
                            }}
                            nextIconButtonProps={{
                                'aria-label': textLabels.next
                            }}
                            rowsPerPageOptions={[10, 20, 100]}
                            onChangePage={this.handlePageChange}
                            onChangeRowsPerPage={this.handleRowChange}
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
        );
    }
}

export default { CustomFooter };
