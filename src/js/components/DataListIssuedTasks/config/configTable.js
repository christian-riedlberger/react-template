// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';
import { TASK_PAGE_SIZE } from 'constants/Config';

const config = {
    columns: [
        {
            name: 'actions',
            label: 'actions',
            options: {
                filter: false,
                print: false,
                viewColumns: false,
                customBodyRender: (value: any) => {
                    return <div className="table-action-body">{value}</div>;
                },
                customHeadRender: (columnMeta: Object) => {
                    return (
                        <th
                            className="table-action-body"
                            key={`${columnMeta.index}actions`}
                        >
                            &nbsp;
                        </th>
                    );
                }
            },
            property: 'actions'
        },

        {
            name: 'name',
            label: 'title',
            dataCy: 'documents',
            options: {
                filter: false,
                viewColumns: false,
                setCellHeaderProps: () => ({ 'data-cy': 'documents' })
            },
            property: 'name'
        },
        {
            name: 'owner',
            label: 'nameOfCompany',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'owner' })
            },
            property: 'owner'
        },
        {
            name: 'collaborators',
            label: 'collaborators',
            options: {
                filter: false,
                display: false,
                setCellHeaderProps: () => ({ 'data-cy': 'collaborators' })
            },
            property: 'collaborators'
        },
        {
            name: 'start',
            label: 'submitted',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'submitted' })
            },
            property: 'start'
        },
        {
            name: 'due',
            label: 'deadline',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'due' })
            },
            property: 'due'
        },
        {
            name: 'completion',
            label: 'completion',
            options: { filter: false, display: false },
            property: 'completionProgress'
        },
        {
            name: 'progress',
            label: 'progress',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'progress' })
            },
            property: 'progress'
        },
        {
            name: 'status',
            label: 'status',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'status' })
            },
            property: 'status'
        }
    ],
    options: {
        filter: false,
        print: false,
        download: false,
        search: false,
        filterType: 'dropdown',
        responsive: 'stackedFullWidth',
        serverSide: true,
        rowsPerPage: TASK_PAGE_SIZE,
        rowsPerPageOptions: [TASK_PAGE_SIZE, 50, 100],
        selectableRows: 'none',
        textLabels: {
            body: {
                noMatch: <FormattedMessage {...messages.emptyNoFiles} />,
                toolTip: <FormattedMessage {...messages.sort} />
            },
            pagination: {
                next: <FormattedMessage {...messages.next} />,
                previous: <FormattedMessage {...messages.back} />,
                rowsPerPage: <FormattedMessage {...messages.rowsPerPage} />
            },
            selectedRows: {
                text: <FormattedMessage {...messages.selectedRows} />,
                delete: <FormattedMessage {...messages.delete} />
            }
        }
    }
};

export default config;
