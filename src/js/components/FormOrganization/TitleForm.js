// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import messages from 'constants/Messages';

import { renderTextField } from 'constants/FormFields';
import FieldAvatarUpload from 'components/FieldAvatarUpload';
import FieldRow from 'components/FieldRow';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    change: Function,
    className?: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {},
    avatar: {}
});

const DetailForm = (props: Props) => {
    const { intl, change, className } = props;
    const classes = useStyles();

    return (
        <div className={className}>
            <input
                type="text"
                id="auto-complete-fix"
                style={{
                    position: 'fixed',
                    top: '-100px',
                    left: '-100px',
                    width: '5px'
                }}
            />
            <div className="org-avatar" style={{ paddingBottom: '1em' }}>
                <Field
                    name="avatar"
                    component={FieldAvatarUpload}
                    change={change}
                    required
                    helperText=""
                    label={intl.formatMessage(messages.avatar)}
                />
            </div>

            <FieldRow>
                <Field
                    type="text"
                    name="displayName"
                    fullWidth
                    required
                    autoFocus
                    helperText=""
                    autoComplete="new-password"
                    component={renderTextField}
                    label={intl.formatMessage(messages.name)}
                    className={classes.field}
                />
            </FieldRow>
        </div>
    );
};

export default injectIntl(DetailForm);
