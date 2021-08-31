// @flow
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import type { Field } from 'types/formTypes';
import moment from 'moment';
import clsx from 'clsx';

type DefaultProps = {
    ...Field
};

type Props = {
    label: string,
    fullSize: boolean,
    className?: string,
    disablePast?: boolean,
    disableFuture?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FieldKeyboardDatePicker = (props: Props) => {
    const { input, disablePast, disableFuture, label } = props;
    const classes = useStyles(props);

    useEffect(() => {
        input.onChange(
            moment(
                input.value ||
                    moment()
                        .add(30, 'd')
                        .endOf('day')
                        .toDate()
            ).toDate()
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={clsx(classes.root, props.className)}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label={label}
                    format="MM/dd/yyyy"
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    value={input.value}
                    InputAdornmentProps={{ position: 'end' }}
                    onChange={date => input.onChange(date)}
                />
            </MuiPickersUtilsProvider>
        </div>
    );
};

export default FieldKeyboardDatePicker;
