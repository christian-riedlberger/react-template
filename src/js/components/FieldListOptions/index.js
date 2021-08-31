// @flow
import React, { useState, useEffect } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import { touch } from 'redux-form';
import { compose } from 'recompose';
import type { Node } from 'react';

import ListButtonOptions from 'components/ListButtonOptions';
import type { Option } from 'components/ListButtonOptions';
import * as theme from 'constants/Theme';
import messages from 'constants/Messages';
import { withFormName } from 'utils/form';

type DefaultProps = {
    intl: intlShape,
    formName: string
};

type Value = String;
type Props = {
    options: Array<Option>,
    input: {
        value: Value,
        name: string,
        onChange: Value => void,
        onFocus: () => void
    },
    meta?: {
        error: Node | string,
        touched: boolean
    }
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: '700px'
    },

    list: {
        width: '100%',
        height: '60vh',
        '& .MuiList-root': {
            height: '60vh'
        },
        '& .MuiDivider-root': {
            display: 'none'
        },
        '& .MuiListItem-root': {
            minHeight: '6em'
        }
    },
    search: {
        marginTop: '.5em',
        marginBottom: '1em'
    },
    select: {
        backgroundColor: theme.hue1
    },
    error: {
        color: theme.errorred,
        position: 'relative',
        top: -8,
        right: -11,
        backgroundColor: theme.white0,
        paddingLeft: 2,
        paddingRight: 2
    }
});

const FieldListOptions = (props: Props) => {
    // $FlowFixMe
    const { intl, options, input, meta, formName } = props;
    const classes = useStyles();
    const [term, setTerm] = useState('');

    useEffect(() => {
        if (meta && !meta.touched) {
            touch(formName, input.name);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formName, input.name]);

    const handleClick = (option: Object) => {
        input.onChange(option.nodeRef);
    };

    const translate = msg =>
        messages[msg] ? intl.formatMessage(messages[msg]) : `intl: ${msg}`;

    const filteredOptions = _.filter(options, req => {
        if (term.length > 0) {
            return req.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
        }
        return true;
    });

    const translatedOptions = _.map(filteredOptions, opt => ({
        ...opt,
        name: translate(opt.name),
        secondary: translate(opt.secondary)
    }));

    const error = meta && meta.error && meta.touched ? meta.error : null;
    return (
        <div className={classes.root}>
            <Grid>
                <Grid item className={error ? classes.itemRed : classes.item}>
                    <TextField
                        autoComplete="off"
                        value={term}
                        fullWidth
                        variant="outlined"
                        className={classes.search}
                        label={intl.formatMessage(messages.search)}
                        onChange={event => setTerm(event.target.value)}
                        InputProps={{
                            endAdornment:
                                term.length === 0 ? (
                                    <div className={classes.icon}>
                                        <clr-icon shape="search" />
                                    </div>
                                ) : (
                                    <IconButton onClick={() => setTerm('')}>
                                        <clr-icon shape="times" />
                                    </IconButton>
                                )
                        }}
                    />

                    <div
                        item
                        className={`${error ? classes.itemRed : classes.item} ${
                            classes.select
                        }`}
                    >
                        {error && (
                            <label className={classes.error}>{error}</label>
                        )}
                        <ListButtonOptions
                            onPrimaryClick={handleClick}
                            options={translatedOptions}
                            showSelected
                            className={classes.list}
                            initialSelected={_.find(options, {
                                nodeRef: input.value
                            })}
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default compose(
    injectIntl,
    withFormName
)(FieldListOptions);
