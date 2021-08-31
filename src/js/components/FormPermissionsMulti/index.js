// @flow
import React, { Component } from 'react';
import { mapProps } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { reduxForm, Form } from 'redux-form';
import _ from 'lodash';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import RepoContainer from 'containers/RepoContainer';
import MessageContainer from 'containers/MessageContainer';
import {
    DEFAULT_INHERIT_PERMISSIONS,
    DEFAULT_PERMISSION_ROLE,
    DEBOUNCE_DELAY,
    AUTHORITY_ROLES
} from 'constants/Config';
import messages from 'constants/Messages';
import { green } from 'constants/Theme';
import { camelize, getReservedOrgName } from 'utils/string';
import type { Group as GroupType } from 'types/groupTypes';
import { fetchGroupsBrowse } from 'actions/ActionGroups';

type DefaultProps = {
    errors: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
    intl: intlShape,
    initialValues: Object,
    error?: string,
    showMessage: Function,
    classes: Object
};

export const FormName = 'perissionsForm';

type Props = {
    nodeRefs: Array<string>,
    onSuccess: Function,
    updatePermission: Object,
    formValues: Object,
    dispatch: Function,
    activePermission: Object,
    activeFolder: Object
} & DefaultProps;

type State = {
    selectedAuthority: null | GroupType,
    permissions: Array<Object>,
    searchedAuth: string | null,
    isLoading: boolean,
    results: Array<Object>
};

const styles = theme => ({
    root: {
        paddingBottom: '16px',
        '& .Mui-item': {
            padding: '6px 16px'
        },
        '& .cy-autocomplete-endAdornment .MuiAutocomplete-endAdornment': {
            right: 7
        }
    },
    permissionsList: {
        height: '25em'
    },
    icon: {
        'min-width': 30
    },
    listPaper: {
        border: '1px solid #cbcbcb',
        borderRadius: 4
    },
    list: {
        width: '40em',
        height: '20em',
        display: 'inline-block',
        padding: '3px 0px',
        maxHeight: '26em',
        overflow: 'auto'
    },
    listDropdown: {
        borderBottom: `1px solid ${theme.palette.grey[500]}`,
        width: '6em',
        float: 'right'
    },
    authSearch: {
        width: '40em'
    },
    optionLine: {
        display: 'flex',
        lineHeight: '15px'
    },
    loading: {
        width: '40em',
        height: '20em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: green
    }
});

// (values: Object) => { ... }
const validate = () => {
    const errors = {};
    return errors;
};

@withStyles(styles)
@RepoContainer()
@MessageContainer()
@mapProps((props: Props) => ({
    ...props,
    initialValues: {
        permissions: []
    }
}))
@reduxForm({
    form: FormName,
    enableReinitialize: true,
    validate
})
@injectIntl
@connect(state => ({ formValues: state.form[FormName].values }))
class FormPermissionsMulti extends Component<Props, State> {
    labelRefs: Array<string>;

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedAuthority: null,
            permissions: [],
            searchedAuth: null,
            isLoading: false,
            results: []
        };

        this.labelRefs = [];
    }

    // (row: OPTION_TYPE, index: number, event: Object) => {...}
    handleAuthorityClick = (auth: GroupType, index: number) => {
        this.setState({
            selectedAuthority: {
                ...auth,
                index
            }
        });
    };

    handleAuthorityClose = () => {
        this.setState({
            selectedAuthority: null
        });
    };

    // (auth: GroupType, index: number) => {...}
    handleAuthorityDelete = (auth: GroupType) => {
        this.setState(({ permissions }) => ({
            permissions: _.reject(permissions, {
                fullName: auth.fullName
            })
        }));
    };

    handleAuthorityChange = (newRole: string) => {
        this.setState(({ permissions, selectedAuthority }) => ({
            permissions: _.map(permissions, p => {
                // $FlowFixMe
                if (p.fullName === selectedAuthority.fullName) {
                    return { ...p, role: newRole };
                }
                return p;
            })
        }));

        this.setState({
            selectedAuthority: null
        });
    };

    // (event: React.SyntheticEvent, value: Object) => { ... }
    handleSelect = (event: Object, value: string) => {
        if (value)
            this.setState(
                state => ({
                    permissions: _.concat(state.permissions, {
                        ...value,
                        role: DEFAULT_PERMISSION_ROLE
                    }),
                    searchedAuth: value
                }),
                () => {
                    setTimeout(() => {
                        this.setState({
                            searchedAuth: null
                        });
                    });
                }
            );
    };

    debouncedSearch = _.debounce((event, value) => {
        this.handleSearch(event, value);
    }, DEBOUNCE_DELAY);

    handleSearch = (event: Object, value: string) => {
        this.setState({ isLoading: true }, () => {
            fetchGroupsBrowse({ term: value })
                .payload.then(resp => {
                    return this.setState({
                        results: resp.data.data,
                        isLoading: false
                    });
                })
                .catch(e => {
                    throw e;
                });
        });
    };

    onSubmit = () => {
        const {
            updatePermission,
            formValues,
            onSuccess,
            dispatch,
            activeFolder,
            showMessage,
            nodeRefs
        } = this.props;
        const { permissions } = this.state;
        showMessage({
            message: 'permissionsUpdating',
            variant: 'pending'
        });

        // eslint-disable-next-line compat/compat
        Promise.all(
            _.map(nodeRefs, nodeRef =>
                updatePermission({
                    userName: localStorage.getItem('auth:username'),
                    activeOrg: localStorage.getItem('org:active'),
                    breadcrumb: activeFolder.breadcrumb,
                    nodeRef,
                    isInherited: DEFAULT_INHERIT_PERMISSIONS,
                    permission: _.map(permissions, p => ({
                        role: _.upperFirst(p.role),
                        fullName: p.fullName
                    })),
                    append: true
                })
            )
        )
            .then(responses => {
                // check all status codes === 200
                const respStatus = _.map(
                    responses,
                    r => _.get(r, 'value.data.status') === 200
                );
                if (_.every(respStatus)) {
                    showMessage({
                        message: 'permissionsUpdated',
                        variant: 'success'
                    });
                    return onSuccess(formValues);
                }

                // format error messge
                const respMessages = _.map(
                    responses,
                    r =>
                        _.get(r, 'value.data.message', '')
                            .split(':')
                            .slice(-1)[0]
                ).join(', ');

                dispatch({
                    type: '@@redux-form/UPDATE_SYNC_ERRORS',
                    meta: { form: FormName },
                    payload: {
                        error: respMessages,
                        syncErrors: {}
                    }
                });
                return null;
            })
            .catch(e => {
                throw e;
            });
    };

    renderListItem = (row: Object, index: number) => {
        const { classes, intl } = this.props;
        const rowIcon =
            _.get(row, 'fullName', '').indexOf('GROUP') > -1 ? (
                <GroupIcon fontSize="small" style={{ marginRight: '17px' }} />
            ) : (
                <PersonIcon fontSize="small" style={{ marginRight: '17px' }} />
            );

        return (
            <ListItem
                button
                divider
                data-cy={`list-${row.shortName}`}
                key={`permisson-authorities-${row.nodeRef || row.fullName}`}
                onClick={() => this.handleAuthorityClick(row, index)}
            >
                <ListItemIcon className={classes.icon}>
                    {row.icon ? row.icon : rowIcon}
                </ListItemIcon>
                <ListItemText
                    primary={getReservedOrgName(row.displayName, intl)}
                />
                <ListItemText
                    classes={{ root: classes.listDropdown }}
                    ref={r => {
                        if (r) this.labelRefs[index] = r;
                    }}
                    secondary={intl.formatMessage(
                        messages[row.role.toLowerCase()]
                    )}
                />
                <ArrowDropDownIcon />
                <ListItemSecondaryAction>
                    <IconButton
                        edge="end"
                        aria-label={intl.formatMessage(messages.delete)}
                        onClick={() => this.handleAuthorityDelete(row)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    };

    /**
     *  Render the list of permissions
     */
    renderPermissionsList = () => {
        const { classes, intl } = this.props;
        const { selectedAuthority, permissions } = this.state;

        return (
            <Grid item>
                <List className={clsx(classes.list, classes.listPaper)}>
                    {_.map(permissions, this.renderListItem)}
                </List>
                <Menu
                    keepMounted
                    className={classes.root}
                    open={!!selectedAuthority}
                    onClose={this.handleAuthorityClose}
                    anchorEl={
                        selectedAuthority
                            ? // $FlowFixMe
                            this.labelRefs[selectedAuthority.index]
                            : null
                    }
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    getContentAnchorEl={null}
                >
                    {_.map(AUTHORITY_ROLES, r => (
                        <MenuItem
                            className={`cy-${r}`}
                            key={`menu-auth-roles-${r.toLowerCase()}`}
                            onClick={() =>
                                this.handleAuthorityChange(camelize(r))
                            }
                        >
                            {messages[r]
                                ? intl.formatMessage(messages[r])
                                : r.toLowerCase()}
                        </MenuItem>
                    ))}
                </Menu>
            </Grid>
        );
    };

    /**
     *  Render the search
     */
    renderAuthoritySearch = () => {
        const { classes, intl, activePermission } = this.props;
        const { isLoading, searchedAuth, permissions, results } = this.state;
        return (
            <Grid
                item
                style={{ paddingTop: 0, paddingBottom: 0, marginBottom: '1em' }}
            >
                <Autocomplete
                    options={_.map(results, r => ({
                        ...r,
                        icon:
                            r.authorityType === 'GROUP' ? (
                                <GroupIcon
                                    fontSize="small"
                                    style={{ marginRight: '17px' }}
                                />
                            ) : (
                                <PersonIcon
                                    fontSize="small"
                                    style={{ marginRight: '17px' }}
                                />
                            )
                    }))}
                    loading={isLoading}
                    getOptionLabel={o => o.displayName} // ignored prop due to `renderOption`, but it throws a warning without it
                    getOptionDisabled={option =>
                        Boolean(
                            _.find(permissions, {
                                shortName: option.shortName
                            })
                        )
                    }
                    classes={{ root: classes.authSearch }}
                    onChange={this.handleSelect}
                    onInputChange={this.debouncedSearch}
                    value={searchedAuth}
                    renderOption={option => (
                        <span
                            className={classes.optionLine}
                            data-cy={`option-${option.shortName}`}
                        >
                            {option.icon}
                            {getReservedOrgName(option.displayName, intl)}
                        </span>
                    )}
                    renderInput={params => (
                        <TextField
                            {...params}
                            autoComplete="off"
                            fullWidth
                            variant="outlined"
                            onKeyDown={e => e.stopPropagation()}
                            label={intl.formatMessage(messages.addAuthority, {
                                name: _.get(activePermission, 'name', 'folder')
                            })}
                            InputProps={{
                                ...params.InputProps,
                                className: 'cy-autocomplete',
                                endAdornment: (
                                    <div className="cy-autocomplete-endAdornment">
                                        {isLoading ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={20}
                                            />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                    </div>
                                )
                            }}
                        />
                    )}
                />
            </Grid>
        );
    };

    render() {
        const { classes, error } = this.props;

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                <Grid container direction="column" spacing={4}>
                    {error && (
                        <Grid item className="serverError" xs={12}>
                            {error}
                        </Grid>
                    )}

                    <Grid item container>
                        {this.renderAuthoritySearch()}
                        {this.renderPermissionsList()}
                    </Grid>
                </Grid>
            </Form>
        );
    }
}

export default FormPermissionsMulti;
