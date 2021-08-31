// @flow
import React, { Fragment } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import CircleOutlineIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckIcon from '@material-ui/icons/Check';

import * as theme from 'constants/Theme';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type StepType = {
    label: string,
    status: string,
    key: string,
    error?: string
};

type Props = {
    steps: Array<StepType>
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        backgroundColor: 'white',

        '& .MuiStepConnector-vertical': {
            padding: 0
        },
        '& .MuiStepLabel-label.MuiStepLabel-completed, & .MuiStepLabel-label.MuiStepLabel-active': {
            fontWeight: 400
        },
        '& h6': {
            fontSize: '1.25em!important'
        },
        '& .MuiStepper-root': {
            paddingTop: 0
        }
    },
    steps: {
        '& span::first-letter': {
            textTransform: 'uppercase'
        },
        '& p': {
            color: theme.grey2
        }
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
        paddingLeft: '2em'
    },
    stepPaging: {
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'center',
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

const StepConnectorCustom = withStyles({
    line: {
        borderColor: theme.grey0,
        borderTopWidth: 3,
        borderRadius: 1,
        borderLeftWidth: 2,
        marginLeft: 9
    }
})(StepConnector);

const ICON_SIZE = 45;
const ICON_LEFT = -27;
const useIconStyle = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    checked: {
        color: theme.green,
        width: 25,
        height: 25,
        position: 'absolute',
        left: 10,
        top: 9
    },
    filled: {
        color: theme.grey0,
        width: ICON_SIZE,
        height: ICON_SIZE
    },
    filledGreen: {
        color: theme.green,
        width: ICON_SIZE,
        height: ICON_SIZE
    },
    active: {
        color: theme.grey1,
        width: ICON_SIZE,
        height: ICON_SIZE
    },
    iconTextActive: {
        position: 'relative',
        top: 15,
        left: ICON_LEFT,
        fontWeight: 400
    },
    iconText: {
        position: 'relative',
        left: ICON_LEFT,
        fontWeight: 400
    }
});

/**
 * Format label for internationalization
 * @param {*} label
 */
const formatLabel = (label: string) => {
    const test = label.split(':');
    return test[0] + test[1].charAt(0).toUpperCase() + test[1].slice(1);
};

/**
 * Step Icon
 * @param {*} props
 */
const StepIcon = (props: {
    active: boolean,
    completed: boolean,
    icon: number
}) => {
    const classes = useIconStyle();
    const { active, completed, icon } = props;

    if (active)
        return (
            <Fragment>
                <CircleOutlineIcon className={classes.active} />
                <div className={classes.iconTextActive}>{icon}</div>
            </Fragment>
        );

    return (
        <div className={classes.root}>
            {completed ? (
                <div style={{ position: 'relative', paddingRight: 7 }}>
                    <Fragment>
                        <CircleOutlineIcon className={classes.filledGreen} />
                        <CheckIcon className={classes.checked} />
                    </Fragment>
                </div>
            ) : (
                <Fragment>
                    <CircleOutlineIcon className={classes.filled} />
                    <div className={classes.iconText}>{icon}</div>
                </Fragment>
            )}
        </div>
    );
};

const ProcessOverview = (props: Props) => {
    const { steps, intl } = props;
    const classes = useStyles();

    const [activeNav, setActiveNav] = React.useState(0);

    React.useEffect(() => {
        setActiveNav(
            _.findIndex(steps, {
                active: true
            })
        );
    }, [steps]);

    /**
     * Render navigation steps
     */
    const renderSteps = () => {
        return _.map(steps, (step, index) => {
            return (
                <Step
                    key={`${step.label}-${index}`}
                    className={classes.steps}
                    completed={step.completed}
                >
                    <StepLabel StepIconComponent={StepIcon}>
                        {_.isString(step.label) &&
                        messages[formatLabel(step.label)]
                            ? intl.formatMessage(
                                messages[formatLabel(step.label)]
                            )
                            : step.label}
                        {/* <Typography variant="body1">
                            {messages[step.status]
                                ? intl.formatMessage(messages[step.status])
                                : step.status}
                        </Typography> */}
                    </StepLabel>
                </Step>
            );
        });
    };

    return (
        <div className={classes.root}>
            <div className={classes.stepper}>
                <Typography variant="subtitle1" component="h6">
                    {intl.formatMessage(messages.processOverview)}
                </Typography>
            </div>
            <Stepper
                orientation="vertical"
                connector={<StepConnectorCustom />}
                activeStep={activeNav}
                className={classes.stepper}
            >
                {renderSteps()}
            </Stepper>
        </div>
    );
};

export default injectIntl(ProcessOverview);
