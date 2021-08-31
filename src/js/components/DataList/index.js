// @flow
import React from 'react';
import MUIDataTable from 'mui-datatables';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Loading from 'components/Loading';

type Props = {
    title: any,
    columns: Array<Object>,
    data: Array<string>,
    options: Object,
    isLoading: boolean
};

const DataList = (props: Props) => {
    const { title, data, columns, options, isLoading } = props;

    const tableOptions = {
        filterType: 'checkbox',
        ...options
    };

    if (isLoading)
        return (
            <Card>
                <CardContent>
                    <Loading size={60} thickness={1} height={600} />
                </CardContent>
            </Card>
        );

    return (
        <MUIDataTable
            options={tableOptions}
            title={title}
            data={data}
            columns={columns}
        />
    );
};

export default DataList;
