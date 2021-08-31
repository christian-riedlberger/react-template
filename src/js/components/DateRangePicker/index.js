import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { intlShape, injectIntl } from 'react-intl';
import messages from 'constants/Messages';

import DatePicker from 'components/DatePicker';

type DefaultProps = {
    intl: intlShape,
    classes: Object
};

type Props = {
    fromValue: string,
    toValue: string,
    onChange: Function
} & DefaultProps;

const styles = {
    root: {}
};

const DateRangePicker = ({
    intl,
    classes,
    fromValue,
    toValue,
    onChange
}: Props) => {
    const [dates, setDates] = useState({
        from: fromValue,
        to: toValue
    });

    useEffect(() => {
        if (onChange) onChange(dates.from, dates.to);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dates]);

    const handleDateChange = (value, date) => {
        setDates(state => ({
            ...state,
            [date]: value
        }));
        onChange(dates.from, dates.to);
    };

    return (
        <div id="dateRangePicker" className={classes.root}>
            <DatePicker
                onChange={v => handleDateChange(v, 'from')}
                value={fromValue}
            />
            <span className="to">{intl.formatMessage(messages.to)}</span>
            <DatePicker
                onChange={v => handleDateChange(v, 'to')}
                value={toValue}
            />
        </div>
    );
};

export default withStyles(styles)(injectIntl(DateRangePicker));
