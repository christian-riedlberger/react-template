// @flow
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import type { Field } from 'types/formTypes';
import moment from 'moment';
import clsx from 'clsx';
import { largeCalendarStyle } from './largeCalendarStyle';

type DefaultProps = {
    ...Field
};

type Props = {
    fullSize: boolean,
    setTime: string,
    className?: string,
    disablePast?: boolean,
    disableFuture?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: ({ fullSize }: Props) => {
        const fullSizeStyle = !fullSize ? {} : largeCalendarStyle;

        return {
            width: fullSize ? '100%' : 310,
            '& .MuiPickersToolbar-toolbar button': {
                marginLeft: 20
            },
            ...fullSizeStyle
        };
    }
});

const FieldDatePicker = (props: Props) => {
    const { input, disablePast, disableFuture } = props;
    const classes = useStyles(props);

    useEffect(() => {
        input.onChange(
            moment()
                .add(30, 'd')
                .set('hour', 12)
                .set('minutes', 0)
                .set('seconds', 0)
                .toDate()
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={clsx(classes.root, props.className)}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    autoOk
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    variant="static"
                    openTo="date"
                    value={moment(input.value)}
                    onChange={input.onChange}
                />
            </MuiPickersUtilsProvider>
        </div>
    );
};

export default FieldDatePicker;
