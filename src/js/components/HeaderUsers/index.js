import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import * as theme from 'constants/Theme';
import MenuHeaderActions from 'components/MenuHeaderActions';
import TablePrintData from 'components/TablePrintData';

// Typography
import HeaderText from 'components/HeaderText';
import Button from 'components/Button';
import FilterTags from 'components/TagFilters';
import { renderTagValues } from 'constants/Filters';

type DefaultProps = {
    access: Object,
    intl: intlShape
};

type Props = {
    getExportData: Function,
    currentData: Object,
    onFilter: () => void,
    formName: string,
    formValues: Object,
    showHideColumns?: boolean
} & DefaultProps;

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
    },
    repo: {
        margin: '1em 0',
        '& > div': {
            padding: '1em .5em',
            borderBottom: '1px solid #e6e6e6'
        },
        '& .MuiTypography-root': {
            color: '#797979',
            fontSize: '1.2em',
            lineHeight: '1.75em',
            fontWeight: 300
        },
        '& .MuiTreeItem-iconContainer': {
            color: '#5f5f5f'
        }
    },
    input: {
        display: 'none'
    },
    line: {
        borderLeft: `1px solid ${theme.hue4}`,
        height: '20px'
    }
});

const HeaderUsers = (props: Props) => {
    const {
        getExportData,
        currentData,
        access,
        onFilter,
        formName,
        formValues,
        intl,
        showHideColumns
    } = props;
    const classes = useStyles();

    const [tags, setTags] = useState([]);

    useEffect(() => {
        setTags(renderTagValues(formName, formValues, intl));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues]);

    return (
        <Fragment>
            <HeaderText
                flat
                buttonsLeft={
                    access.sysAdmin
                        ? [
                            <Link key="left-1" to="/people/new">
                                <Button text="createNew" size="small" round />
                            </Link>
                        ]
                        : []
                }
                buttonsRight={[
                    <Button
                        key="right-1"
                        text="filters"
                        size="small"
                        color="grey0"
                        iconPosition="right"
                        icon={
                            <clr-icon
                                shape="filter-2"
                                size={18}
                                style={{
                                    position: 'relative',
                                    top: '1px'
                                }}
                            />
                        }
                        round
                        onClick={onFilter}
                    />,
                    <div key="right-2" className={classes.line} />,
                    <MenuHeaderActions
                        key="right-3"
                        direction="horizontal"
                        PrintComponent={TablePrintData}
                        rows={currentData ? currentData.rows : null}
                        columns={currentData ? currentData.columns : null}
                        getExportData={getExportData}
                        showHideColumns={showHideColumns}
                    />
                ]}
                buttonsBottom={[
                    <FilterTags key="bottom-1" border tags={tags} intl={intl} />
                ]}
                borderBottom
            />
        </Fragment>
    );
};

const mapStateToProps = state => ({
    access: state.access
});

export default injectIntl(connect(mapStateToProps)(HeaderUsers));
