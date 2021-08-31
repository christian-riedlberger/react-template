// @flow
import React, { useState } from 'react';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
    value: string,
    onChange: Function
};

const useStyles = makeStyles({
    root: {
        '& .MuiIconButton-label': {
            color: '#d4d9e0'
        }
    }
});

const DatePicker = ({ onChange, value }: Props) => {
    // Setup state
    const [selectedDate, handleDateChange] = useState(
        value ? new Date(value) : new Date()
    );
    const classes = useStyles();

    const handleChange = date => {
        if (onChange) onChange(date);
        handleDateChange(date);
    };

    return (
        <div className={classes.root}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    InputAdornmentProps={{ position: 'start' }}
                    onChange={date => handleChange(date)}
                />
            </MuiPickersUtilsProvider>
        </div>
    );
};

export default DatePicker;
