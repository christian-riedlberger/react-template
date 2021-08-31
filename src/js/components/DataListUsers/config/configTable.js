// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';
import { USER_PAGE_SIZE } from 'constants/Config';

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
            name: 'userName',
            label: 'username',
            options: { filter: false },
            property: 'userName'
        },
        {
            name: 'firstName',
            label: 'name',
            options: {
                filter: false,
                viewColumns: false,
                sortDirection: 'ascending',
                sort: false
            },
            property: 'name'
        },
        {
            name: 'email',
            label: 'email',
            options: { filter: false, sort: false },
            property: 'email'
        },
        {
            name: 'organization',
            label: 'organization',
            options: { sort: false },
            property: 'organizations'
        },
        {
            name: 'jobtitle',
            label: 'jobTitle',
            options: { filter: false, sort: false },
            property: 'jobtitle'
        },
        {
            name: 'telephone',
            label: 'phone',
            options: { filter: false, sort: false },
            property: 'telephone'
        }
    ],
    options: {
        filter: true,
        print: false,
        download: false,
        search: false,
        filterType: 'dropdown',
        responsive: 'stackedFullWidth',
        serverSide: true,
        selectableRows: 'multiple',
        useCustomSelectableRows: true,
        rowsPerPage: USER_PAGE_SIZE,
        rowsPerPageOptions: [USER_PAGE_SIZE, 50, 100],
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
