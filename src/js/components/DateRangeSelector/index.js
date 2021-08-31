// @flow
import React, { useState, useEffect } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { fade } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from 'components/Button';
import { renderHiddenField } from 'constants/FormFields';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import clsx from 'clsx';
import messages from 'constants/Messages';
import { isBefore, isAfter, isEqual } from 'date-fns';
import _ from 'lodash';

type DefaultProps = { intl: intlShape };

type Props = {
    classes: Object,
    value?: Array<string>,
    format: string,
    autoOk: boolean,
    onOpen: Function,
    onClose: Function,
    open: Object,
    renderButtons?: boolean,
    onCancel?: Function,
    input: Object,
    change: Function
} & DefaultProps;

/**
 * Date Range Picker
 * @param {*} props
 * @param {array} value - An array with beginning and ending date strings or an empty array
 * @param {function} onChange - The function that handles the selected dates
 */

const DateRangeSelector = (props: Props) => {
    const {
        classes,
        // $FlowFixMe
        value,
        autoOk,
        onOpen,
        onClose,
        onCancel,
        open: openForward,
        renderButtons,
        intl,
        input
    } = props;
    const [begin, setBegin] = useState(_.isArray(value) ? value[0] : '');
    const [end, setEnd] = useState(_.isArray(value) ? value[0] : '');
    const [prevBegin, setPrevBegin] = useState(undefined);
    const [prevEnd, setPrevEnd] = useState(undefined);
    const [hasClicked, setHasClicked] = useState(false);

    const [radioValue, setRadioValue] = useState('range');

    const [hover, setHover] = useState(undefined);
    const [accepted, setAccepted] = useState(false);

    const min = Math.min(Number(begin), end || Number(hover));
    const max = Math.max(Number(begin), end || Number(hover));

    const [open, setOpen] = useState(openForward);

    const isOpen = openForward !== undefined ? openForward : open;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resetCalendar = () => {
        const dateRangeObj = {
            begin: '',
            end: '',
            radioValue: ''
        };

        const currentDate = new Date();
        setBegin(moment(currentDate).toDate());
        setEnd(moment(currentDate).toDate());
        setRadioValue('');

        input.onChange(dateRangeObj);
    };

    // "componentDidMount"
    useEffect(() => {
        setBegin(input.value.begin);
        setEnd(input.value.end);
        setRadioValue(input.value.radioValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // "componentDidUpdate"
    useEffect(() => {
        // Only way to get to this state is is openForward is used
        if (isOpen && accepted && !prevBegin && !prevEnd) {
            setAccepted(false);
            setPrevBegin(begin);
            setPrevEnd(end);
            return;
        }
        // Auto ok and hasn't been accepted, but has all the items set, accept and close.
        // This will also triger the on change event by setting isOpen to false
        if (isOpen && autoOk && !accepted && begin && end && hasClicked) {
            setAccepted(true);
            if (onClose) {
                onClose();
            } else {
                setOpen(false);
            }
        }
        if (accepted && begin && end && (!isOpen || !open) && hasClicked) {
            setHasClicked(false);
            const temp = moment(end)
                .endOf('day')
                .toDate();
            input.onChange({ begin, end: temp, radioValue });
            if (onClose) {
                onClose();
            }
        }
        if (
            input.value.begin === undefined &&
            input.value.end === undefined &&
            input.value.radioValue === undefined
        ) {
            resetCalendar();
        }
    }, [
        begin,
        end,
        autoOk,
        accepted,
        isOpen,
        prevBegin,
        hasClicked,
        prevEnd,
        open,
        onClose,
        input.onChange,
        input,
        resetCalendar,
        radioValue
    ]);

    function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
        return React.cloneElement(dayComponent, {
            onClick: e => {
                setHasClicked(true);
                setOpen(false);
                setAccepted(true);
                e.stopPropagation();
                if (!begin) {
                    setBegin(day);
                    setRadioValue('range');
                } else if (!end) {
                    if (isBefore(day, begin)) {
                        setEnd(begin);
                        setBegin(day);
                    } else {
                        setEnd(day);
                    }
                    if (autoOk) {
                        setPrevBegin(undefined);
                        setPrevEnd(undefined);
                    }
                } else {
                    setBegin(day);
                    setEnd(undefined);
                    setRadioValue('range');
                }
            },
            onMouseEnter: () => requestAnimationFrame(() => setHover(day)),
            onFocus: () => requestAnimationFrame(() => setHover(day)),
            className: clsx(classes.day, {
                [classes.hidden]: dayComponent.props.hidden,
                [classes.current]: dayComponent.props.current,
                [classes.isDisabled]: dayComponent.props.disabled,
                [classes.focusedRange]:
                    (isAfter(day, min) && isBefore(day, max)) ||
                    (isEqual(day, min) && !isEqual(day, max)) ||
                    (isEqual(day, max) && !isEqual(day, min)),
                [classes.focusedFirst]: isEqual(day, min) && !isEqual(day, max),
                [classes.focusedLast]: isEqual(day, max) && !isEqual(day, min),
                [classes.beginCap]: isEqual(day, min),
                [classes.endCap]: isEqual(day, max)
            })
        });
    }

    const getStartEndDate = rangeFlag => {
        const dateRangeObj = {};
        const currentDate = new Date();

        if (rangeFlag !== 'range') {
            dateRangeObj.begin = moment(currentDate)
                .startOf(rangeFlag)
                .toDate();
            // need the start of the day for comparison to hover && day for visuals
            dateRangeObj.end = moment(currentDate)
                .endOf(rangeFlag)
                .startOf('day')
                .toDate();
        } else {
            dateRangeObj.begin = '';
            dateRangeObj.end = '';
        }

        return dateRangeObj;
    };

    const handleChange = (event: SyntheticEvent<HTMLElement>) => {
        // $FlowFixMe
        const rangeFlag = event.target.value;
        // $FlowFixMe
        setRadioValue(event.target.value);
        const dateRangeObj = getStartEndDate(rangeFlag);
        dateRangeObj.radioValue = rangeFlag;

        setBegin(dateRangeObj.begin);
        setEnd(dateRangeObj.end);

        // set to end of the day for redux form
        dateRangeObj.end = moment(dateRangeObj.end)
            .endOf('day')
            .toDate();
        input.onChange(dateRangeObj);
    };

    const acceptedClick = () => {
        if (begin && end) {
            setAccepted(true);
            setHasClicked(true);
            setOpen(false);
        }
    };

    const renderAcceptButton = () => {
        return (
            <div className={classes.buttonContainer}>
                <Button text="accept" size="small" onClick={acceptedClick} />
                <Button
                    text="cancel"
                    size="small"
                    color="grey"
                    onClick={onCancel}
                />
            </div>
        );
    };

    const renderCustomToolbar = () => {
        return (
            <div className={classes.radioContainer}>
                <FormControl
                    component="fieldset"
                    className={classes.formControl}
                >
                    <RadioGroup
                        aria-label="date range picker"
                        name="dateRangePicker"
                        value={radioValue}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            value="month"
                            control={<Radio />}
                            label={intl.formatMessage(messages.month)}
                            className={classes.radioButton}
                            data-cy="dateRangeMonth"
                        />
                        <FormControlLabel
                            value="quarter"
                            control={<Radio />}
                            label={intl.formatMessage(messages.quarter)}
                            className={classes.radioButton}
                        />
                        <FormControlLabel
                            value="year"
                            control={<Radio />}
                            label={intl.formatMessage(messages.year)}
                            className={classes.radioButton}
                        />
                        <FormControlLabel
                            value="range"
                            control={<Radio />}
                            label={intl.formatMessage(messages.range)}
                            className={classes.radioButton}
                        />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    };

    return (
        <div>
            <div>
                <Field {...input} component={renderHiddenField} />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        {...props}
                        value={begin}
                        renderDay={renderDay}
                        variant="static"
                        open={isOpen}
                        onOpen={() => {
                            setAccepted(false);
                            setPrevBegin(begin);
                            setPrevEnd(end);
                            if (onOpen) {
                                onOpen();
                            } else {
                                setOpen(true);
                            }
                        }}
                        onAccept={() => {
                            if (!begin || !end) {
                                if (hover && isBefore(begin, hover)) {
                                    setEnd(hover);
                                } else {
                                    setEnd(begin);
                                    setBegin(hover);
                                }
                            }
                            setPrevBegin(undefined);
                            setPrevEnd(undefined);
                            // if (!autoOk) {
                            setAccepted(true);
                            // }
                        }}
                        onClose={() => {
                            if (onClose) {
                                onClose();
                            } else {
                                setOpen(false);
                            }
                        }}
                        onChange={() => {}}
                        DialogProps={{
                            className: classes.dateRangePickerDialog
                        }}
                        ToolbarComponent={renderCustomToolbar}
                    />
                </MuiPickersUtilsProvider>
                {renderButtons && renderAcceptButton()}
            </div>
        </div>
    );
};

export const styles = (theme: Object) => {
    const focusedRangeColor = fade(theme.palette.primary.main, 0.3);
    const focusedRangeGradient = `linear-gradient(to right, ${focusedRangeColor}, ${focusedRangeColor})`;
    const transparentRangeGradient = `linear-gradient(to right, rgba(0,0,0,0.0), rgba(0,0,0,0.0))`;
    return {
        dateRangePickerDialog: {
            '& .MuiPickersCalendar-transitionContainer': {
                minHeight: 218,
                marginTop: 10
            }
        },
        day: {
            width: 40,
            height: 36,
            fontSize: theme.typography.caption.fontSize,
            margin: 0,
            color: theme.palette.text.primary,
            fontWeight: theme.typography.fontWeightMedium,
            padding: 0,
            transition: 'none',
            '&::after': {
                borderRadius: '100%',
                bottom: 0,
                boxSizing: 'border-box',
                content: '""',
                height: 36,
                width: 36,
                left: 0,
                margin: 'auto',
                position: 'absolute',
                right: 0,
                top: 0,
                transform: 'scale(0)',
                zIndex: 2
            },
            '&:hover': {
                backgroundColor: 'transparent',
                color: theme.palette.text.primary,
                '&::after': {
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.primary.main}`,
                    bottom: -2,
                    left: -2,
                    height: 36,
                    width: 36,
                    right: -2,
                    top: -2,
                    boxSizing: 'content-box',
                    transform: 'scale(1)'
                }
            },
            '& > .MuiIconButton-label': {
                zIndex: 3
            }
        },
        hidden: {
            opacity: 0,
            pointerEvents: 'none'
        },
        current: {
            color: theme.palette.primary.main,
            fontWeight: 600
        },
        focusedRange: {
            color: theme.palette.primary.contrastText,
            background: `${focusedRangeGradient} no-repeat 0/20px 40px, ${focusedRangeGradient} no-repeat 20px 0/20px 40px`,
            fontWeight: theme.typography.fontWeightMedium,
            width: 40,
            marginRight: 0,
            marginLeft: 0,
            borderRadius: 0
        },
        dayDisabled: {
            pointerEvents: 'none',
            color: theme.palette.text.hint
        },
        beginCap: {
            '&::after': {
                transform: 'scale(1)',
                backgroundColor: theme.palette.primary.main
            }
        },
        endCap: {
            '&::after': {
                transform: 'scale(1)',
                backgroundColor: theme.palette.primary.main
            }
        },
        focusedFirst: {
            background: `${transparentRangeGradient} no-repeat 0/20px 40px,${focusedRangeGradient} no-repeat 20px 0/20px 40px`
        },
        focusedLast: {
            background: `${focusedRangeGradient} no-repeat 0/20px 40px,${transparentRangeGradient} no-repeat 20px 0/20px 40px`
        },
        radioContainer: {},
        formControl: {
            paddingBottom: '.5em'
        },
        radioButton: {
            '& span.MuiRadio-colorSecondary.Mui-checked': {
                color: 'rgb(0, 199, 113)'
            }
        },
        buttonContainer: {}
    };
};

export default withStyles(styles, { name: 'DateRangeSelector' })(
    injectIntl(DateRangeSelector)
);
