// @flow
import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { mapProps, compose } from 'recompose';
import { reduxForm, Form } from 'redux-form';
import { withRouter } from 'react-router';
import { textblack } from 'constants/Theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isEmail, isURL } from 'validator';

import Card from 'components/Card';
import GroupsContainer from 'containers/GroupsContainer';
import type { ContainerProps as GroupProps } from 'containers/GroupsContainer';

import type { FormProps } from 'types/formTypes';
import Button from 'components/Button';
import MessageContainer from 'containers/MessageContainer';
import type { ContainerProps as MessageProps } from 'containers/MessageContainer';

import BannerForm from './BannerForm';
import AboutForm from './AboutForm';
import ContactForm from './ContactForm';

type DefaultProps = {} & FormProps &
    GroupProps &
    MessageProps & {
        router: Object
    };

type Props = {
    orgId: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        '& .MuiFormControl-root': {
            padding: '0.7em'
        },
        '& .MuiInputLabel-formControl': {
            padding: '0.7em'
        },
        '& .customTitle': {
            color: textblack,
            fontSize: '1.1em',
            fontWeight: 500
        },
        '& .customCollapseBody': {
            padding: '0',
            margin: '0 -1em'
        },
        '& .customCollapse': {
            paddingRight: '2em'
        },
        '& .org-avatar': {
            paddingTop: '0!important'
        },
        '& .upload-file-button': {
            position: 'relative',
            top: '14px',
            left: '6px'
        }
    },
    card: {
        width: '100%',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        marginBottom: '2em'
    },
    editBar: {
        borderBottom: '1px solid #e9e9e9',
        margin: '-1.5em -2em 1em -2em',
        padding: '1em 1.5em'
    }
});

const validate = values => {
    const errors = {};
    // form hasn't initialized yet
    if (!values) return errors;

    if (_.isEmpty(values.displayName)) errors.displayName = 'required';
    if (values.twitter && !isURL(values.twitter)) errors.twitter = 'invalidUrl';
    if (values.linkedin && !isURL(values.linkedin))
        errors.linkedin = 'invalidUrl';
    if (values.facebook && !isURL(values.facebook))
        errors.facebook = 'invalidUrl';
    if (values.email && !isEmail(values.email)) errors.email = 'invalidEmail';

    return errors;
};

const FormOrganizationProfile = (props: Props) => {
    const {
        orgId,
        handleSubmit,
        saveGroup,
        showMessage,
        router,
        uploadAvatar,
        activeGroupIsLoading
    } = props;
    const classes = useStyles();
    const URL = `/organizations/profile/${orgId}`;

    const onSubmit = values => {
        showMessage({ message: 'groupSaving', variant: 'pending' });
        saveGroup(values)
            .then(() => {
                if (values.avatar)
                    return uploadAvatar(values.avatar, values.displayName);
                return null;
            })
            .then(() => {
                showMessage({
                    message: 'messageProfileSucess',
                    variant: 'success'
                });
                setTimeout(() => {
                    router.push(URL);
                }, 750);
                return null;
            })
            .catch(e => {
                showMessage({
                    message: 'messageProfileError',
                    variant: 'error',
                    info: e
                });
            });
    };

    const onCancel = () => {
        router.push(URL);
    };

    if (activeGroupIsLoading)
        return (
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Card className={classes.card}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <CircularProgress />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        );

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.editBar}>
                <Button text="save" size="medium" type="submit" />
                <Button
                    text="cancel"
                    size="medium"
                    color="grey0"
                    onClick={onCancel}
                />
            </div>

            <div className={classes.root}>
                <Grid container className={classes.root}>
                    <Grid item xs={6}>
                        <BannerForm {...props} />
                    </Grid>

                    <Grid item xs={6}>
                        <ContactForm {...props} />
                        <AboutForm {...props} />
                    </Grid>
                </Grid>
            </div>
        </Form>
    );
};

export const FormName = 'organizationProfile';
export default compose(
    GroupsContainer({ shortName: props => props.orgId }),
    MessageContainer(),
    withRouter,
    mapProps(props => {
        return {
            ...props,
            initialValues: props.activeGroup
        };
    }),
    reduxForm({
        form: FormName,
        validate,
        enableReinitialize: true
    })
)(FormOrganizationProfile);
