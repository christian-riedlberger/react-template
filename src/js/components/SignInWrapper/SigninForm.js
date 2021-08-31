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

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    serverMessage: string,
    onSubmit: Function,
    onReset: Function
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
            color: '#439cc8',
            cursor: 'pointer'
        }
    },
    form: {
        width: '270px',
        padding: '2em',
        '& .alert': {
            background: '#eb5454',
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
        '& .MuiInputLabel-formControl': {
            letterSpacing: '0.07em'
        }
    },
    welcomeMessage: {
        '& p': {
            margin: '.25em 0'
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
    },
    disclaimer: {
        '& p': {
            fontSize: '12px',
            width: '220px',
            textAlign: 'center',
            margin: '0 auto',
            marginTop: '2em',
            color: '#b1b0b0'
        },
        '& a': {
            margin: '0 3px',
            color: '#909090',
            textDecoration: 'underline'
        }
    },
    footer: {
        position: 'absolute',
        bottom: '1em',
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '12px'
    },
    forgotLink: {
        textAlign: 'center',
        marginTop: '2em',
        display: 'block'
    }
});

const SigninForm = ({ onSubmit, onReset, serverMessage, intl }: Props) => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: '',
        password: '',
        showPassword: false
    });

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const handleReset = () => {
        onReset();
    };

    const onSignIn = () => {
        onSubmit({ ...values });
    };

    return (
        <form
            className={classes.root}
            onSubmit={e => {
                onSignIn();
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

            <div className={classes.welcomeMessage}>
                <p>{intl.formatMessage(messages.welcomeBack)}</p>
                <p>{intl.formatMessage(messages.signInBelow)}</p>
            </div>

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
                            onSignIn();
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
                                onSignIn();
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
                </FormControl>

                <div
                    className={classes.buttonContainer}
                    onClick={() => {
                        onSignIn();
                    }}
                >
                    <Button className={classes.button} fullWidth>
                        {intl.formatMessage(messages.signIn)}
                    </Button>
                </div>

                <a onClick={handleReset} className={classes.forgotLink}>
                    {intl.formatMessage(messages.forgotPassword)}
                </a>

                <div className={classes.disclaimer}>
                    <p>
                        {intl.formatMessage(messages.disclaimer)}
                        <a
                            href="https://origin.greenfence.com/terms-of-use/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {intl.formatMessage(messages.termsOfUse)}
                        </a>
                        {intl.formatMessage(messages.and)}
                        <a
                            href="https://origin.greenfence.com/privacy-policy/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {intl.formatMessage(messages.privacyPolicy)}
                        </a>
                    </p>
                </div>

                <div className={classes.footer}>
                    <p>&copy; {intl.formatMessage(messages.copyWrite)}</p>
                </div>
            </div>
        </form>
    );
};

export default injectIntl(SigninForm);
