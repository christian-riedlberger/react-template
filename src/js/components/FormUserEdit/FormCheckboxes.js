// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import { renderCheckbox } from 'constants/FormFields';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FormCheckboxes = ({ intl }: Props) => {
    const classes = useStyles();

    return (
        <CollapsableLine
            isOpen
            nullOnHidden={false}
            classes={{ ...classes, title: 'cypress-employeesSection' }}
            title={intl.formatMessage(messages.employeesSection)}
        >
            <Grid container spacing={4}>
                {/* <Grid item>
                    <Field
                        component={renderCheckbox}
                        name="enabled"
                        label={intl.formatMessage(messages.usersEnabledLabel)}
                    />
                </Grid> */}
                <Grid item>
                    <Field
                        component={renderCheckbox}
                        name="isExternal"
                        label={intl.formatMessage(messages.usersExternalLabel)}
                    />
                </Grid>
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(FormCheckboxes);
