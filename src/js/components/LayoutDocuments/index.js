// @flow
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

// import SidebarDocuments from 'components/SidebarDocuments';
import FileDropzone from 'components/DropzoneFile';
import DataListFiles from 'components/DataListFiles';

import * as theme from 'constants/Theme';
// Typography
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
    }
});

const LayoutDocuments = () => {
    const classes = useStyles();
    /**
     * @jira GF-345
     * <div className={classes.sidebar}>
     *   <SidebarDocuments />
     * </div>
     */
    const Sidebar = null;

    return (
        <div>
            <FileDropzone>
                <div className={classes.root}>
                    {Sidebar}
                    <div id="documentsPage" className="page-wrapper">
                        <div className={classes.files}>
                            {/* // $FlowFixMe */}
                            <DataListFiles />
                        </div>
                    </div>
                </div>
            </FileDropzone>
        </div>
    );
};

export default LayoutDocuments;
