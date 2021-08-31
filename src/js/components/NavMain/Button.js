// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import DocumentsIcon from '@material-ui/icons/FolderOpenOutlined';
import RequestsIcon from '@material-ui/icons/InboxOutlined';
import PeopleIcon from '@material-ui/icons/SupervisedUserCircleOutlined';
import OrganizationsIcon from '@material-ui/icons/BusinessOutlined';
import * as theme from 'constants/Theme';

const ICONS = {
    HomeIcon,
    DocumentsIcon,
    RequestsIcon,
    PeopleIcon,
    OrganizationsIcon
};

type DefaultProps = {};

type Props = {
    title: string,
    to: string,
    icon: string,
    isOpen: boolean,
    onOpen: Function
} & DefaultProps;

const styles = {
    link: {},
    title: {
        display: 'inline',
        fontSize: '1.1em',
        margin: 0,
        padding: 0,
        color: '#8C8C8C',
        fontWeight: 400,
        fontFamily: 'Roboto',
        marginLeft: '0.5em',
        opacity: 0
    },
    titleOpen: {
        opacity: 1
    }
};

/**
 * @container NavMain
 * @component Button
 * @desc Button for the main navgiation
 */
class Button extends Component<Props> {
    timeout: null;

    static contextTypes = {
        router: PropTypes.object
    };

    openMenu = () => {
        this.props.onOpen(true);
    };

    onMouseEnterHandler = () => {
        // $FlowFixMe
        this.timeout = setTimeout(() => {
            this.openMenu();
        }, 750);
    };

    onMouseClickHandler = () => {
        clearTimeout(this.timeout);
    };

    onMouseLeaveHandler = () => {
        clearTimeout(this.timeout);
    };

    renderIcon = (icon: string) => {
        const Icon = ICONS[icon];
        return (
            <span className="circle">
                <Icon style={{ color: theme.mainNavButtons }} />
            </span>
        );
    };

    render() {
        const { title, icon, to, isOpen } = this.props;
        const isActive = this.context.router.isActive(to, true);
        let className = isActive ? 'active' : '';
        className = isOpen ? `${className} open` : className;

        const openStyles = isOpen ? styles.titleOpen : {};
        return (
            <li>
                <Link
                    to={this.props.to}
                    class={className}
                    style={{ display: 'flex', alignItems: 'center' }}
                    onMouseEnter={this.onMouseEnterHandler}
                    onMouseLeave={this.onMouseLeaveHandler}
                    onClick={this.onMouseClickHandler}
                >
                    {this.renderIcon(icon)}

                    <h1
                        style={{
                            ...styles.title,
                            ...openStyles
                        }}
                    >
                        {title}
                    </h1>
                </Link>
            </li>
        );
    }
}

export default withStyles(styles)(Button);
