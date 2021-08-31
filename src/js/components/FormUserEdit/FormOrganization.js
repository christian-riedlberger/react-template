// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { Field } from 'redux-form';
import _ from 'lodash';

import FieldAuthoritySelector from 'components/FieldAuthoritySelector';
import CollapsableLine from 'components/CollapsableLine';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape,
    initialValues?: Object
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const FormOrganization = (props: Props) => {
    const { initialValues, intl } = props;
    const classes = useStyles();

    return (
        <CollapsableLine
            isOpen
            nullOnHidden={false}
            classes={classes}
            title={intl.formatMessage(messages.organizationLabel)}
        >
            <Grid item xl={12} md={12} sm={12} xs={12}>
                <Field
                    fullWidth
                    multiple
                    disabled
                    name="organizations"
                    defaultAuthorities={_.get(
                        initialValues,
                        'organizations',
                        null
                    )}
                    type="group"
                    parentName="ORGANIZATIONS"
                    label={intl.formatMessage(messages.organization)}
                    component={FieldAuthoritySelector}
                />
            </Grid>
        </CollapsableLine>
    );
};

export default injectIntl(FormOrganization);
