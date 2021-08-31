/* eslint-disable indent */
// @flow
import React, { Fragment, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import { injectIntl, intlShape } from 'react-intl';

import { fetchMyOrganizations } from 'actions/ActionOrganizations';
import type { Field } from 'types/formTypes';
import { grey0, grey1, errorred } from 'constants/Theme';
import type { Group as GroupType } from 'types/groupTypes';
import { getAvatarUrl } from 'utils/avatar';

type Group = GroupType & { id: string };

type DefaultProps = {
    intl: intlShape,
    classes: Object
} & Field;

type State = {
    selectedGroups: Group,
    resultsLoading: boolean,
    results: Array<Group>,
    isOpen: boolean
};

type Props = {
    defaultAuthorities?: Array<string>,
    label?: string,
    parentName?: string | Array<string>, // parentName | Array<parentName>
    type?: 'group' | 'user',
    showOrganizations?: boolean,
    multiple?: boolean,
    fullWidth?: boolean,
    readonly?: boolean,
    disabled: boolean,
    meta: Object
} & DefaultProps;

const styles = theme => ({
    errorText: {
        '& p': {
            paddingTop: '0px',
            color: theme.palette.error.dark
        }
    },
    errorSelector: () => {
        return {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: errorred
            },
            '& .MuiFormHelperText-root': {
                color: errorred
            }
        };
    },
    formWithHelp: {},
    icon: {
        'min-width': 30
    },
    iconSelect: {
        color: theme.palette.primary.light
    },
    divider: {
        padding: '2em 0 2em 0',
        '& span,div': {
            color: grey1
        }
    },
    dividerLine: props => ({
        width: props.fullWidth ? '27%' : '11%'
    }),
    loadingMessage: {
        color: grey1,
        float: 'left',
        paddingRight: 10
    },
    input: props => ({
        width: props.fullWidth ? 'inherit' : '20em'
    }),
    root: {
        '& .Mui-disabled': {
            color: grey0,
            borderColor: grey0
        },
        '& label': {
            backgroundColor: 'white'
        }
    }
});

@injectIntl
@withStyles(styles)
class FieldMyOrganizations extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedGroups: {},
            resultsLoading: false,
            results: [],
            isOpen: false
        };
    }

    componentDidMount() {
        fetchMyOrganizations()
            .payload.then(resp => {
                this.setState(
                    {
                        results: resp.data.data,
                        resultsLoading: false,
                        isOpen: false,
                        selectedGroups:
                            // eslint-disable-next-line promise/always-return
                            resp.data.data.length === 1 ? resp.data.data[0] : {}
                    },
                    this.updateField
                );
            })
            .catch(e => {
                throw e;
            });
    }

    updateField = () => {
        const {
            input: { onChange }
        } = this.props;
        const { selectedGroups } = this.state;
        onChange(selectedGroups.id);
    };

    handleClick = () => {
        const { disabled } = this.props;
        if (!disabled) this.setState({ isOpen: true });
    };

    handleSelect = (event: any, value: any) => {
        const { resultsLoading } = this.state;
        if (!resultsLoading && value) {
            this.setState(
                {
                    selectedGroups: value,
                    isOpen: false
                },
                this.updateField
            );
        }
    };

    handleClose = () => {
        this.setState({
            isOpen: false
        });
    };

    render() {
        const {
            meta: { touched, error },
            classes,
            fullWidth,
            label
        } = this.props;
        const { results, resultsLoading, selectedGroups, isOpen } = this.state;

        let helperText = null;
        if (touched && error) helperText = error;

        return (
            <div
                className={clsx(
                    touched && !!error && classes.errorSelector,
                    classes.root
                )}
            >
                <Autocomplete
                    data-cy="issuers"
                    open={isOpen}
                    options={results}
                    loading={resultsLoading}
                    getOptionLabel={option => option.displayName || ''}
                    classes={{
                        root: classes.authSearch,
                        inputRoot: classes.input
                    }}
                    onChange={this.handleSelect}
                    value={selectedGroups}
                    renderOption={option => (
                        <ListItem data-cy={option.displayName} component="div">
                            <ListItemIcon className={classes.icon}>
                                <Avatar
                                    style={{ marginRight: '17px' }}
                                    className={classes.avatar}
                                    src={getAvatarUrl({ shortName: option.id })}
                                    alt={`${option.displayName}`}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={option.displayName}
                                secondary={option.id}
                            />
                            <ListItemIcon className={classes.icon}>
                                <AddBoxIcon className={classes.iconSelect} />
                            </ListItemIcon>
                        </ListItem>
                    )}
                    renderInput={params => (
                        <TextField
                            {...params}
                            autoComplete="off"
                            fullWidth={fullWidth}
                            color="primary"
                            variant="outlined"
                            label={label}
                            value={selectedGroups}
                            helperText={helperText}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {resultsLoading ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={20}
                                            />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                )
                            }}
                        />
                    )}
                    renderTags={() => null}
                    onClose={this.handleClose}
                    onClick={this.handleClick}
                />
            </div>
        );
    }
}

export default FieldMyOrganizations;
