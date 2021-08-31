// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { MAIN_MENU_LINKS, ADMIN_MENU_LINKS } from 'constants/Config';
import messages from 'constants/Messages';
import Button from './Button';

const NAV_WIDTH_CLOSED = 75;
const NAV_WIDTH_OPEN = 240;

type DefaultProps = {
    classes: Object
};

type Props = {
    access: Object,
    intl: intlShape
} & DefaultProps;

type State = {
    isOpen: boolean
};

type Menu = {
    link: string,
    title: string
};

const styles = {
    root: {},
    nav: {
        background: '#FFFFFF',
        width: NAV_WIDTH_CLOSED,

        '& #nav': {
            position: 'fixed',
            zIndex: '999!important',
            width: NAV_WIDTH_CLOSED,
            background: '#FFFFFF',
            borderRight: '1px solid #E5E6E9'
        }
    },
    navOpen: {
        background: '#FFFFFF',
        width: NAV_WIDTH_CLOSED,

        '& #nav': {
            zIndex: '999!important',
            width: NAV_WIDTH_OPEN,
            position: 'fixed',
            background: '#FFFFFF',
            borderRight: '1px solid #E5E6E9',
            boxShadow:
                '0 16px 10px 0 rgba(0,0,0,0.14), 0 11px 18px 0 rgba(0,0,0,0.12), 0 13px 5px -1px rgba(0,0,0,0.2)'
        }
    }
};

/**
 *  @package App
 *  @component NavMain
 *  @desc Main navigation
 *  @author: mike.priest
 */
class NavMain extends Component<Props, State> {
    timeout: null;

    state = {
        isOpen: false
    };

    /**
     *  Toggle menu open or closed
     */
    toggleMenu = (isOpen: boolean) => {
        this.setState({
            isOpen
        });
    };

    /**
     *  User closes menu
     */
    onMouseLeaveHandler = () => {
        // $FlowFixMe
        this.timeout = setTimeout(() => {
            this.toggleMenu(false);
        }, 500);
    };

    /**
     *  User opens menu
     */
    onMouseEnterHandler = () => {
        clearTimeout(this.timeout);
    };

    /**
     *  Render each nav item
     */
    renderNavigation = (links: Array<Menu>) => {
        const { intl, access } = this.props;
        const { isOpen } = this.state;

        return _.map(links, nav => {
            if (!nav.alwaysAccess && (nav.hideNav || !access[nav.title]))
                return;

            return (
                <Button
                    key={nav.link}
                    title={intl.formatMessage(messages[nav.title])}
                    icon={nav.icon}
                    isOpen={isOpen}
                    onOpen={this.toggleMenu}
                    to={`/${nav.link}`}
                    data-cy={nav.title}
                />
            );
        });
    };

    render() {
        const { classes } = this.props;
        const { isOpen } = this.state;
        const logoOpenStyle = isOpen ? { opacity: 1 } : { opacity: 0 };

        return (
            <div
                className={isOpen ? classes.navOpen : classes.nav}
                onMouseEnter={this.onMouseEnterHandler}
                onMouseLeave={this.onMouseLeaveHandler}
            >
                <div id="nav">
                    <a className="logo">
                        <img
                            alt="Greenfence"
                            src="/css/img/brand/logo.svg"
                            width="34"
                            height="35"
                        />
                        <img
                            className="logo-text"
                            style={logoOpenStyle}
                            alt="Greenfence"
                            src="/css/img/brand/logo-text.svg"
                        />
                    </a>
                    <ul>{this.renderNavigation(MAIN_MENU_LINKS)}</ul>

                    <ul className="nav-bottom">
                        {this.renderNavigation(ADMIN_MENU_LINKS)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(NavMain));
