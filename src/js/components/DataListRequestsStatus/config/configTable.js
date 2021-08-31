// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';
import { TASK_PAGE_SIZE } from 'constants/Config';

const config = {
    columns: [
        {
            name: 'taskTitle',
            label: 'title',
            options: {
                filter: false,
                viewColumns: false,
                setCellHeaderProps: () => ({ 'data-cy': 'taskTitle' })
            },
            property: 'taskTitle'
        },
        {
            name: 'name',
            label: 'requestDocuments',
            options: {
                filter: false,
                viewColumns: false,
                setCellHeaderProps: () => ({ 'data-cy': 'name' })
            },
            property: 'name'
        },
        {
            name: 'issuingEntity',
            label: 'assignedBy',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'issuingEntity' })
            },
            property: 'issuingEntity'
        },
        {
            name: 'receiver',
            label: 'receiver',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'receiver' })
            },
            property: 'receivingEntity'
        },
        {
            name: 'dueDate',
            label: 'deadline',
            options: {
                filter: false,
                setCellHeaderProps: () => ({ 'data-cy': 'dueDate' })
            },
            property: 'dueDate'
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
            label: 'requestStatus',
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
