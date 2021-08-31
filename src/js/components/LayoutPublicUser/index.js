// @flow
import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import UserContainer from 'containers/UserContainer';
import type { ContainerProps as UserProps } from 'containers/UserContainer';

import { fetchUserInfo } from '../../actions/ActionUsers';
import Banner from './Banner';
import About from './About';
import Contact from './Contact';
import Social from './Social';

type DefaultProps = {} & UserProps;

type Props = {
    userName: string,
    editAllowed: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const LayoutPublicUser = (props: Props) => {
    const { userName } = props;
    const classes = useStyles();

    const [publicUser, setPublicUser] = useState(null);

    useEffect(() => {
        fetchUserInfo(userName, true)
            .then(resp => {
                setPublicUser(resp.data.data);
                return resp;
            })
            .catch(e => {
                throw e;
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!publicUser) return null;

    return (
        <div className={classes.root}>
            <div style={{ maxWidth: 700 }}>
                <Banner publicUser={publicUser} />
                <About publicUser={publicUser} />
                <Contact publicUser={publicUser} />
                <Social publicUser={publicUser} />
            </div>
        </div>
    );
};

export default compose(UserContainer({}))(LayoutPublicUser);
