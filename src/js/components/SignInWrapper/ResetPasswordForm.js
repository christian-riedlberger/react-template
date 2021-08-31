// @flow
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { injectIntl, intlShape } from 'react-intl';

import PasswordStrength from 'components/PasswordStrength';
import { calculateStrength } from 'utils/people';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    serverMessage: string,
    onSubmit: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        '& .logo': {
            textAlign: 'center',
            marginBottom: '2em'
        },
        '& .logo img': {
            marginBottom: '1em'
        },
        '& .line': {
            background: 'url(/css/img/report/icons/color-line.svg)',
            width: '8.5em',
            height: '3px',
            borderRadius: '21px',
            margin: '0 auto'
        },
        '& .MuiFormControl-root': {
            display: 'block',
            margin: '1.5em 0'
        },
        '& p': {
            color: '#8C8F94',
            textAlign: 'center'
        },
        '& a': {
            color: '#439cc8'
        }
    },
    form: {
        padding: '2em',
        '& .alert': {
            background: '#eb5454',
            color: '#FFFFFF',
            padding: '.5em 1em',
            borderRadius: '3px'
        },
        '& .info': {
            background: '#0499c7',
            color: '#FFFFFF',
            padding: '.5em 1em',
            borderRadius: '3px'
        },
        '& .MuiFormLabel-root.Mui-focused': {
            color: '#04b164'
        },
        '& .MuiInput-underline:after': {
            borderColor: '#04b164'
        },
        '& .password-strength': {
            marginTop: '.5em'
        }
    },
    buttonContainer: {
        marginTop: '3.5em'
    },
    button: {
        backgroundColor: '#04c770',
        padding: '1em',
        color: '#FFFFFF',
        fontSize: '1em',
        letterSpacing: '1px',
        'text-transform': 'initial'
    }
});

const ResetPasswordForm = ({ onSubmit, serverMessage, intl }: Props) => {
    const classes = useStyles();

    const [values, setValues] = React.useState({
        username: localStorage.getItem('auth:reset-username')
            ? localStorage.getItem('auth:reset-username')
            : '',
        password: '',
        showPassword: false,
        reset: false
    });

    const handleChange = (prop: string) => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const onReset = () => {
        onSubmit({ ...values });
    };

    if (serverMessage === 'success') {
        return (
            <form
                className={classes.root}
                onSubmit={e => {
                    onReset();
                    e.preventDefault();
                }}
            >
                <div className="logo">
                    <img
                        src="/css/img/brand/logo-large.png"
                        width="230"
                        alt="Greenfence"
                    />
                </div>
                <p>
                    <br />
                </p>

                <div className={classes.form}>
                    <div className="info">
                        <div>
                            {intl.formatMessage(
                                messages.signingPasswordWasResetMessage
                            )}
                        </div>
                    </div>

                    <div
                        className={classes.buttonContainer}
                        onClick={() => {
                            window.location = '/';
                        }}
                    >
                        <Button className={classes.button} fullWidth>
                            {intl.formatMessage(
                                messages.signingClickHereLoginMessage
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <form
            className={classes.root}
            onSubmit={e => {
                onReset();
                e.preventDefault();
            }}
        >
            <div className="logo">
                <img
                    src="/css/img/brand/logo-large.png"
                    width="230"
                    alt="Greenfence"
                />
            </div>
            <p>
                {intl.formatMessage(
                    messages.signingConfirmUsernamePasswordMessage
                )}
                <br />
            </p>

            <div className={classes.form}>
                {serverMessage && (
                    <div className="alert">
                        <div>{serverMessage}</div>
                    </div>
                )}

                <TextField
                    id="username"
                    label="Username"
                    autoComplete="off"
                    className={classes.textField}
                    value={values.username}
                    onChange={handleChange('username')}
                    onKeyPress={ev => {
                        if (ev.key === 'Enter') {
                            onReset();
                            ev.preventDefault();
                        }
                    }}
                    margin="normal"
                    fullWidth
                />

                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                >
                    <InputLabel htmlFor="adornment-password">
                        {intl.formatMessage(messages.signingPassword)}
                    </InputLabel>
                    <Input
                        id="adornment-password"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        onKeyPress={ev => {
                            if (ev.key === 'Enter') {
                                onReset();
                                ev.preventDefault();
                            }
                        }}
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <PasswordStrength
                        strength={calculateStrength(values.password)}
                    />
                </FormControl>

                <div
                    className={classes.buttonContainer}
                    onClick={() => {
                        onReset();
                    }}
                >
                    <Button className={classes.button} fullWidth>
                        {intl.formatMessage(
                            messages.signingResetPasswordMessage
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default injectIntl(ResetPasswordForm);
