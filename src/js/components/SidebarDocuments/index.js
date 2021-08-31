// @flow
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import TreeLibrary from 'components/TreeLibrary';
import TreeLibraryShared from 'components/TreeLibraryShared';

import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import UserContainer from 'containers/UserContainer';
import type { ContainerProps as UserContainerProps } from 'containers/UserContainer';
import messages from 'constants/Messages';
import { REPO_SHARED, REPO_PERSONAL, REPO_BUSINESS } from 'constants/Config';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    ...RepoContainerProps,
    ...UserContainerProps
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        margin: '1em 0',
        '& > div': {
            padding: '1em .5em',
            borderBottom: '1px solid #e6e6e6'
        },
        '& .MuiTypography-root': {
            color: '#797979',
            fontSize: '1.2em',
            lineHeight: '1.75em',
            fontWeight: 300
        },
        '& .MuiTreeItem-iconContainer': {
            color: '#5f5f5f'
        },
        '& .MuiButtonBase-root': {
            minHeight: 'auto!important',
            padding: '0'
        },
        '& .MuiButtonBase-root.Mui-expanded': {
            borderBottom: '1px solid #e6e6e6',
            marginBottom: '1em'
        },
        '& .MuiExpansionPanelDetails-root': {
            padding: '0!important'
        }
    },
    repoTree: {
        // height: '20em',
        // width: '20em',
        // overflowY: 'auto',
        // overflowX: 'auto'
    },
    panel: {
        boxShadow: 'unset',
        backgroundColor: 'unset'
    },
    title: {
        padding: '4px 0px 0px 8px',
        fontSize: '19px'
    },
    icon: {
        position: 'relative',
        top: '3px',
        color: 'darkgrey'
    }
});

const SidebarDocuments = (props: Props) => {
    const {
        intl,
        personalRef,
        fetchDocumentNodesIsLoading,
        activeOrg,
        activeOrgChange,
        setActiveOrganizationDone,
        setActiveRepo,
        activeRepo
    } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(0);
    const [businessRef, setBusinessRef] = useState(null);
    const [hasRendered, setRendered] = useState({});

    useEffect(() => {
        setBusinessRef(_.get(activeOrg, 'businessRef'));
        if (!activeRepo) setActiveRepo(repositories[0].type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeOrgChange) handleOrganizationChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeOrgChange]);

    const repositories = [
        {
            title: intl.formatMessage(messages.business),
            type: REPO_BUSINESS,
            body: (
                <TreeLibrary
                    includeParent
                    ns="business"
                    parentRef={businessRef}
                    className={classes.repoTree}
                />
            )
        },
        {
            title: intl.formatMessage(messages.personal),
            type: REPO_PERSONAL,
            body: (
                <TreeLibrary
                    includeParent
                    ns="personal"
                    parentRef={personalRef}
                    className={classes.repoTree}
                />
            )
        },
        {
            title: intl.formatMessage(messages.shared),
            type: REPO_SHARED,
            body: <TreeLibraryShared />
        }
    ];

    const handleOrganizationChange = () => {
        if (activeOrgChange) {
            if (activeOrg) setBusinessRef(activeOrg.businessRef);
            // eslint-disable-next-line no-restricted-globals
            location.hash = '';
            window.history.pushState(
                null,
                null,
                `${window.location.protocol}//${window.location.host}/documents`
            );
            setActiveOrganizationDone();
        }
    };

    const handleChange = index => {
        setActiveRepo(repositories[index].type);
        setExpanded(index);
        setRendered({ ...hasRendered, [String(index)]: true });
    };

    const renderRepo = (repo, index) => {
        const { title, body } = repo;

        let content = body;
        if (!hasRendered[String(index)] && expanded !== index)
            content = <div />;

        return (
            <div key={`repo-${title}`} className={classes.repo}>
                <ExpansionPanel
                    square
                    expanded={expanded === index}
                    onChange={() => handleChange(index)}
                    classes={{
                        root: `${classes.panel} cy-repo-${repo.type}`
                    }}
                >
                    <ExpansionPanelSummary>
                        {expanded === index ? (
                            <ExpandMoreIcon className={classes.icon} />
                        ) : (
                            <ChevronRightIcon className={classes.icon} />
                        )}
                        <span className={classes.title}>{repo.title}</span>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>{content}</ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    };

    return (
        <div className={classes.root}>
            {!fetchDocumentNodesIsLoading && _.map(repositories, renderRepo)}
        </div>
    );
};

export default compose(
    RepoContainer({ initDocumentNodes: true }),
    UserContainer({}),
    injectIntl
)(SidebarDocuments);
