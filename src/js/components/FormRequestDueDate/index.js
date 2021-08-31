// @flow
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { Field, reduxForm, Form } from 'redux-form';
import moment from 'moment-timezone';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import FieldRow from 'components/FieldRow';
import FieldDatePicker from 'components/FieldDatePicker';
import FieldTimezone from 'components/FieldTimezone';

import messages from 'constants/Messages';
import {
    renderCheckbox,
    renderTimeField,
    renderHiddenField
} from 'constants/FormFields';
import { grey0 } from 'constants/Theme';

import { errorMessages } from 'utils/errorMessages';
import { initFromQuery, renderFormErrorMessage } from 'utils/form';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function,
    handleSubmit: Function,
    formFields: Object,
    errors: Object,
    change: Function
};

type Props = {
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        color: theme.palette.primary.dark
    },
    field: {
        '& label::first-letter': {
            textTransform: 'uppercase'
        },
        width: 200,
        display: 'block'
    },
    dense: {
        marginTop: '2em'
    },
    label: {
        display: 'flex'
    },
    message: {
        width: '4em',
        height: '2em',
        margin: 'auto',
        paddingTop: 3
    },
    urgent: {
        display: 'flex',
        color: theme.palette.error.dark,
        height: '2em',
        width: '5.3em',
        '& .MuiSvgIcon-root': {
            width: 15,
            height: 15,
            margin: 'auto'
        },
        backgroundColor: grey0,
        '& div': {
            margin: 'auto'
        }
    }
}));

/**
 * Form validation
 * @param {*} values
 */
const validate = (values: Object, props: Props) => {
    const errors = {};
    const { formFields } = props;
    const now = moment()
        .add(1, 'minute')
        .utc()
        .toISOString();
    if (formFields && formFields.dueDate) {
        let temp = formFields.dueDate;

        if (formFields.dueTime) {
            const dt = moment(formFields.dueTime, ['h:mm A']).format('HH:mm');

            temp = moment(temp)
                .set({
                    hour: moment(dt, 'HH:mm').get('hour'),
                    minute: moment(dt, 'HH:mm').get('minute')
                })
                .toISOString();
        }

        if (formFields.timezone) {
            temp = moment(temp)
                .tz(formFields.timezone, true)
                .utc()
                .format();
        }
        if (moment(temp).isBefore(now)) {
            errors.dueDate = 'beforeCurrentTime';
        }
    }

    return errorMessages(errors);
};

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestDueDate = ({
    intl,
    handleSubmit,
    onSubmit,
    dispatch,
    formFields,
    errors,
    change
}: Props) => {
    const [time, setTime] = useState('noon');
    const [localTime, setLocalTime] = useState(true);
    const classes = useStyles();

    useEffect(() => {
        if (formFields) {
            if (localTime && formFields.timezone) {
                dispatch(change('timezone', ''));
            }
            if (formFields.dueTime !== '12:00:PM' && time === 'noon') {
                dispatch(change('dueTime', '12:00:PM'));
            } else if (formFields.dueTime !== '12:59:PM' && time === 'end') {
                dispatch(change('dueTime', '11:59:PM'));
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time, localTime, formFields]);

    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Typography variant="h6" color="textSecondary" gutterBottom>
                {intl.formatMessage(messages.requestDueDate)}
            </Typography>
            {!_.isEmpty(errors) && renderFormErrorMessage(errors)}
            <Grid container spacing={1} direction="column">
                <Grid item>
                    <Field
                        disablePast
                        name="dueDate"
                        component={FieldDatePicker}
                        fullSize
                    />
                </Grid>
                <Grid item>
                    <Field
                        name="urgent"
                        label={
                            <div className={classes.label}>
                                <div className={classes.message}>
                                    {intl.formatMessage(messages.markAs)}
                                </div>
                                <div className={classes.urgent}>
                                    <AssignmentLateIcon />
                                    <div>
                                        {intl.formatMessage(messages.urgent)}
                                    </div>
                                </div>
                            </div>
                        }
                        component={renderCheckbox}
                    />
                </Grid>

                <Grid item>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={time === 'noon'}
                                    onChange={() => setTime('noon')}
                                    inputProps={{ 'data-cy': 'noon' }}
                                />
                            }
                            label={intl.formatMessage(messages.noon)}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={time === 'end'}
                                    onChange={() => setTime('end')}
                                    inputProps={{ 'data-cy': 'end' }}
                                />
                            }
                            label={intl.formatMessage(messages.endDay)}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={time === 'custom'}
                                    onChange={() => setTime('custom')}
                                    inputProps={{ 'data-cy': 'custom' }}
                                />
                            }
                            label={intl.formatMessage(messages.custom)}
                        />
                    </FormGroup>
                    <Field name="dueTime" component={renderHiddenField} />

                    {time === 'custom' && (
                        <FieldRow>
                            <Field name="dueTime" component={renderTimeField} />
                        </FieldRow>
                    )}
                </Grid>

                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={localTime}
                                onChange={() => setLocalTime(!localTime)}
                            />
                        }
                        label={intl.formatMessage(messages.localTime)}
                    />

                    {!localTime && (
                        <FieldRow>
                            <Field
                                name="timezone"
                                change={change}
                                component={FieldTimezone}
                                label={intl.formatMessage(messages.timezone)}
                            />
                        </FieldRow>
                    )}
                </Grid>
            </Grid>
        </Form>
    );
};

const mapStateToProps = state => ({
    formFields: _.get(state.form[FormName], 'values'),
    errors: _.get(state.form[FormName], 'syncErrors')
});

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'requestDueDate';
export default compose(
    // $FlowFixMe
    connect(mapStateToProps),
    initFromQuery(),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    }),
    injectIntl
)(FormRequestDueDate);
