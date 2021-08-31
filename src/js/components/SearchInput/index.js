// @flow
import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { intlShape, injectIntl } from 'react-intl';
import messages from 'constants/Messages';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

type DefaultProps = { intl: intlShape, classes: Object };
type Props = {
    bordered: boolean, // eslint-disable-line
    onSearch: Function,
    value?: string
} & DefaultProps;

const styles = {
    root: prop => {
        const bordered = !prop.bordered
            ? {}
            : {
                boxShadow: 'none',
                border: '1px solid #72cbf3'
            };

        return {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            marginTop: '1em',
            ...bordered
        };
    },
    input: {
        marginLeft: 8,
        flex: 1
    },
    iconButton: {
        padding: 10
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4
    }
};

function SearchInput(props: Props) {
    const { onSearch, classes, intl, value } = props;
    const [values, setValues] = useState({
        term: value || ''
    });

    useEffect(() => {
        setValues({ ...values, term: value });
    }, [value]);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    return (
        <Paper className={classes.root}>
            <InputBase
                className={classes.input}
                placeholder={intl.formatMessage(messages.placeholderSearch)}
                inputProps={{ 'aria-label': 'search' }}
                value={values.term}
                onChange={handleChange('term')}
                onKeyPress={ev => {
                    if (ev.key === 'Enter') {
                        onSearch(values.term);
                        ev.preventDefault();
                    }
                }}
            />
            <IconButton
                className={classes.iconButton}
                aria-label="search"
                onClick={() => {
                    onSearch(values.term);
                }}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default withStyles(styles)(injectIntl(SearchInput));
