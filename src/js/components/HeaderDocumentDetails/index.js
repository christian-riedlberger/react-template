// @flow
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps } from 'containers/RepoContainer';
import HeaderLinks from 'components/HeaderLinks';
import BreadCrumbPath from 'components/BreadCrumbPath';
import Header from 'components/Header';
import { ENABLE_HEADER_LINKS, REPO_SHARED } from 'constants/Config';
import HeaderProfile from '../HeaderProfile';

// Custom CSS Classes
const useStyles = makeStyles({
    header: {
        textAlign: 'right',
        marginBottom: '1em'
    },
    breadcrumb: {
        float: 'left',
        marginTop: '0'
    }
});

type DefaultProps = {
    documentsError: Array<string>
} & ContainerProps;
type Props = {} & DefaultProps;

/**
 * Definition of a Pie chart
 * @param {*} param0
 */
const HeaderDocumentDetails = (props: Props) => {
    const { activeFile, documentsError, fetchFolder } = props;
    const classes = useStyles();

    useEffect(() => {
        if (_.get(activeFile, 'breadcrumb[0].link') === REPO_SHARED) {
            fetchFolder({ nodeRef: activeFile.parentRef });
        }
    }, [activeFile, fetchFolder]);

    if (documentsError && documentsError.length > 0) {
        return (
            <div className={classes.error}>
                <Header />
            </div>
        );
    }

    return (
        <div className={classes.header}>
            {activeFile && (
                <div className={classes.breadcrumb}>
                    <BreadCrumbPath
                        path={_.get(activeFile, 'breadcrumb', '')}
                    />
                </div>
            )}
            {ENABLE_HEADER_LINKS && <HeaderLinks />}
            <HeaderProfile />
        </div>
    );
};

export default RepoContainer()(HeaderDocumentDetails);
