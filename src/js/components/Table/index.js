// @flow
import React, { Fragment, useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import MUIDataTable from 'mui-datatables';

import { CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import type { ContainerProps as PreferenceProps } from 'containers/PreferenceContainer';
import PreferenceContainer from 'containers/PreferenceContainer';

import { loadingTable } from 'constants/styles/LoadingStyles';
import { mergeTableColumns } from 'utils/common';

type DefaultProps = {
    classes: Object
} & PreferenceProps;

type Props = {
    columns: Array<Object>,
    data: Array<Object>,
    options: Object,
    isLoading: boolean,
    onChange: Function,
    onDoubleClick: Function,
    onRowsDelete: Function,
    onContextMenuOpen: Function,
    getExportData: Function,
    namespace: string
} & DefaultProps;

const styles = () => ({
    base: {
        '& .MuiTableBody-root': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    drag: {
        '& .MuiTableBody-root': {
            '&:hover': {
                cursor: 'copy'
            }
        }
    },
    circularProgress: {
        ...loadingTable
    }
});

const DOUBLE_CLICK_DELAY = 300;

/**
 *  Table Component
 *  @desc Implements MUI Datatable
 *  @author
 */

// Momoized to prevent unnecessary rerenders
const Table = (props: Props) => {
    const {
        columns,
        classes,
        data,
        isLoading,
        onChange,
        onDoubleClick,
        onRowsDelete,
        onDragNDrop,
        onContextMenuOpen,
        getExportData,
        namespace,
        updatePreference,
        fetchPreference,
        options
    } = props;

    let timeout = null;
    const [rowsSelected, setRowsSelected] = useState([]);

    /**
     * Set table & row functions
     */
    const option = {
        onTableChange: (action: string, tableState: Object) => {
            onTableChange(action, tableState);
        },
        onColumnSortChange: (changedColumn: string, direction: string) => {
            handleSort(changedColumn, direction);
        },
        onRowsDelete: (rowsDeleted: Object) => {
            if (onRowsDelete) onRowsDelete(rowsDeleted.data);
            return false;
        },
        onRowsSelect: (rowSelected, allRows) => {
            if (options.useCustomSelectableRows) {
                const temp = allRows.map(row => row.dataIndex);
                setRowsSelected(temp);
            }
        },
        onRowClick: (
            rowData: string[],
            rowMeta: { dataIndex: number, rowIndex: number }
        ) => {
            if (options.useCustomSelectableRows) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const temp = [...rowsSelected];
                    if (temp.includes(rowMeta.dataIndex)) {
                        temp.splice(
                            _.findIndex(temp, i => {
                                return i === rowMeta.dataIndex;
                            }),
                            1
                        );
                    } else {
                        temp.push(rowMeta.dataIndex);
                    }
                    setRowsSelected(temp);
                }, DOUBLE_CLICK_DELAY);
            }
        },
        setTableProps: () => ({
            onMouseLeave: () => {
                if (options.dragndrop) setCurrentRow(null);
            }
        }),
        setRowProps: (row: Array<Object>, dataIndex: number) => ({
            onDoubleClick: () => {
                if (options.useCustomSelectableRows) clearTimeout(timeout);
                if (onDoubleClick) onDoubleClick(row, dataIndex);
            },
            onMouseDown: () => {
                if (options.dragndrop) {
                    setDragIndex(dataIndex);
                    setMouseDown(true);
                }
            },
            onMouseMove: () => {
                if (options.dragndrop) setCurrentRow(dataIndex);
            },
            onMouseUp: () => {
                if (options.dragndrop) setDropIndex(dataIndex);
            },
            onContextMenu: (e: any) => {
                e.preventDefault();
                if (onContextMenuOpen) onContextMenuOpen(e, dataIndex);
            }
        }),
        rowsSelected,
        ...options
    };

    /**
     * State & Lifecycles
     */
    const [paging, setPaging] = useState({
        page: option.page,
        maxItems: option.maxItems
    });
    const [sort, setSort] = useState();
    const prevSort = usePrevious(sort);
    const [_columns, setColumns] = useState([]);
    const [exportColumns, setExportColumns] = useState([]);
    const [isDragging, setDrag] = useState(false);
    const [mouseDown, setMouseDown] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);
    const [dragIndex, setDragIndex] = useState(null);
    const [dropIndex, setDropIndex] = useState(null);

    /**
     * On Mount
     */
    useEffect(() => {
        if (options.dragndrop) {
            // $FlowFixMe
            document.body.onmouseup = setIsDraggingState;
        }
        fetchPreference(namespace)
            .then(resp => {
                const value = _.get(
                    resp.value.data,
                    `${namespace}.table.columns`
                );
                const result = _.isNil(value)
                    ? columns
                    : mergeTableColumns(columns, JSON.parse(value));
                setColumns(result);
                return null;
            })
            .catch(error => {
                throw error;
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Determine if we are dragging a file/folder to a new location (toggles cursor change)
     */
    useEffect(() => {
        if (
            options.dragndrop &&
            currentRow !== null &&
            dragIndex !== null &&
            currentRow !== dragIndex &&
            mouseDown
        ) {
            setDrag(true);
        } else {
            setDrag(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRow, dragIndex, mouseDown]);

    /**
     * Check if we have both a drop and drag index, if they exist and not equal, handle drag and drop function. Reset both indexes after to not repeat
     */
    useEffect(() => {
        if (dragIndex !== null && dropIndex !== null) {
            if (dragIndex !== dropIndex) {
                if (
                    rowsSelected.length > 0 &&
                    _.findIndex(rowsSelected, dropIndex) === -1
                ) {
                    onDragNDrop(rowsSelected, dropIndex);
                } else {
                    onDragNDrop([dragIndex], dropIndex);
                }
            }
            setDragIndex(null);
            setDropIndex(null);
        }
    }, [dragIndex, dropIndex, onDragNDrop, rowsSelected]);

    /**
     * Reset selected rows on data changes
     */
    useEffect(() => {
        if (options.useCustomSelectableRows) setRowsSelected([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    /**
     * Watch for any changes in sorting done on the table
     */
    useEffect(() => {
        if (
            onChange &&
            // Prevent second re-render when initial data is fetched
            !_.isEqual(prevSort, sort)
        ) {
            onChange(paging, sort);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    /**
     * Handle changes in current data and update export data to correspond with change
     */
    useEffect(() => {
        if (getExportData && !_.isEmpty(exportColumns))
            getExportData(exportColumns, rowsSelected);
    }, [rowsSelected, exportColumns, getExportData]);

    /**
     * Determine if the mouse button has been move up even when the mouse is not over the table component
     *
     */
    const setIsDraggingState = e => {
        if (e.buttons === undefined) {
            setMouseDown(e.which === 1);
        } else {
            // eslint-disable-next-line no-bitwise
            setMouseDown((e.buttons & 1) === 1);
        }
    };

    /**
     * Capture changes to table and update state variables.
     */
    const onTableChange = (action: string, tableState: Object) => {
        if (!_.isEqual(exportColumns, tableState.columns)) {
            setExportColumns(tableState.columns);
        }

        switch (action) {
            case 'columnViewChange': {
                saveTableColumnsPreference(tableState.columns);
                setColumns(mergeTableColumns(columns, tableState.columns));
                break;
            }

            case 'changePage':
                setPaging({
                    page: tableState.page,
                    maxItems: tableState.rowsPerPage
                });
                if (onChange)
                    onChange(
                        {
                            page: tableState.page,
                            maxItems: tableState.rowsPerPage
                        },
                        sort
                    );
                break;

            case 'changeRowsPerPage': {
                setPaging({ page: 0, maxItems: tableState.rowsPerPage });
                if (onChange)
                    onChange(
                        { page: 0, maxItems: tableState.rowsPerPage },
                        sort
                    );
                break;
            }

            default:
                break;
        }
    };

    /**
     * Save user table columns changes.
     * @param {*} columns
     */
    const saveTableColumnsPreference = tableColumns => {
        if (!_.isNil(tableColumns) && !_.isEmpty(tableColumns)) {
            const pref = {
                table: {
                    columns: JSON.stringify(
                        mergeTableColumns(_columns, tableColumns)
                    )
                }
            };
            updatePreference(namespace, pref);
        }
    };

    /**
     * Handler for both MUI datatable and Custom sort
     */
    const handleSort = (name: string, direction: string) => {
        const columnIndex = _.findIndex(_columns, o => {
            return o.name === name;
        });

        // Omit sort direction
        const newSortColumns = _.map(_columns, c => {
            return {
                ...c,
                options: _.omit(c.options, ['sortDirection'])
            };
        });

        const abreviation = direction === 'ascending' ? 'asc' : 'desc';
        newSortColumns[columnIndex].options = {
            sortDirection: abreviation
        };

        setColumns(newSortColumns);
        setSort({ name, direction });
    };

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    if (isLoading)
        return (
            <Fragment>
                <span className={classes.circularProgress}>
                    <CircularProgress size={48} />
                </span>
            </Fragment>
        );
    return (
        <MUIDataTable
            className={isDragging ? classes.drag : classes.base}
            key={`mui-datatable-${rowsSelected.length}`}
            data={data}
            columns={_columns}
            options={option}
        />
    );
};

Table.displayName = 'Table';
export default PreferenceContainer()(withStyles(styles)(Table));
