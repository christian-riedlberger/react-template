// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';

export const config = {
    columns: [
        {
            name: 'actions',
            label: 'actions',
            options: {
                filter: false,
                sort: false,
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
            label: 'name',
            options: {
                filter: true,
                sort: true,
                viewColumns: false,
                sortDirection: 'asc',
                setCellHeaderProps: () => ({ 'data-cy': 'column-name' })
            },
            property: 'name'
        },
        {
            name: 'modifier',
            label: 'modifier',
            options: {
                filter: true,
                sort: true,
                display: false,
                setCellHeaderProps: () => ({ 'data-cy': 'column-modifier' })
            },
            property: 'modifier'
        },
        {
            name: 'modified',
            label: 'modified',
            options: {
                filter: true,
                sort: true,
                display: false,
                setCellHeaderProps: () => ({ 'data-cy': 'column-modified' })
            },
            property: 'modified'
        },
        {
            name: 'size',
            label: 'size',
            options: {
                filter: false,
                sort: false,
                display: false,
                setCellHeaderProps: () => ({ 'data-cy': 'column-size' })
            },
            property: 'size'
        }
    ],
    options: {
        filter: false,
        print: false,
        download: false,
        search: false,
        selectableRows: 'multiple',
        useCustomSelectableRows: true,
        dragndrop: true,
        filterType: 'dropdown',
        responsive: 'stackedFullWidth',
        serverSide: true,
        rowsPerPage: 25,
        rowsPerPageOptions: [25, 50, 100]
    }
};

export function getLabels(isSharedRepo: boolean) {
    return {
        body: {
            noMatch: isSharedRepo ? (
                <FormattedMessage {...messages.emptyNoFiles} />
            ) : (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '9em 0px',
                        opacity: 1
                    }}
                >
                    <img
                        src="/css/img/icons/drag-drop-helper.png"
                        alt=""
                        width="190"
                    />
                    <h1
                        style={{
                            color: '#d5d4d4',
                            fontSize: '1.4em',
                            marginTop: '1em',
                            fontWeight: 400
                        }}
                    >
                        <FormattedMessage {...messages.emptyDropFiles} />
                    </h1>
                </div>
            ),
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
    };
}
