import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import TooltipLong from 'components/TooltipLong';

type DefaultProps = {
    classes: Object,
    children: React.Component
};

type Props = {
    toggleSort: Function,
    options: Object,
    sortDirection: 'ascending' | 'descending' | 'none' | null,
    sort: boolean,
    hint?: string,
    print: boolean,
    index: number,
    label: string,
    fixedHeader: boolean
} & DefaultProps;

const defaultHeadCellStyles = theme => ({
    root: {
        display: 'flex'
    },
    fixedHeader: {
        position: 'sticky',
        top: '0px',
        left: '0px',
        zIndex: 100,
        backgroundColor: theme.palette.background.paper
    },
    tooltip: {
        cursor: 'pointer'
    },
    mypopper: {
        '&[data-x-out-of-boundaries]': {
            display: 'none'
        }
    },
    data: {
        display: 'inline-block'
    },
    sortAction: {
        display: 'flex',
        verticalAlign: 'top',
        cursor: 'pointer'
    },
    sortLabelRoot: {
        height: '10px'
    },
    sortActive: {
        color: theme.palette.text.primary
    },
    toolButton: {
        display: 'flex',
        outline: 'none',
        cursor: 'pointer'
    },
    tooltipLong: {
        position: 'inherit'
    }
});

/**
 * @desc Datalist custom header component
 * @container datalist
 */

@withStyles(defaultHeadCellStyles, {
    name: 'MUIDataTableHeadCell'
})
class DataListCustomHeader extends React.Component<Props> {
    state = {
        isSortTooltipOpen: false,
        isHintTooltipOpen: false
    };

    handleKeyboardSortinput = e => {
        if (e.key === 'Enter') {
            this.props.toggleSort(this.props.index);
        }

        return false;
    };

    handleSortClick = () => {
        this.props.toggleSort(this.props.index);
    };

    render() {
        const { isSortTooltipOpen, isHintTooltipOpen } = this.state;
        const {
            classes,
            sortDirection,
            hint,
            print,
            label,
            fixedHeader
        } = this.props;
        const sortActive = !!(
            sortDirection !== 'none' && !_.isNil(sortDirection)
        );
        const ariaSortDirection =
            sortDirection === 'none' ? false : sortDirection;

        const sortLabelProps = {
            classes: { root: classes.sortLabelRoot },
            active: sortActive,
            hideSortIcon: true,
            ...(ariaSortDirection ? { direction: sortDirection } : {})
        };

        return (
            <TableCell
                className={`${!print ? 'datatables-noprint' : ''} ${
                    fixedHeader ? classes.fixedHeader : ''
                }`}
                scope="col"
                sortDirection={ariaSortDirection}
            >
                <div className={classes.root}>
                    <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                        classes={{
                            popper: classes.mypopper,
                            tooltip: classes.tooltip
                        }}
                        open={isSortTooltipOpen}
                        onOpen={() =>
                            isHintTooltipOpen
                                ? this.setState({ isSortTooltipOpen: false })
                                : this.setState({ isSortTooltipOpen: true })
                        }
                        onClose={() =>
                            this.setState({ isSortTooltipOpen: false })
                        }
                    >
                        <span
                            role="button"
                            onKeyUp={this.handleKeyboardSortinput}
                            onClick={this.handleSortClick}
                            className={classes.toolButton}
                            tabIndex={0}
                        >
                            <div
                                className={`${classes.data} ${
                                    sortActive ? classes.sortActive : ''
                                }`}
                            >
                                {label}
                            </div>
                            <div className={classes.sortAction}>
                                <TableSortLabel {...sortLabelProps} />
                            </div>
                        </span>
                    </Tooltip>
                    {hint && (
                        <TooltipLong
                            id={hint}
                            className={classes.tooltipLong}
                        />
                    )}
                </div>
            </TableCell>
        );
    }
}

/**
 * @desc datalist custem header for hints function mapping
 *    pass into header options to render hints using larg tooltip
 * @container datalist
 */
export const customHeadRender = (meta, handler) => (
    <DataListCustomHeader {...meta} toggleSort={handler} />
);

export default DataListCustomHeader;
