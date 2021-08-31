import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';

import { Drawer as MuiDrawer } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import * as theme from 'constants/Theme';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape,
    classes: Object,
    children: Component,
    title: string,
    noButton?: boolean,
    open: boolean,
    onClose?: Function
};

type Props = {
    anchor: string,
    width: number,
    onReset: Function
} & DefaultProps;

type State = {
    open: boolean
};

const styles = {
    root: {},
    wrapper: {
        padding: '1.5em',
        borderLeft: `0.5em solid ${theme.hue0}`,
        height: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1em'
    },
    headerleft: {
        marginLeft: '-.5em'
    },
    back: {
        padding: '0.25em'
    },
    icon: {
        fontSize: 18
    },
    iconReset: {
        fontSize: 25
    },
    title: {
        position: 'relative',
        top: '4px',
        marginLeft: '.25em',
        fontSize: '1.4em',
        fontWeight: '300',
        color: '#38393D',
        display: 'inline'
    }
};

class Drawer extends React.Component<Props, State> {
    static defaultProps = {
        anchor: 'right',
        width: 355
    };

    state = {
        open: false
    };

    componentDidUpdate = prevProps => {
        if (!_.isEqual(_.get(prevProps, 'open'), _.get(this.props, 'open')))
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                open: this.props.open
            });
    };

    renderHeader = () => {
        const { classes, title, onReset, intl } = this.props;
        return (
            <React.Fragment>
                <div className={classes.header}>
                    <div className={classes.headerleft}>
                        <IconButton
                            onClick={() => this.closeDrawer()}
                            className={classes.back}
                            data-cy="drawer-close"
                        >
                            <ArrowBackIcon
                                data-cy="closeDrawer"
                                className={classes.icon}
                            />
                        </IconButton>
                        <Typography variant="h4" className={classes.title}>
                            {title}
                        </Typography>
                    </div>
                    <div className={classes.headerright}>
                        {onReset ? (
                            <Tooltip
                                title={intl.formatMessage(messages.reset)}
                                placement="right-start"
                            >
                                <IconButton
                                    onClick={() => onReset()}
                                    className={classes.back}
                                >
                                    <RotateLeftIcon
                                        className={classes.iconReset}
                                    />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    openDrawer = () => {
        this.setState({
            open: true
        });
    };

    closeDrawer = () => {
        this.setState({
            open: false
        });
        if (this.props.onClose) this.props.onClose();
    };

    render() {
        const {
            classes,
            anchor,
            width,
            children,
            title,
            noButton
        } = this.props;
        const { open } = this.state;
        return (
            <React.Fragment>
                {noButton ? null : (
                    <Tooltip title={title} placement="bottom">
                        <IconButton
                            component="span"
                            onClick={() => this.openDrawer()}
                        >
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
                <MuiDrawer
                    anchor={anchor}
                    open={open}
                    onClose={() => this.closeDrawer()}
                    className={classes.drawer}
                >
                    <div
                        style={{
                            ...styles.wrapper,
                            width: `${width}px`
                        }}
                    >
                        {this.renderHeader()}
                        {children}
                    </div>
                </MuiDrawer>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(injectIntl(Drawer));
