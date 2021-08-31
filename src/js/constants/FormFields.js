// @flow
import _ from 'lodash';
import * as React from 'react';
import { Fragment, useState, useReducer, useRef, useEffect } from 'react';
import type { Node } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
    KeyboardDatePicker,
    KeyboardTimePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import MenuItem from '@material-ui/core/MenuItem';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { injectIntl, intlShape } from 'react-intl';

import { log } from 'utils/logger';
import CheckboxSelector from 'components/CheckboxSelector';
import { fieldArrayErrorSelector } from 'containers/FormContainer';
import { MULTILINE_FORM_ROWS, DEBOUNCE_DELAY } from 'constants/Config';
import TooltipLong from 'components/TooltipLong';
import { grey0, green, grey1, white0, red, errorred } from 'constants/Theme';
import { fetchGroupsBrowse } from 'actions/ActionGroups';
import messages from 'constants/Messages';
import type { Field as FieldType } from 'types/formTypes';

const useStyles = makeStyles(theme => ({
    textProgress: {
        margin: '1em 0em 0em -2.2em'
    },
    multilineProgess: {
        margin: `${MULTILINE_FORM_ROWS}em 0em 0em -2.2em`
    },
    field: {},
    pickerField: {
        '& .MuiInputLabel-root': {
            color: errorred
        },
        '& .MuiInput-underline:before': {
            borderBottom: `2px solid ${errorred}`
        },
        '& button': {
            color: errorred
        }
    },
    errorText: {
        '& p': {
            paddingTop: '0px',
            color: errorred
        }
    },
    errorSelector: () => {
        return {
            '& .selected .MuiFormControl-root .MuiFormGroup-root': {
                borderColor: errorred
            },
            '& .selected .MuiFormControl-root legend': {
                color: errorred
            }
        };
    },
    formWithHelp: {},
    link: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    icon: {
        'min-width': 30
    },
    iconSelect: {
        color: theme.palette.primary.light
    },
    divider: {
        padding: '2em 0 2em 0',
        '& span': {
            color: theme.palette.secondary.light
        }
    },
    formWithHelp: {},
    datePicker: {
        '& .MuiInputBase-root': {
            margin: '0 5px 0 5px'
        }
    },
    select: {
        minWidth: '100%'
    },
    label: {
        backgroundColor: white0
    }
}));

export const renderTextField = ({
    label,
    input,
    change,
    fullWidth,
    readOnly,
    autoFocus = false,
    onEnterPress = () => {},
    initValue,
    hideErrors,
    meta,
    isLoading,
    // $FlowFixMe
    ...custom
}: Field & {
    isLoading?: Boolean,
    readOnly: boolean,
    change: (string, any) => void,
    initValue: string
}) => {
    const classes = useStyles();
    // outlined style fix + InputProps and InputLabelProps in <TextField> *** Read function useInvisibleRefWidth ***
    const inputLabel = useRef({});
    const labelWidth = label ? useInvisibleRefWidth(inputLabel) : 0;
    // --end- outlined style fix

    useEffect(() => {
        if (initValue) {
            change(input.name, initValue);
        }
    }, []);
    let helperText = null;
    const {
        touched = false,
        invalid = false,
        error = null,
        asyncValidating = false,
        warning = null
    } = meta || {};

    const Loading = (
        <InputAdornment position="end">
            <CircularProgress size={20} />
        </InputAdornment>
    );

    if (!hideErrors && touched && error) helperText = error;
    if (!hideErrors && touched && warning) helperText = warning;

    if (helperText && messages[helperText]) {
        helperText = <FormattedMessage {...messages[helperText]} />;
    }

    return (
        <Fragment>
            <TextField
                label={label}
                placeholder={label}
                error={touched && invalid}
                helperText={helperText}
                className={classes.field}
                variant="outlined"
                fullWidth={fullWidth}
                autoComplete="off"
                autoFocus={autoFocus}
                InputProps={{
                    labelWidth,
                    'data-cy': input.name,
                    endAdornment: isLoading ? Loading : null
                }}
                InputLabelProps={{
                    ref: inputLabel
                }}
                onClick={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
                onKeyDown={e => {
                    if (e.keyCode == 13 && e.shiftKey == false) {
                        onEnterPress();
                    }
                }}
                // $FlowFixMe
                {...input}
                {...custom}
            />
            {asyncValidating && (
                <CircularProgress size={20} className={classes.textProgress} />
            )}
        </Fragment>
    );
};

export const renderTextFieldVisibility = injectIntl(
    ({
        label,
        input,
        fullWidth,
        readOnly,
        initValue,
        hideErrors,
        intl,
        meta,
        isLoading,
        // $FlowFixMe
        ...custom
    }: FieldType & {
        readOnly: boolean,
        initValue: string,
        intl: intlShape,
        isLoading?: boolean
    }) => {
        const classes = useStyles();
        // outlined style fix + InputProps and InputLabelProps in <TextField> *** Read function useInvisibleRefWidth ***
        const inputLabel = useRef({});
        const labelWidth = label ? useInvisibleRefWidth(inputLabel) : 0;
        // --end- outlined style fix

        useEffect(() => {
            if (initValue) {
                input.onChange(initValue);
            }
        }, []);
        let helperText = null;
        const {
            touched = false,
            invalid = false,
            error = null,
            asyncValidating = false,
            warning = null
        } = meta || {};
        if (!hideErrors && touched && error) helperText = error;
        if (!hideErrors && touched && warning) helperText = warning;

        if (helperText && messages[helperText]) {
            helperText = <FormattedMessage {...messages[helperText]} />;
        }

        const Visible = (
            <Field
                name={`${input.name}Visible`}
                component={(props: Field) => (
                    <Tooltip
                        title={intl.formatMessage(messages.publicVisibility)}
                        placement="top"
                    >
                        <IconButton
                            onClick={() =>
                                props.input.onChange(!props.input.value)
                            }
                            onMouseDown={e => {
                                e.preventDefault();
                            }}
                            edge="end"
                        >
                            {props.input.value ? (
                                <Visibility />
                            ) : (
                                <VisibilityOff />
                            )}
                        </IconButton>
                    </Tooltip>
                )}
            />
        );

        const Loading = <CircularProgress size={20} />;

        return (
            <Fragment>
                <TextField
                    label={label}
                    placeholder={label}
                    error={touched && invalid}
                    helperText={helperText}
                    className={classes.field}
                    variant="outlined"
                    fullWidth={fullWidth}
                    autoComplete="off"
                    InputProps={{
                        labelWidth,
                        'data-cy': input.name,
                        endAdornment: (
                            <InputAdornment position="end">
                                {isLoading ? Loading : Visible}
                            </InputAdornment>
                        )
                    }}
                    InputLabelProps={{
                        ref: inputLabel
                    }}
                    onClick={e => e.stopPropagation()}
                    onDoubleClick={e => e.stopPropagation()}
                    // $FlowFixMe
                    {...input}
                    {...custom}
                />
                {asyncValidating && (
                    <CircularProgress
                        size={20}
                        className={classes.textProgress}
                    />
                )}
            </Fragment>
        );
    }
);

export const renderMultiLineTextField = (
    props: Field & { isLoading?: boolean }
) => {
    const {
        label,
        input,
        isLoading,
        // $FlowFixMe
        meta: { touched, invalid, error, asyncValidating },
        ...custom
    } = props;
    const classes = useStyles();

    // outlined style fix + InputProps and InputLabelProps in <TextField>
    const inputLabel = useRef();
    const labelWidth = label ? useInvisibleRefWidth(inputLabel) : 0;
    // --end- outlined style fix

    const Loading = (
        <InputAdornment position="end">
            <CircularProgress size={20} />
        </InputAdornment>
    );

    let helperText = null;
    if (touched && error) helperText = error;

    if (helperText && messages[helperText]) {
        helperText = <FormattedMessage {...messages[helperText]} />;
    }

    return (
        <Fragment>
            <TextField
                autoComplete="off"
                multiline
                rows={MULTILINE_FORM_ROWS}
                label={label}
                placeholder={label}
                error={touched && invalid}
                helperText={helperText}
                className={classes.field}
                variant="outlined"
                onClick={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
                InputProps={{
                    labelWidth,
                    'data-cy': input.name
                }}
                InputLabelProps={{
                    ref: inputLabel,
                    endAdornment: isLoading ? Loading : null
                }}
                // $FlowFixMe
                {...input}
                {...custom}
            />
            {asyncValidating && (
                <CircularProgress
                    size={20}
                    className={classes.multilineProgess}
                />
            )}
        </Fragment>
    );
};

// Helper for textfields to eliminate the variant='outlined' border passing through the label when in use(clicked on)
// Reproduced by using tabs, wizard, or other forms of control that switches the textfield from display: none (or other hidden styles) to displaying the textfield
// Currently broken as of Version: Material-UI@4.2.1
// Implemented on March 10, 2020

function useInvisibleRefWidth(ref) {
    // initialize with undefined or offsetWidth
    const [labelWidth, setLabelWidth] = useState(
        _.get(ref.current, 'offsetWidth')
    );
    useEffect(() => {
        // $FlowFixMe
        const { offsetWidth, innerText } = ref.current;
        if (!labelWidth && _.get(ref.current, 'offsetWidth')) {
            // $FlowFixMe
            setLabelWidth(ref.current.offsetWidth);
        } else if (!offsetWidth && _.get(innerText, 'length', 0) > 0) {
            // $FlowFixMe
            const temporarySpan = ref.current.cloneNode();
            temporarySpan.innerText = innerText;

            // $FlowFixMe
            document.body.appendChild(temporarySpan);
            // we set state only if it's changing
            if (labelWidth !== temporarySpan.offsetWidth) {
                setLabelWidth(temporarySpan.offsetWidth);
            }

            // $FlowFixMe
            document.body.removeChild(temporarySpan);
        }
    });
    return labelWidth;
}

export const renderCheckbox = ({ input, label, help }: Field) => {
    const classes = useStyles();
    return (
        <div classes={classes.formWithHelp}>
            <FormControlLabel
                control={
                    <Checkbox
                        color="primary"
                        checked={!!input.value}
                        onChange={input.onChange}
                        name={input.name}
                        inputProps={{
                            'data-cy': input.name
                        }}
                    />
                }
                label={label}
            />
            {help && <TooltipLong id={help} />}
        </div>
    );
};

export const renderCheckboxWithoutControl = ({ input, label, help }: Field) => {
    const classes = useStyles();
    return (
        <div classes={classes.formWithHelp}>
            <Checkbox
                color="primary"
                checked={!!input.value}
                onChange={input.onChange}
                name={input.name}
                inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <span className={classes.link}>{label}</span>
        </div>
    );
};

export const renderSwitch = ({ input, label, help }: Field) => {
    const classes = useStyles();
    return (
        <div classes={classes.formWithHelp}>
            <FormControlLabel
                control={
                    <Switch
                        checked={!!input.value}
                        onChange={input.onChange}
                        color="primary"
                    />
                }
                label={label}
            />
            {help && <TooltipLong id={help} />}
        </div>
    );
};

export const radioButton = ({ input, ...rest }: Field) => (
    <FormControl>
        {/* $FlowFixMe */}
        <RadioGroup {...input} {...rest}>
            <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
    </FormControl>
);

export const renderFormHelper = ({ touched, error }: Object) => {
    if (touched && error) {
        return <FormHelperText>{touched && error}</FormHelperText>;
    }

    return null;
};

export const renderSelectField = (props: Field) => {
    const {
        input,
        label,

        // $FlowFixMe
        meta: { touched, error },
        children,
        options
    } = props;

    const classes = useStyles(props);
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [value, setValue] = useState('');

    useEffect(() => {
        if (label && inputLabel.current)
            setLabelWidth(inputLabel.current.offsetWidth);
        if (input.value) setValue(input.value);
    }, []);

    // Watch for redux reset
    useEffect(() => {
        if (input.value === '' && value !== '') setValue('');
    }, [input.value]);

    const handleChange = e => {
        setValue(e.target.value);
        input.onChange(e.target.value);
    };

    const id = `${input.name}-label-id`;
    return (
        <FormControl
            variant="outlined"
            error={touched && error}
            className={classes.select}
        >
            {/* $FlowFixMe */}
            {label && (
                <InputLabel ref={inputLabel} id={id}>
                    <span className={classes.label}>{label}</span>
                </InputLabel>
            )}
            <Select
                fullWidth
                labelId={id}
                labelWidth={labelWidth}
                value={value}
                onChange={handleChange}
                id={input.name}
                MenuProps={{
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left'
                    },
                    getContentAnchorEl: null
                }}
            >
                {_.map(options, option => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        data-cy={option.title}
                    >
                        {option.title}
                    </MenuItem>
                ))}
            </Select>
            {touched && error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export const renderHiddenField = (
    props: FieldType & { passRef?: Function }
) => {
    return (
        <input
            autoComplete="hidden-field"
            type="hidden"
            name={props.input.name}
            value={props.input.value}
            ref={props.passRef}
        />
    );
};

export const renderDateField = (props: Field) => {
    const {
        input,
        label,

        // $FlowFixMe
        meta: { error, touched }
    } = props;

    const classes = useStyles(props);

    const initialValue = !_.isEmpty(props.input.value.toString())
        ? props.input.value
        : null;

    const [selectedDate, handleDateChange] = useState(initialValue);
    return (
        <div className={error && touched ? classes.pickerField : undefined}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    margin="normal"
                    format="MM/dd/yyyy"
                    label={label}
                    value={selectedDate}
                    onChange={newDate => {
                        handleDateChange(newDate);
                        input.onChange(newDate);
                    }}
                />
                <div className={classes.errorText}>
                    {renderFormHelper({ touched, error })}
                </div>
                <input name={input.name} type="hidden" value={input.value} />
            </MuiPickersUtilsProvider>
        </div>
    );
};

export const renderTimeField = (props: Field) => {
    const {
        input,
        label,
        // $FlowFixMe
        meta: { error, touched }
    } = props;
    const classes = useStyles();

    const handleHour = event => {
        const time = _.concat(
            event.target.value,
            input.value.split(':')[1] || '00',
            input.value.split(':')[2] || 'PM'
        ).join(':');
        input.onChange(time);
    };

    const handleMinute = event => {
        const time = _.concat(
            input.value.split(':')[0] || '12',
            event.target.value,
            input.value.split(':')[2] || 'PM'
        ).join(':');
        input.onChange(time);
    };

    const handlePeriod = event => {
        const time = _.concat(
            input.value.split(':')[0] || '12',
            input.value.split(':')[1] || '00',
            event.target.value
        ).join(':');
        input.onChange(time);
    };

    const hours = _.concat(
        12,
        Array(11)
            .fill(null)
            .map((__, i) => String(i + 1))
    );
    const minutes = Array(60)
        .fill(null)
        // $FlowFixMe
        .map((__, i) => (String(i).length === 1 ? `0${String(i)}` : String(i)));

    return (
        <div
            className={clsx(
                error && touched && classes.pickerField,
                classes.datePicker
            )}
        >
            <Select
                margin="dense"
                variant="outlined"
                onChange={handleHour}
                value={(input.value || '12').split(':')[0]}
            >
                {_.map(hours, h => (
                    <MenuItem key={h} value={h}>
                        {h}
                    </MenuItem>
                ))}
            </Select>
            :
            <Select
                margin="dense"
                variant="outlined"
                onChange={handleMinute}
                value={(input.value || ':00').split(':')[1]}
            >
                {_.map(minutes, m => (
                    <MenuItem key={m} value={m}>
                        {m}
                    </MenuItem>
                ))}
            </Select>
            <Select
                margin="dense"
                variant="outlined"
                onChange={handlePeriod}
                value={(input.value || '::PM').split(':')[2]}
            >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
            </Select>
        </div>
    );
};

type SelectorDefaultProps = {
    ...Field,
    error: string,
    touched: boolean,
    defaultValues: Array<{ title: string, value: any }>
};

type SelectorProps = {
    isLoading: boolean,
    fields: Array<Object>,
    labelFilter: string | Node,
    labelSelected: string | Node,
    name: string,
    boxes: Array<{ title: string, value: string }>,
    onSearch: Function
} & SelectorDefaultProps;

/**
 * @container FormReportDomains, FormReportNotifications
 * @description wraps the checkbox selector component in a redux form <Field />
 *     needs additional form decorator `@reduxFromArray(formName, valdiate)` to
 *     work correctly
 */
export const FieldCheckboxSelector = fieldArrayErrorSelector(
    (props: SelectorProps) => {
        const {
            labelFilter,
            labelSelected,
            isLoading,

            // $FlowFixMe
            fields,
            touched,
            error,
            onSearch,
            boxes,
            defaultValues
        } = props;
        const classes = useStyles(props);

        return (
            <div
                className={
                    touched && error ? classes.errorSelector : classes.root
                }
            >
                <CheckboxSelector
                    boxes={boxes}
                    labelFilter={labelFilter}
                    labelSelected={touched && error ? error : labelSelected}
                    onSearch={term => {
                        fields.removeAll();
                        onSearch(term);
                    }}
                    onAdd={box => fields.push(box.value)}
                    onRemove={box =>
                        fields.forEach((__, index) => {
                            if (fields.get(index) === box.value)
                                fields.remove(index);
                        })
                    }
                    isLoading={isLoading}
                    defaultValues={_.map(defaultValues, value => ({
                        ...boxes[_.findIndex(boxes, { value })]
                    }))}
                />
            </div>
        );
    }
);

type DateTimeProps = {
    ...Field,
    dateLabel: string,
    timeLabel: string
};

export const renderDateTimeField = (props: DateTimeProps) => {
    const { dateLabel, timeLabel, input, meta } = props;

    return (
        <Grid container spacing={2}>
            <Grid item>
                {/* $FlowFixMe */}
                {renderDateField({
                    input: {
                        ...input,
                        onChange: newDate => {
                            const date = moment.isMoment(moment(input.value))
                                ? moment(input.value)
                                : null;
                            input.onChange(
                                moment(newDate)
                                    .hour(date ? date.hour() : 0)
                                    .minute(date ? date.minute() : 0)
                                    .second(date ? date.second() : 0)
                                    .millisecond(date ? date.millisecond() : 0)
                                    .toISOString()
                            );
                        }
                    },
                    label: dateLabel,
                    meta
                })}
            </Grid>
            <Grid item>
                {/* $FlowFixMe */}
                {renderTimeField({
                    input: {
                        ...input,
                        onChange: newTime => {
                            const time = moment(newTime);
                            const date = moment(input.value);

                            input.onChange(
                                (moment.isMoment(date) ? date : moment())
                                    .hour(time.hour())
                                    .minute(time.minute())
                                    .second(0)
                                    .millisecond(0)
                                    .toISOString()
                            );
                        }
                    },
                    label: timeLabel,
                    meta
                })}
            </Grid>
            {/* $FlowFixMe */}
            {renderHiddenField({ input })}
        </Grid>
    );
};

export const renderButtonToggle = (
    props: Field & { stateTrue: React.Node, stateFalse: React.Node }
) => (
    <Tooltip title={props.label} aria-label="visible" placement="top">
        <IconButton
            aria-label="toggle password visibility"
            onClick={() => props.input.onChange(!props.input.value)}
            onMouseDown={e => {
                e.preventDefault();
            }}
            edge="end"
        >
            {props.input.value ? props.stateTrue : props.stateFalse}
        </IconButton>
    </Tooltip>
);
