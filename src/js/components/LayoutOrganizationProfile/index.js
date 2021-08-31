// @flow
import * as React from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { Link } from 'react-router';
import GroupsContainer from 'containers/GroupsContainer';
import type { ContainerProps as GroupProps } from 'containers/GroupsContainer';
import Header from 'components/Header';
import Button from 'components/Button';
import UserContainer from 'containers/UserContainer';
import type { ContainerProps as UsersProps } from 'containers/UserContainer';
import type { Organization } from 'types/groupTypes';

import Banner from './Banner';
import About from './About';
import Contact from './Contact';
import Map from './Map';

type DefaultProps = {
    intl: intlShape
} & UsersProps &
    GroupProps;

type Props = {
    activeGroup: Object,
    orgId: string
} & DefaultProps;

const useStyles = makeStyles({
    editBar: {
        borderBottom: '1px solid #e9e9e9',
        margin: '-1.5em -2em 1em -2em',
        padding: '1em 1.5em'
    }
});

const LayoutOrganizationProfile = (props: Props) => {
    const { activeGroup, orgId, activeOrg } = props;
    const classes = useStyles();

    if (!activeGroup) return null;

    const {
        shortName,
        twitter,
        facebook,
        linkedin,
        phone,
        email,
        phoneVisible,
        emailVisible,
        twitterVisible,
        linkedinVisible,
        facebookVisible
    } = (activeGroup: Organization); // typecast

    /**
     * @author bvincent1
     * show section bawsed off
     *  - is visibility avaialable && is a boolean
     *  - opts are present
     */
    const show = (
        showOpt?: boolean,
        opts: Array<?boolean | ?string>
    ): boolean =>
        _.isBoolean(showOpt)
            ? !!showOpt && _.every(opts)
            : _.every(_.map(opts, Boolean));

    const showMeSection =
        show(twitterVisible, [twitter]) ||
        show(facebookVisible, [facebook]) ||
        show(linkedinVisible, [linkedin]) ||
        show(phoneVisible, [phone]) ||
        show(emailVisible, [email]);
    return (
        <div>
            <Header bordered />

            {activeOrg.userIsAdmin && activeOrg.shortName === shortName && (
                <div className={classes.editBar}>
                    <Link to={`/organizations/edit/${orgId}`}>
                        <Button size="medium" text="edit" />
                    </Link>
                </div>
            )}

            <div style={{ maxWidth: 700 }}>
                <Banner organization={activeGroup} />
                <About {...activeGroup} show={show} />
                <Contact
                    {...activeGroup}
                    showMeSection={showMeSection}
                    show={show}
                />

                <Map {...activeGroup} />
            </div>
        </div>
    );
};

export default compose(
    GroupsContainer({ shortName: props => props.orgId }),
    UserContainer({}),
    injectIntl
)(LayoutOrganizationProfile);
