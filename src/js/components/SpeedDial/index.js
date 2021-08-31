// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import CreateIcon from '@material-ui/icons/Add';

type Props = {
    classes: Object
};

type State = {
    open: boolean
};

const styles = theme => ({
    root: {
        height: 380,
        position: 'fixed',
        bottom: '1em',
        right: '0',
        '& > .MuiSpeedDial-root > .MuiButtonBase-root ': {
            background: '$menuColor'
        }
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3)
    }
});

const actions = [
    { icon: <CreateIcon />, name: 'Create report' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' }
];

class SpeedDialTooltipOpen extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    handleClick = () => {
        this.setState(state => ({
            open: !state.open
        }));
    };

    handleOpen = () => {
        this.setState({
            open: true
        });
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root}>
                <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    className={classes.speedDial}
                    icon={<SpeedDialIcon />}
                    onBlur={this.handleClose}
                    onClick={this.handleClick}
                    onClose={this.handleClose}
                    onFocus={this.handleOpen}
                    onMouseEnter={this.handleOpen}
                    onMouseLeave={this.handleClose}
                    open={open}
                >
                    {actions.map(action => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            tooltipOpen
                            onClick={this.handleClick}
                        />
                    ))}
                </SpeedDial>
            </div>
        );
    }
}

export default withStyles(styles)(SpeedDialTooltipOpen);
