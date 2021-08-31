// @flow
import _ from 'lodash';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router';

import messages from 'constants/Messages';
import BreadCrumbHeader from 'components/BreadCrumbHeader';
import HeaderProfile from 'components/HeaderProfile';
import SearchbarCategories from 'components/SearchbarCategories';
import {
    MAIN_MENU_LINKS,
    ENABLE_HEADER_LINKS,
    SEARCH_CATEGORIES
} from 'constants/Config';
import HeaderLinks from 'components/HeaderLinks';

type DefaultProps = {
    intl: intlShape,
    router: Object
};
type Props = {
    page: string,
    enableSearchbar: boolean,
    disableBreadcrumb: boolean,
    // eslint-disable-next-line react/no-unused-prop-types
    bordered: boolean
} & DefaultProps;

// Custom CSS Classes
const useStyles = makeStyles({
    header: (props: Props) => {
        const borderedStyle = props.bordered
            ? {
                borderBottom: '1px solid #E8E8E8',
                margin: '-1em -2.2em 1.5em -2.2em',
                padding: '1em 2.2em .5em 2.2em',
                marginBottom: '1.5em'
            }
            : {};

        return {
            textAlign: 'right',
            ...borderedStyle
        };
    }
});

/**
 * Definition of a Pie chart
 * @param {*} param0
 */
const Header = (props: Props) => {
    const { intl, router, disableBreadcrumb, enableSearchbar, page } = props;
    const classes = useStyles(props);
    const pageLinks = _.find(MAIN_MENU_LINKS, { title: page });
    const path = [
        { title: intl.formatMessage(messages.home), link: '/', href: '/' }
    ];

    if (pageLinks) {
        path.push({
            title: pageLinks.title,
            link: pageLinks.link,
            href: `/${pageLinks.link}`
        });

        if (pageLinks.children) {
            const receivedLink = _.find(pageLinks.children, {
                link: router.location.pathname.slice(1)
            });
            if (receivedLink) {
                path.push({
                    link: receivedLink.link,
                    title: messages[receivedLink.title]
                        ? intl.formatMessage(messages[receivedLink.title])
                        : receivedLink.title,
                    href: `/${receivedLink.link}`
                });
            } else {
                path.push({
                    title: _.last(router.location.pathname.split('/'))
                });
            }
        }
    }

    return (
        <div className={classes.header}>
            {enableSearchbar && (
                <div
                    style={{
                        position: 'absolute',
                        top: '1em',
                        left: '1em',
                        zIndex: 1
                    }}
                >
                    <SearchbarCategories
                        categories={SEARCH_CATEGORIES}
                        category={SEARCH_CATEGORIES[0]}
                        onSearch={() => {}}
                        placeholder="placeholderSearchDocument"
                        size="small"
                        round
                    />
                </div>
            )}
            {!disableBreadcrumb && <BreadCrumbHeader path={path} />}
            {ENABLE_HEADER_LINKS && <HeaderLinks />}
            <HeaderProfile />
        </div>
    );
};

export default withRouter(injectIntl(Header));
