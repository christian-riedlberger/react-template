// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';

import CheckboxGroup from 'components/CheckboxGroup';

type DefaultProps = {};

type Props = {
    roles: Array<Object>,
    onChangeRole: Function
} & DefaultProps;

const useStyles = makeStyles({
    permissonForm: {}
});

const PermissionForm = (props: Props) => {
    const { roles, onChangeRole } = props;
    const classes = useStyles();

    return (
        <div className={classes.permissonForm}>
            <CheckboxGroup boxes={roles} onToggle={onChangeRole} />
        </div>
    );
};

export default injectIntl(PermissionForm);
