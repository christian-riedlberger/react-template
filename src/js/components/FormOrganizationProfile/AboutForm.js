// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';
import Field from 'components/Field';
import { renderTextFieldVisibility } from 'constants/FormFields';

type DefaultProps = {
    intl: intlShape
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    card: {
        width: '100%',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '2em'
    },
    header: {
        fontWeight: '400!important',
        fontSize: '15px!important'
    },
    title: {
        '& .org-avatar': {
            padding: '2em'
        }
    }
});

const AboutForm = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <CollapsableLine
            classes={classes}
            title={intl.formatMessage(messages.about)}
            isOpen
        >
            <Grid container item direction="row" spacing={2}>
                <Grid item xs={10}>
                    <Field
                        name="tag"
                        label={intl.formatMessage(messages.tag)}
                        component={renderTextFieldVisibility}
                        fullWidth
                    />
                    <Field
                        name="about"
                        label={intl.formatMessage(messages.about)}
                        component={renderTextFieldVisibility}
                        multiline
                        fullWidth
                        rows={5}
                    />
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(AboutForm);
