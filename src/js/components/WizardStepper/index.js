// @flow
import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { submit, reset, destroy } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircleCheckedIcon from '@material-ui/icons/CheckCircle';
import CircleFilledIcon from '@material-ui/icons/FiberManualRecord';
import CircleOutlineIcon from '@material-ui/icons/RadioButtonUnchecked';
import StepConnector from '@material-ui/core/StepConnector';
import type { Node } from 'react';
import { compose } from 'recompose';
import clsx from 'clsx';

import ButtonLinear from 'components/ButtonLinear';
import messages from 'constants/Messages';
import { renderChildren } from 'utils/render';
import * as theme from 'constants/Theme';

type DefaultProps = {
    intl: intlShape,
    dispatch: Function,
    forms: Object,
    router: Object
};

type StepType = {
    formName: string, // @review remove button config and use form name instead
    formComponent: Function,
    trackLabel: string | Node,
    optional: boolean,
    error?: string
};

export type StepperProps = {
    setActiveNav: number => void,
    updateNav: (number, StepType) => void,
    activeNav: number,
    nav: Array<StepType>,
    nextNav: number | null,
    setNextNav: number => void,
    isSubmitting: boolean
};

type Props = {
    steps: Array<StepType>,
    onFinish: Function,
    hideTracks: boolean,
    hideNavigation: boolean,
    initialStep?: number,
    finishButtonLabel?: string,
    isSubmitting: boolean
} & DefaultProps;

// Custom CSS Classes
const useStyles = makeStyles({
    root: {
        backgroundColor: 'white',
        '& .MuiStep-completed, & .MuiStep-completed .Mui-disabled': {
            cursor: 'pointer!important'
        }
    },
    steps: {
        '& span::first-letter': {
            textTransform: 'uppercase'
        }
    },
    clickable: {
        cursor: 'pointer'
    },
    buttons: {
        '& .grey': {
            backgroundColor: theme.grey1,
            color: 'white'
        },
        '& .left': {
            float: 'left'
        },
        '& .right': {
            float: 'right'
        },
        '& .green': {
            float: 'right',
            backgroundColor: theme.green,
            color: 'white'
        }
    },
    stepper: {
        padding: '0'
    },
    stepPaging: {
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'right',
        '& h5': {
            marginBottom: '1.5em!important'
        },
        '& .index': {
            color: theme.green
        },
        '& .total': {
            color: theme.grey1
        },
        '& .info': {
            paddingTop: '0.1em',
            fontWeight: 500,
            fontSize: '1.1em'
        }
    },
    snackbar: {
        backgroundColor: theme.green,
        color: theme.white0
    }
});

const useIconStyle = makeStyles({
    root: {
        display: 'flex',
        height: 30,
        alignItems: 'center'
    },
    outline: {
        color: 'black',
        width: 18,
        height: 18,
        paddingLeft: 3
    },
    checked: {
        color: theme.green,
        width: 20,
        height: 20
    },
    filled: {
        color: theme.grey0,
        width: 20,
        height: 20
    }
});

const StepIcon = (props: { active: boolean, completed: boolean }) => {
    const classes = useIconStyle();
    const { active, completed } = props;

    if (active)
        return (
            <div className={classes.root}>
                <CircleOutlineIcon className={classes.outline} />
            </div>
        );

    return (
        <div className={classes.root}>
            {completed ? (
                <CircleCheckedIcon className={classes.checked} />
            ) : (
                <CircleFilledIcon className={classes.filled} />
            )}
        </div>
    );
};

const StepConnectorGreen = withStyles({
    active: {
        '& $line': {
            borderColor: theme.green
        }
    },
    completed: {
        '& $line': {
            borderColor: theme.green
        }
    },
    line: {
        borderColor: theme.grey0,
        borderTopWidth: 3,
        borderRadius: 1,
        borderLeftWidth: 2
    },
    vertical: {
        marginLeft: 9
    },
    isSubmitting: {
        marginBottom: 0
    }
})(StepConnector);

const WizardStepper = (props: Props) => {
    const {
        steps,
        intl,
        onFinish,
        dispatch,
        forms,
        initialStep,
        hideTracks,
        hideNavigation,
        router,
        finishButtonLabel,
        isSubmitting
    } = props;
    const classes = useStyles();

    /**
     * @state nav - stepper label and title props
     * @state activeNav - active step index
     */
    const [activeNav, setActiveNav] = useState(initialStep || 0);
    const [nav, setNav] = useState(
        _.map(steps, s => ({ ...s, completed: false }))
    );

    const updateNav = (index: number, newProps: Object) => {
        setNav(arr => _.set(arr, index, { ...arr[index], ...newProps }));
    };

    /**
     * @state nextNav - navigate to index after submitting current form
     */
    const [nextNav, setNextNav] = useState(null);

    /**
     * @state waitingOnValidate -
     * null -> notsubmitted yet
     * false -> done submit, should reset to null
     * true -> waiting on current submit
     */
    const [waitingOnValidate, setWaiting] = useState(null);

    const activeForm = _.get(forms, `${nav[activeNav].formName}`, {});

    const args: StepperProps = {
        setActiveNav,
        updateNav,
        activeNav,
        nav,
        onFinish: () => onFinish(nav, _.pick(forms, _.map(nav, 'formName'))),
        nextNav,
        setNextNav,
        isSubmitting
    };

    if (
        waitingOnValidate === false &&
        activeForm.submitSucceeded &&
        !activeForm.submitFailed
    ) {
        updateNav(activeNav, { completed: true });
        dispatch({
            type: '@@redux-form/CLEAR_SUBMIT',
            meta: { form: nav[activeNav].formName }
        });

        if (activeNav === steps.length - 1 && _.isNull(nextNav)) {
            // reset wizard progress
            dispatch(destroy(..._.map(nav, 'formName')));
            onFinish(args, _.pick(forms, _.map(nav, 'formName')));
        } else if (typeof nextNav === 'number') {
            setActiveNav(nextNav);
            setNextNav(null);
        } else {
            setActiveNav(i => i + 1);
        }
        setWaiting(null);
    }

    /**
     * handle form next & finish
     */
    const handleNext = () => {
        dispatch(submit(nav[activeNav].formName));
        setWaiting(false);
    };

    /**
     * handle form skip
     */
    const handleSkip = () => {
        dispatch(reset(nav[activeNav].formName));
        updateNav(activeNav, { completed: false });
        setActiveNav(i => i + 1);
    };

    /**
     * handle clicking the navigation steps. avoid changing steps is form isn't completed
     */
    const handleNavClick = (index: number, isCompleted: boolean) => {
        if (!isCompleted || isSubmitting) return null;

        setNextNav(index);
        handleNext();
    };

    /**
     * Render step bodies
     */
    const renderForms = () => {
        return _.map(steps, (step, index) => {
            return (
                <div
                    key={`form-${step.formName}`}
                    style={activeNav !== index ? { display: 'none' } : null}
                >
                    {renderChildren(step.formComponent, args)}
                </div>
            );
        });
    };

    /**
     * Render navigation steps
     */
    const renderSteps = () => {
        return _.map(steps, ({ formName, trackLabel }, index) => {
            const optional = nav[index].optional ? (
                <Typography variant="caption">
                    {intl.formatMessage(messages.optional)}
                </Typography>
            ) : null;

            return (
                <Step
                    key={`step-${formName}`}
                    className={clsx(
                        classes.steps,
                        !isSubmitting && classes.clickable
                    )}
                    completed={nav[index].completed}
                    onClick={() => handleNavClick(index, nav[index].completed)}
                >
                    <StepLabel optional={optional} StepIconComponent={StepIcon}>
                        {_.isString(trackLabel) && messages[trackLabel]
                            ? intl.formatMessage(messages[trackLabel])
                            : `intl: ${trackLabel}`}
                    </StepLabel>
                </Step>
            );
        });
    };

    /**
     *  Render button navigation for steppers
     *  (bottom next / previous)
     */
    const renderNavButtons = () => {
        const navConfig = {};
        const isDisabled = false;

        navConfig.backButton = {
            backText: 'back',
            onBack: () => {
                if (activeNav !== 0) {
                    setActiveNav(step => step - 1);
                } else {
                    router.goBack();
                }
            }
        };

        if (activeNav !== steps.length - 1 && nav[activeNav].optional) {
            navConfig.skipButton = {
                skipText: 'skip',
                onSkip: handleSkip,
                disabled: !nav[activeNav].optional || waitingOnValidate
            };
        }

        if (activeNav !== steps.length - 1) {
            navConfig.nextButton = {
                nextText: 'next',
                onNext: handleNext,
                disabled: waitingOnValidate, // Need to add
                loading: waitingOnValidate // Need to add <CircularProgress color="inherit" size={20} />
            };
        }

        if (activeNav === steps.length - 1) {
            navConfig.nextButton = {
                nextText: finishButtonLabel || 'finish',
                onNext: handleNext,
                disabled: isDisabled,
                loading: waitingOnValidate // Need to add <CircularProgress color="inherit" size={20} />
            };
        }

        return (
            <ButtonLinear
                {...navConfig.backButton}
                {...navConfig.skipButton}
                {...navConfig.nextButton}
                disabled={isDisabled || isSubmitting}
            />
        );
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={4}>
                {!hideTracks && (
                    <Grid item xs={3}>
                        <div className={classes.stepPaging}>
                            <Typography variant="h5">
                                {intl.formatMessage(messages.allStepsTitle)}
                            </Typography>

                            <div className="info">
                                <span className="index">{activeNav + 1}</span>
                                <span className="total">/{nav.length}</span>
                            </div>
                        </div>

                        <Stepper
                            orientation="vertical"
                            connector={<StepConnectorGreen />}
                            activeStep={activeNav}
                            className={classes.stepper}
                        >
                            {renderSteps()}
                        </Stepper>
                    </Grid>
                )}

                <Grid item container xs={hideTracks ? 12 : 8}>
                    <Grid item xs={12}>
                        {renderForms()}
                    </Grid>

                    {!hideNavigation && (
                        <Grid
                            item
                            container
                            direction="row"
                            justify={
                                activeNav !== 0 ? 'space-evenly' : 'flex-end'
                            }
                            alignItems="center"
                            xs={12}
                            className={classes.buttons}
                        >
                            {renderNavButtons()}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default compose(
    withRouter,
    // $FlowFixMe
    connect(state => ({ forms: state.form })),
    injectIntl
)(WizardStepper);
