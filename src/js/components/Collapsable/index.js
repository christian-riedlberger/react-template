// @flow
import * as React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { textblack, hue3 } from 'constants/Theme';

type DefaultProps = {
    classes: Object,
    title: string | React.Node
};

type Props = {
    isOpen: boolean,
    nullOnHidden?: boolean,
    children: any
} & DefaultProps;

type State = {
    isOpen: boolean
};

const styles = {
    root: {
        borderBottom: `1px solid ${hue3}`
    },
    header: {
        display: 'flex',
        flexFlow: 'row nowrap',
        flex: '1 100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        display: 'inline',
        color: textblack,
        fontSize: '1.2em',
        fontWeight: 400,
        padding: '1em 0'
    },
    paper: {
        width: '100%'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto'
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    icon: {
        fontSize: '0.75em'
    }
};

@withStyles(styles)
class Collapsable extends React.Component<Props, State> {
    static defaultProps = {
        dividerBottom: '',
        dividerTop: ''
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
        const { classes, children, title, nullOnHidden } = this.props;
        const { isOpen } = this.state;

        let renderChildren = children;
        if (nullOnHidden && !isOpen) renderChildren = null;

        return (
            <div className={classes.root}>
                <div className="customCollapse">
                    <div className={classes.header}>
                        <div className={classes.title}>
                            <div className="customTitle">{title}</div>
                        </div>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: isOpen
                            })}
                            onClick={this.handleChange}
                            aria-expanded={isOpen}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon className={classes.icon} />
                        </IconButton>
                    </div>
                    <div className={classes.container}>
                        <Collapse in={isOpen}>
                            <div className="customCollapseBody">
                                {renderChildren}
                            </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        );
    }
}
export default Collapsable;
