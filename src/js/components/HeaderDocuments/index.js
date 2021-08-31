import React, { Fragment, useRef, useEffect, useState } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';

import { withRouter, Route } from 'react-router';

import * as theme from 'constants/Theme';
import SearchbarCategories from 'components/SearchbarCategories';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps } from 'containers/RepoContainer';
import MenuHeaderActions from 'components/MenuHeaderActions';
import TablePrintData from 'components/TablePrintData';
import TabLined from 'components/TabLined';
import HeaderText from 'components/HeaderText';
import Button from 'components/Button';
import QuickAccessList from 'components/ListQuickAccessDocuments';
import FilterTags from 'components/TagFilters';

import messages from 'constants/Messages';
import { renderTagValues } from 'constants/Filters';
import {
    REPO_BUSINESS,
    REPO_PERSONAL,
    REPO_SHARED,
    SEARCH_CATEGORIES
} from 'constants/Config';
import { getHashPaths, createHashPath } from 'utils/location';
import { getUniqueId } from 'utils/unique';

type DefaultProps = {
    intl: intlShape,
    router: Route,
    fetchDocument: Function
} & ContainerProps;

type Props = {
    onSearch: Function,
    getExportData: Function,
    currentData: Object,
    handleNew: () => void,
    formName: string,
    formValues: Object,
    showHideColumns?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexGrow: 1,
        '& .MuiTreeItem-group': {
            marginLeft: '10px'
        },
        '& h3': {
            display: 'flex',
            fontSize: '1.7em',
            lineHeight: '1em',
            fontWeight: 300,
            marginBottom: '.25em'
        },
        '& h3 span': {
            marginLeft: '.3em'
        }
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '6em',
        background: theme.hue0,
        padding: '1.5em',
        width: 250
    },
    files: {
        flexGrow: 1
    },
    repo: {
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
        }
    },
    input: {
        display: 'none'
    },
    line: {
        borderLeft: `1px solid ${theme.hue4}`,
        height: '20px'
    },
    tabs: {
        marginTop: '1em',
        '& header': {
            paddingLeft: 0
        },
        '& span.MuiTab-wrapper': {
            textTransform: 'none',
            fontSize: '1.4em',
            fontWeight: 400
        },
        '& .MuiTabs-root': {
            minHeight: 'auto',
            marginTop: '1em'
        }
    }
});

const HeaderDocuments = (props: Props) => {
    const {
        uploadFileAdd,
        onSearch,
        onFilter,
        getExportData,
        currentData,
        activeFolder,
        intl,
        handleNew,
        router,
        isRootPath,
        clearDataListDocuments,
        setActiveRepo,
        getRecentDocuments,
        clearRecentDocuments,
        recentDocuments,
        formValues,
        formName,
        showHideColumns
    } = props;

    const actionButtons = [];
    const classes = useStyles();
    const inputButton = useRef({});
    const [tags, setTags] = useState([]);

    // Setup personal tabs
    const username = localStorage.getItem('auth:username');
    let REPO_PERSONAL_TAB = `${REPO_PERSONAL}/${username}`;

    // Admin doesn't have one
    if (username === 'admin') REPO_PERSONAL_TAB = REPO_PERSONAL;
    const tabs = [REPO_BUSINESS, REPO_PERSONAL_TAB, REPO_SHARED];
    const repos = [REPO_BUSINESS, REPO_PERSONAL, REPO_SHARED];

    useEffect(() => {
        setTags(renderTagValues(formName, formValues, intl));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

    useEffect(() => {
        getRecentDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const paths = getHashPaths();
        const index = _.indexOf(tabs, paths[0]);
        if (index > -1) {
            setActiveRepo(repos[index]);
        }
    });

    useEffect(() => {
        return () => {
            clearRecentDocuments();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileUpload = (e: Object) => {
        uploadFileAdd(
            _.map(_.values(e.target.files), file => ({
                file,
                parent: activeFolder.nodeRef,
                percentCompleted: 0,
                id: getUniqueId()
            }))
        );
    };

    const handleTabChange = (index: number) => {
        setActiveRepo(repos[index]);
        clearDataListDocuments();
        router.push(createHashPath([tabs[index]]));
    };

    const handleUploadClick = () => {
        inputButton.current.click();
    };

    let tabIndex: number = _.findIndex(tabs, t => {
        return t.includes(getHashPaths()[0]);
    });
    if (tabIndex === -1) tabIndex = null;

    // Allowed to upload?
    if (
        _.get(activeFolder, 'permission.create') === true &&
        !_.get(activeFolder, 'isOrgFolder') &&
        !_.get(activeFolder, 'isOrgRoot')
    ) {
        actionButtons.push(
            <React.Fragment key="left-1">
                <input
                    ref={inputButton}
                    className={classes.input}
                    onChange={e => handleFileUpload(e)}
                    id="contained-button-file"
                    multiple
                    type="file"
                />
                <label
                    htmlFor="contained-button-file"
                    style={{
                        float: 'left',
                        marginRight: '.5em'
                    }}
                >
                    <Button
                        round
                        text="upload"
                        size="small"
                        onClick={handleUploadClick}
                    />
                </label>
            </React.Fragment>
        );
    }

    // Allowed new folder?
    if (
        window.location.hash !== '#/shared' &&
        _.get(activeFolder, 'permission.create') === true &&
        !_.get(activeFolder, 'isOrgRoot')
    ) {
        actionButtons.push(
            <label htmlFor="contained-button-file">
                <Button
                    round
                    text="newFolder"
                    size="small"
                    color="grey"
                    onClick={handleNew}
                />
            </label>
        );
    }

    return (
        <Fragment>
            <div
                style={{
                    position: 'absolute',
                    top: '1em',
                    left: '1em',
                    zIndex: 1
                }}
            >
                <SearchbarCategories
                    categories={SEARCH_CATEGORIES}
                    category={SEARCH_CATEGORIES[0]}
                    onSearch={onSearch}
                    placeholder="placeholderSearchDocument"
                    size="small"
                    round
                />
            </div>
            {isRootPath && (
                <QuickAccessList recentDocuments={recentDocuments} />
            )}
            <div className={classes.tabs}>
                <TabLined
                    tabs={tabs}
                    variant="standard"
                    title={intl.formatMessage(messages.documents)}
                    onChange={handleTabChange}
                    activeTab={tabIndex}
                />
            </div>

            <HeaderText
                flat
                buttonsLeft={actionButtons}
                buttonsRight={[
                    <Button
                        key="right-1"
                        text="filters"
                        size="small"
                        color="grey0"
                        iconPosition="right"
                        icon={
                            <clr-icon
                                shape="filter-2"
                                size={18}
                                style={{
                                    position: 'relative',
                                    top: '1px'
                                }}
                            />
                        }
                        round
                        onClick={onFilter}
                    />,
                    <div key="right-2" className={classes.line} />,
                    <MenuHeaderActions
                        key="right-3"
                        direction="horizontal"
                        PrintComponent={TablePrintData}
                        rows={currentData ? currentData.rows : null}
                        columns={currentData ? currentData.columns : null}
                        getExportData={getExportData}
                        showHideColumns={showHideColumns}
                    />
                ]}
                buttonsBottom={[<FilterTags tags={tags} border intl={intl} />]}
                borderBottom
            />
        </Fragment>
    );
};

export default compose(
    injectIntl,
    RepoContainer({}),
    withRouter
)(HeaderDocuments);
