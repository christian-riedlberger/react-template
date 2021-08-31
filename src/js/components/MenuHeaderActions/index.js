// @flow
import React, { Fragment, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReactToPrint from 'react-to-print';
import { CSVLink } from 'react-csv';

import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    direction: 'horizontal' | 'vertical',
    PrintComponent: Object,
    rows?: Array<Object>,
    columns?: Array<String>,
    getExportData?: Function,
    showHideColumns: boolean
} & DefaultProps;
/**
 *  Styled menu popup
 */
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        '& ul a': {
            color: 'rgba(0, 0, 0, 0.87)'
        }
    }
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
        }}
        {...props}
    />
));

/**
 *  Styled menu option
 */
const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white
            }
        }
    }
}))(MenuItem);

/**
 *  User actions menu component
 *  Prints or exports data to a csv
 *  Props:
 *          direction: orientation of the icon button (three dots) -> options: horizontal or vertical
 *          PrintComponent: component that you want to print *** MUST BE A CLASS COMPONENT ****
 *          rows: the data you want to print or export -> should be a list of object with keys that map to column strings
 *          columns: the headers of the print / export file -> should be a list of strings that map to keys in the row objects
 *          getExportData: Function to get the data when opened rather than being passed down through rows and columns
 *
 */
const HeaderActionsMenu = (props: Props) => {
    const {
        PrintComponent,
        direction,
        rows,
        columns,
        getExportData,
        intl,
        showHideColumns
    } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const [exportData, setExportData] = useState({
        rows: [],
        columns: []
    });

    const printComponentRef = useRef();

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
        if (getExportData) {
            setExportData(getExportData());
        } else {
            setExportData({ rows, columns });
        }
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <Fragment>
            <div>
                <IconButton
                    data-cy="show-header-action"
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    {direction === 'horizontal' ? (
                        <MoreHorizIcon />
                    ) : (
                        <MoreVertIcon />
                    )}
                </IconButton>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <ReactToPrint
                        trigger={() => (
                            <StyledMenuItem>
                                {intl.formatMessage(messages.print)}
                            </StyledMenuItem>
                        )}
                        content={() => printComponentRef.current}
                    />
                    <CSVLink
                        data={exportData.rows || [['']]}
                        headers={exportData.columns}
                    >
                        <StyledMenuItem>
                            {intl.formatMessage(messages.export)}
                        </StyledMenuItem>
                    </CSVLink>
                    {showHideColumns && (
                        <StyledMenuItem
                            data-cy="show-hide-columns"
                            onClick={() => {
                                window.document
                                    .querySelector('.MuiToolbar-root button')
                                    .click();
                                handleClose();
                            }}
                        >
                            {intl.formatMessage(messages.showHideColumns)}
                        </StyledMenuItem>
                    )}
                </StyledMenu>
            </div>
            <div style={{ display: 'none' }}>
                <PrintComponent
                    ref={printComponentRef}
                    rows={exportData.rows}
                    columns={exportData.columns}
                />
            </div>
        </Fragment>
    );
};

export default injectIntl(HeaderActionsMenu);
