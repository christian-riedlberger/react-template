// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';
import VersionContainer from 'containers/VersionContainer';

type DefaultProps = {
    classes: Object,
    fetchVersionHistory: Function,
    nodeRef: string
};
type Props = {
    versionHistory: Array<Object>
} & DefaultProps;

type State = {
    versionHistory: Array<Object>
};

const styles = theme => ({
    root: {
        marginLeft: '1em',
        width: '100%',
        backgroundColor: theme.hue2,
        maxHeight: '20vh',
        overflow: 'auto',
        marginTop: '-1em'
    },
    inline: {
        display: 'inline'
    },
    listItem: {
        paddingLeft: 0
    },
    secondaryText: {
        color: theme.textblack,
        fontSize: '.9em'
    },
    primaryText: {
        color: 'rgba(0, 0, 0, 0.87)',
        fontSize: '.9em'
    }
});

class ListVersionHistory extends Component<Props, State> {
    componentDidMount() {
        this.initializeVersions();
    }

    componentDidUpdate = prevProps => {
        if (
            !_.isEqual(
                _.get(prevProps, 'nodeRef'),
                _.get(this.props, 'nodeRef')
            )
        ) {
            this.initializeVersions();
        }
    };

    initializeVersions = () => {
        const { nodeRef, fetchVersionHistory } = this.props;
        if (nodeRef) {
            fetchVersionHistory(nodeRef);
        }
    };

    renderEntries = versionArr => {
        const { classes } = this.props;
        return _.map(versionArr, (version, i) => {
            return (
                <div key={i}>
                    {i !== 0 && <Divider variant="middle" />}
                    <ListItem
                        component="div"
                        key={`comment-${i}`}
                        className={classes.listItem}
                    >
                        <ListItemText
                            primary={version.name}
                            secondary={
                                <React.Fragment>
                                    <span className={classes.primaryText}>
                                        {version.label}
                                    </span>
                                    <span className={classes.secondaryText}>
                                        {` - ${moment(
                                            version.createdDateISO
                                        ).format('LL')}`}
                                    </span>

                                    {version.description && (
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                            className={classes.secondaryText}
                                        >
                                            {version.description}
                                        </Typography>
                                    )}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                </div>
            );
        });
    };

    render() {
        const { classes, versionHistory } = this.props;

        return (
            <div className={classes.root}>
                <List>{this.renderEntries(versionHistory)}</List>
            </div>
        );
    }
}

export default withStyles(styles)(
    VersionContainer({})(injectIntl(ListVersionHistory))
);
