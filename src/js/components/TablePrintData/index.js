import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as customTheme from 'constants/Theme';

type Props = {
    columns: Array<string>,
    rows: Array<Object>
};

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: customTheme.green,
        color: theme.palette.common.white,
        fontSize: 24
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        }
    }
}))(TableRow);

export default class TablePrintData extends React.Component<Props> {
    render() {
        const { rows, columns } = this.props;
        if (rows && columns) {
            return (
                <Paper>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
                                    <StyledTableCell key={column}>
                                        {column}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map(rows, (row, index) => (
                                <StyledTableRow key={index}>
                                    {_.map(columns, value => {
                                        if (_.isArray(row[value])) {
                                            return (
                                                <StyledTableCell
                                                    key={`${value}-${index}`}
                                                >
                                                    {row[value].join(', ')}
                                                </StyledTableCell>
                                            );
                                        }
                                        return (
                                            <StyledTableCell
                                                key={`${value}-${index}`}
                                            >
                                                {row[value] || ''}
                                            </StyledTableCell>
                                        );
                                    })}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            );
        }
        return <div />;
    }
}
