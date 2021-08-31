import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';

type DefaultProps = {};

type Props = {
    intl: intlShape,
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
    infoForm: {
        padding: '.5em 11em',
        '& .info': {
            background: '#0499c7',
            color: '#FFFFFF',
            padding: '.5em 1em',
            borderRadius: '3px'
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

        '& .MuiFormLabel-root.Mui-focused': {
            color: '#04b164'
        },
        '& .MuiInput-underline:after': {
            borderColor: '#04b164'
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

const ResetUserForm = ({ onSubmit, serverMessage, intl }: Props) => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: '',
        isSent: false
    });

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const onReset = () => {
        onSubmit({ ...values });
        setValues({ ...values, isSent: true });
    };

    if (values.isSent) {
        return (
            <form className={classes.root}>
                <div className="logo">
                    <img
                        src="/css/img/brand/logo-large.png"
                        width="230"
                        alt="Greenfence"
                    />
                </div>
                <div className={classes.infoForm}>
                    <div className="info">
                        {intl.formatMessage(
                            messages.signingResetRequestedMessage
                        )}
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
                    messages.signingUsernamePasswordResetMessage
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
                    value={values.name}
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

export default injectIntl(ResetUserForm);
