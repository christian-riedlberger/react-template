// @flow
import React, { Fragment } from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { reduxForm, Form } from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import moment from 'moment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import messages from 'constants/Messages';
import { initFromQuery, getFormValues } from 'utils/form';
import Button from 'components/Button';
import * as theme from 'constants/Theme';
import type { StepperProps } from 'components/WizardStepper';

type DefaultProps = {
    intl: intlShape,
    handleSubmit: Function,
    forms: Object
} & StepperProps;

type Props = {
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles(() => ({
    root: {},
    formBar: {
        display: 'flex',
        border: `1px solid ${theme.hue4}`,
        borderRadius: '10em',
        padding: '.5em'
    },
    circle: {
        width: '1.75em',
        height: '1.75em',
        fontWeight: 400,
        color: 'white',
        backgroundColor: theme.green,
        borderRadius: '10em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    trackTitle: {
        flexGrow: 1,
        color: theme.hue5,
        fontSize: '1.2em',
        fontWeight: 500,
        marginLeft: '1em',
        display: 'flex',
        alignItems: 'center'
    },
    label: {
        color: '#8E8E8E'
    },
    value: {
        color: '#403C3C'
    },
    list: {
        padding: 0,
        margin: 0
    },
    editButton: { display: 'flex', alignItems: 'stretch' }
}));

/**
 * Form for request basic details
 * Used in create request wizard and request table actions
 * @param {*} props
 */
const FormRequestReview = (props: Props) => {
    const {
        intl,
        handleSubmit,
        onSubmit,
        nav,
        setActiveNav,
        forms,
        isSubmitting
    } = props;
    const classes = useStyles();

    const handleClick = (index: number) => {
        if (isSubmitting) return null;
        setActiveNav(index);
    };

    const translate = key =>
        messages[key] ? intl.formatMessage(messages[key]) : `intl: ${key}`;

    const translateValue = value => {
        if (_.isDate(value)) {
            return moment(value).format('YYYY/MM/DD');
        }

        // test for documents form
        if (_.isObject(value) && value.uploadedFiles && value.selectedFiles) {
            const docs = _.concat(value.selectedFiles, value.uploadedFiles);
            return (
                <List className={classes.list}>
                    {_.map(docs, doc => (
                        <ListItem>
                            <ListItemText primary={doc.name} />
                        </ListItem>
                    ))}
                </List>
            );
        }

        if (_.isString(value) && messages[value]) {
            return intl.formatMessage(messages[value]);
        }

        return value.toString();
    };

    return (
        <Form
            className={classes.root}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <Grid container spacing={8} direction="column">
                <Grid item>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        {intl.formatMessage(messages.sendFinal)}
                    </Typography>
                </Grid>
                <Grid container item direction="column">
                    {_.map(
                        nav.slice(0, -1),
                        ({ trackLabel, formName }, index) => (
                            <Fragment>
                                <div
                                    className={classes.formBar}
                                    key={`review-${formName}`}
                                >
                                    <div className={classes.circle}>
                                        <div>{index + 1}</div>
                                    </div>

                                    <div className={classes.trackTitle}>
                                        {translate(trackLabel)}
                                    </div>

                                    <div className={classes.editButton}>
                                        <Button
                                            round
                                            disabled={isSubmitting}
                                            size="small"
                                            text="edit"
                                            color="grey0"
                                            onClick={() => handleClick(index)}
                                        />
                                    </div>
                                </div>
                                <Grid
                                    item
                                    container
                                    xs={12}
                                    alignItems="left"
                                    direction="column"
                                    style={{
                                        paddingLeft: '4em',
                                        paddingTop: '2em',
                                        paddingBottom: '2em'
                                    }}
                                >
                                    {_.map(
                                        getFormValues(forms[formName]),
                                        (value, key) => (
                                            <Grid
                                                item
                                                xs={10}
                                                container
                                                direction="row"
                                            >
                                                <Grid item xs={2}>
                                                    <Typography
                                                        className={
                                                            classes.label
                                                        }
                                                    >
                                                        {translate(key)}:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    <Typography
                                                        className={
                                                            classes.value
                                                        }
                                                    >
                                                        {translateValue(value)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )
                                    )}
                                </Grid>
                            </Fragment>
                        )
                    )}
                </Grid>
            </Grid>
        </Form>
    );
};

/**
 * Define the form definition
 * Includes:
 * default values
 * dependency injection
 */
export const FormName = 'requestCertificationReview';
export default compose(
    initFromQuery(),
    reduxForm({
        form: FormName,
        enableReinitialize: true
    }),
    injectIntl,
    // $FlowFixMe
    connect(state => ({ forms: state.form }))
)(FormRequestReview);
