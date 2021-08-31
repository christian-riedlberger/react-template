// @flow
import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { Element } from 'react';
// import { log } from 'utils/logger';

type DefaultProps = {
    classes: Object,
    title: string | Element<any>
};

type Props = {
    isOpen: boolean,
    children: any,
    button?: any
} & DefaultProps;

type State = {
    isOpen: boolean
};

const styles = {
    root: {},
    header: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        flex: '1 100%',
        justifyContent: 'space-between',
        paddingBottom: '1em'
    },
    lineWrapper: {
        flexGrow: '1',
        position: 'relative',
        top: '-3px',
        margin: '0 2em'
    },
    line: {
        background: '#BAC5D0',
        display: 'inline-block',
        width: '100%',
        height: '1px'
    },
    buttonWrapper: {
        marginLeft: '2em'
    },
    title: {
        fontSize: '20px',
        display: 'inline',
        cursor: 'pointer'
    },
    paper: {
        width: 'auto'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto'
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    }
};

@withStyles(styles)
class CollapsableLine extends Component<Props, State> {
    static defaultProps = {
        dividerBottom: null,
        dividerTop: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            isOpen: props.isOpen
        };
    }

    handleChange = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render() {
        const { classes, children, title, button } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={classes.root}>
                <div className="customCollapse">
                    <div className={classes.header}>
                        <div
                            className={classes.title}
                            onClick={this.handleChange}
                        >
                            <div className="customTitle">{title}</div>
                        </div>
                        {button && (
                            <div className={classes.buttonWrapper}>
                                <div className={classes.button}>{button}</div>
                            </div>
                        )}
                        <div className={classes.lineWrapper}>
                            <div className={classes.line} />
                        </div>
                        <div>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: isOpen
                                })}
                                onClick={this.handleChange}
                                aria-expanded={isOpen}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className={classes.container}>
                        <Collapse in={isOpen}>
                            <div className="customCollapseBody">{children}</div>
                        </Collapse>
                    </div>
                </div>
            </div>
        );
    }
}
export default CollapsableLine;
