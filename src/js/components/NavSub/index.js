// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';
import { Link } from 'react-router';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';

type DefaultProps = {
    classes: Object,
    intl: intlShape
};
type Props = {
    title: string,
    links: Array<Object>
} & DefaultProps;

type State = {
    isOpen: boolean
};

const styles = {
    root: {},
    subNav: {
        position: 'relative',
        background: '#f8f9fb',
        padding: '15px',
        transition: 'all 2s ease',

        '& .link-wrapper': {
            transition: 'all 2s ease'
        },
        '& .link-wrapper.hidden': { display: 'none' }
    },
    links: {
        width: 168,
        overflow: 'hidden',
        marginTop: '5.5em',
        padding: '.5em',
        '& h3': {
            fontSize: '1.7em',
            fontWeight: '300',
            marginBottom: '1em'
        },
        '& ul': { margin: 0, padding: 0 },
        '& ul li': { margin: 0, padding: 0, listStyle: 'none' },
        '& ul li a': {
            fontSize: '1.2em',
            color: '#737478',
            padding: '.5em 0',
            display: 'block',
            margin: '0.5em 0'
        },
        '& ul li a.active': {
            fontWeight: 400,
            color: '#404245'
        }
    },
    closeButton: {
        position: 'absolute',
        zIndex: 1,
        top: '7.2em',
        right: '-.75em',
        background: '#fff',
        display: 'inline-block',
        borderRadius: '5em',
        textAlign: 'center'
    },
    icon: {
        fontSize: '1.75rem',
        color: '#44bf78',
        position: 'relative',
        top: '2px',
        left: '2px'
    }
};

/**
 *  Component
 *  @desc
 *  @author
 */

class NavSub extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isOpen: true
        };
    }

    onToggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    renderLink = link => {
        const { intl } = this.props;
        let activeKlass = '';

        if (link.hideNav) return null;
        if (window.location.pathname.substr(1) === link.link)
            activeKlass = 'active';

        return (
            <li key={link.title}>
                <Link to={`/${link.link}`} className={activeKlass}>
                    {intl.formatMessage(messages[link.title])}
                </Link>
            </li>
        );
    };

    render() {
        const { title, links, intl, classes } = this.props;
        const { isOpen } = this.state;

        const openKlass = isOpen ? {} : { width: 15 };
        const openLinkKlass = isOpen ? '' : 'hidden';

        return (
            <div className={classes.subNav} style={openKlass}>
                <a
                    className={classes.closeButton}
                    onClick={() => this.onToggle()}
                >
                    {isOpen && <ChevronLeftIcon className={classes.icon} />}
                    {!isOpen && <MenuIcon className={classes.icon} />}
                </a>

                <div className={`link-wrapper ${openLinkKlass}`}>
                    <div className={classes.links}>
                        <h3>{intl.formatMessage(messages[title])} </h3>

                        <ul>
                            {_.map(links, link => {
                                return this.renderLink(link);
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(NavSub));
