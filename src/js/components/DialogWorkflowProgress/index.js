// @flow
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
// import Paper from '@material-ui/core/Paper';
import Dialog from 'components/Dialog';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    passRef: Function,
    diagramURL: string,
    details: Array<Object>
} & DefaultProps;

const useStyles = makeStyles({
    root: {},
    processDiagram: {
        maxHeight: '100%',
        maxWidth: '1000px'
    },
    table: {
        minWidth: '650',
    }
});

const DialogWorkflowProgress = (props: Props) => {
    const { intl, diagramURL, passRef, details } = props;
    const classes = useStyles();

    return (
        <Dialog
            intl={intl}
            ref={passRef}
            title={intl.formatMessage(messages.messageWorkflowView)}
            className={classes.root}
            hideActions
        >
            <div>
                <img
                    className={classes.processDiagram}
                    width="100%"
                    src={diagramURL}
                    alt="Process Diagram"
                />
            </div>

            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{intl.formatMessage(messages.messageWorkflowType)}</TableCell>
                        <TableCell>{intl.formatMessage(messages.messageWorkflowAssignee)}</TableCell>
                        <TableCell>{intl.formatMessage(messages.messageWorkflowCompleted)}</TableCell>
                        <TableCell>{intl.formatMessage(messages.messageWorkflowOutcome)}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {_.map(details, detail => (
                        <TableRow key={detail.id}>
                            <TableCell>{detail.title}</TableCell>
                            <TableCell>{detail.properties.gfr_entity}</TableCell>
                            <TableCell>{detail.properties.bpm_completionDate ? moment(detail.properties.bpm_completionDate).format('MMMM Do, YYYY (HH:mm)') : '--'}</TableCell>
                            <TableCell>{detail.state}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Dialog>
    );
};

export default injectIntl(DialogWorkflowProgress);
