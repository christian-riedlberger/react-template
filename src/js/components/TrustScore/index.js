// @flow
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type DefaultProps = {
    classes: Object
};
type Props = {} & DefaultProps;

type State = {};

const styles = {
    root: {
        width: 61,
        display: 'block',
        backgroundColor: '#2bbc75',
        background: 'linear-gradient(0deg, #2FBA74, #38D586)',
        padding: '.8em',
        paddingBottom: '0.5em',
        borderRadius: '5px',
        boxShadow: '0px 0px 12px 2px #c4c4c4c4'
    },
    circle: {
        width: 40,
        textAlign: 'center'
    },
    icon: {
        color: '#FFFFFF',
        fontSize: '1em',
        marginTop: '.5em'
    }
};

/**
 *  Component
 *  @desc
 *  @author
 */

class TrustScore extends Component<Props, State> {
    render() {
        const { classes } = this.props;

        return (
            <a className={classes.root}>
                <div className={classes.circle}>
                    <CircularProgressbar
                        value={80}
                        text="80"
                        strokeWidth={7}
                        styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0,

                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',

                            // Text size
                            textSize: '42px',

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,

                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',

                            // Colors
                            pathColor: '#FFFFFF',
                            textColor: '#FFFFFF',
                            trailColor: '#71e3aa',
                            backgroundColor: '#2bbc75'
                        })}
                    />

                    <ExpandMoreIcon className={classes.icon} />
                </div>
            </a>
        );
    }
}

export default withStyles(styles)(injectIntl(TrustScore));
