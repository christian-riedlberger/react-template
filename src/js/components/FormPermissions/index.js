// @flow
import React, { Component } from 'react';
import { mapProps } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Field, reduxForm, Form } from 'redux-form';
import _ from 'lodash';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import DeleteIcon from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
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
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import RepoContainer from 'containers/RepoContainer';
import MessageContainer from 'containers/MessageContainer';
import { renderHiddenField, renderCheckbox } from 'constants/FormFields';
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
import { getAvatarUrl } from 'utils/avatar';

import { AVATAR } from 'constants/ServiceURI';

type DefaultProps = {
    errors: Array<string> | null,
    submitFailed: boolean,
    submitting: boolean,
    handleSubmit: Function | null,
    intl: intlShape,
    isLoadingPermission: boolean,
    initialValues?: Object,
    error?: string,
    showMessage: Function,
    classes: Object
};

export const FormName = 'perissionsForm';

type Props = {
    nodeRef: string,
    onSuccess: Function,
    initialValues: Object,
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
    results: Array<Object>,
    showInherited: boolean
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
        height: '14em',
        display: 'inline-block',
        padding: '3px 0px',
        maxHeight: '26em',
        overflow: 'auto'
    },
    directTitle: {
        marginTop: '.75em',
        fontSize: '1em',
        fontWeight: 400,
        paddingBottom: '.75em'
    },
    inheritedList: {
        width: '40em',
        height: 'auto',
        display: 'inline-block',
        padding: '0.5em 0 3em 0',
        maxHeight: '6em',
        overflow: 'auto'
    },
    permissionRow: {
        display: 'flex',
        '& .MuiListItemText-root': {
            flex: 'inherit'
        }
    },
    authorityName: {
        flexGrow: '1!important'
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
        alignItems: 'center',
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
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        marginRight: '.5em'
    }
});

// (values: Object) => { ... }
const validate = () => {
    const errors = {};
    return errors;
};

@withStyles(styles)
@RepoContainer({ permissionRef: (props: Props) => props.nodeRef })
@MessageContainer()
@mapProps((props: Props) => ({
    ...props,
    initialValues: {
        ...props.activePermission,
        isInherited: _.get(
            props,
            'activePermission.isInherited',
            DEFAULT_INHERIT_PERMISSIONS
        ),
        inherited: _.map(_.get(props, 'activePermission.inherited', []), p => ({
            ...p,
            displayName: _.get(p, 'authority.displayName'),
            fullName: _.get(p, 'authority.name'),
            inherited: true
        })),
        permissions: _.map(_.get(props, 'activePermission.direct', []), p => ({
            ...p,
            displayName: _.get(p, 'authority.displayName'),
            fullName: _.get(p, 'authority.name'),
            inherited: false
        }))
    }
}))
@reduxForm({
    form: FormName,
    enableReinitialize: true,
    validate
})
@injectIntl
@connect(state => ({ formValues: state.form[FormName].values }))
class FormPermissions extends Component<Props, State> {
    labelRefs: Array<string>;

    static defaultProps: DefaultProps = {
        intl: {},
        classes: {},
        errors: null,
        showMessage: () => {},
        isLoadingPermission: false,
        submitFailed: false,
        submitting: false,
        handleSubmit: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            selectedAuthority: null,
            permissions: [],
            searchedAuth: null,
            isLoading: false,
            results: [],
            showInherited: false
        };

        this.labelRefs = [];
    }

    componentDidUpdate(prevProps: Props) {
        const { initialValues } = this.props;
        if (
            !_.isEqual(
                _.get(prevProps, 'initialValues.permissions'),
                _.get(initialValues, 'permissions')
            )
        ) {
            // eslint-disable-next-line
            this.setState({ permissions: initialValues.permissions });
        }
    }

    getIcon = (group: GroupType) => {
        const { classes } = this.props;
        let rowIcon = (
            <Avatar
                className={classes.avatar}
                src={AVATAR(group.fullName)}
                alt={group.fullName}
            />
        );

        if (_.get(group, 'fullName', '').indexOf('GROUP_') > -1) {
            rowIcon = (
                <Avatar className={classes.avatar}>
                    <GroupIcon fontSize="small" />
                </Avatar>
            );
        }
        if (_.get(group, 'fullName', '').indexOf('_ORGANIZATION') > -1) {
            rowIcon = (
                <Avatar
                    className={classes.avatar}
                    src={getAvatarUrl({
                        ...group,
                        shortName: _.get(group, 'fullName', '').replace('GROUP_', '')
                    })}
                    alt={group.displayName}
                />
            );
        }
        return rowIcon;
    };

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
                        role: DEFAULT_PERMISSION_ROLE,
                        inherited: false
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

    handleShowInherited = () => {
        this.setState({
            ...this.state,
            showInherited: !this.state.showInherited
        });
    };

    onSubmit = () => {
        const {
            updatePermission,
            formValues,
            onSuccess,
            dispatch,
            showMessage
        } = this.props;
        const { permissions } = this.state;
        showMessage({
            message: 'permissionsUpdating',
            variant: 'pending'
        });

        updatePermission({
            userName: localStorage.getItem('auth:username'),
            activeOrg: localStorage.getItem('org:active'),
            nodeRef: formValues.nodeRef,
            isInherited: formValues.isInherited,
            permission: _.map(permissions, p => ({
                role: _.upperFirst(p.role),
                fullName: p.fullName
            }))
        })
            .then(resp => {
                const { status, message } = resp.value.data;
                if (status !== 200 && status.code !== 200) {
                    dispatch({
                        type: '@@redux-form/UPDATE_SYNC_ERRORS',
                        meta: { form: FormName },
                        payload: {
                            error: message.split(':').slice(-1)[0],
                            syncErrors: {}
                        }
                    });
                    return null;
                }
                showMessage({
                    message: 'permissionsUpdated',
                    variant: 'success'
                });
                return onSuccess(formValues);
            })
            .catch(e => {
                throw e;
            });
    };

    renderListItem = (row: Object, index: number) => {
        const { classes, intl } = this.props;

        return row.inherited ? (
            <ListItem
                button
                divider
                data-cy={`list-${row.shortName}`}
                key={`permisson-authorities-${row.nodeRef || row.fullName}`}
                className={classes.permissionRow}
            >
                <ListItemIcon className={classes.icon}>
                    {this.getIcon(row)}
                </ListItemIcon>
                <ListItemText
                    primary={getReservedOrgName(row.displayName, intl)}
                    className={classes.authorityName}
                />
                <ListItemText
                    classes={{ root: classes.inheritedRole }}
                    ref={r => {
                        if (r) this.labelRefs[index] = r;
                    }}
                    secondary={intl.formatMessage(
                        messages[row.role.toLowerCase()]
                    )}
                />
            </ListItem>
        ) : (
            <ListItem
                button
                divider
                data-cy={`list-${row.shortName}`}
                key={`permisson-authorities-${row.nodeRef || row.fullName}`}
                onClick={() => this.handleAuthorityClick(row, index)}
                className={classes.permissionRow}
            >
                <ListItemIcon className={classes.icon}>
                    {this.getIcon(row)}
                </ListItemIcon>
                <ListItemText
                    primary={getReservedOrgName(row.displayName, intl)}
                    className={classes.authorityName}
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
     * Render the list of inherited permissions
     */
    renderInheritedPermissions = () => {
        const { classes, intl, formValues } = this.props;

        return (
            <Grid item>
                <List
                    className={clsx(classes.inheritedList, classes.listPaper)}
                >
                    {_.map(formValues.inherited, this.renderListItem)}
                </List>

                <Typography variant="body1" className={classes.directTitle}>
                    {intl.formatMessage(messages.directPermissions)}
                </Typography>
            </Grid>
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
                        icon: this.getIcon(r)
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
                            autoFocus
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
        const {
            classes,
            intl,
            isLoadingPermission,
            error,
            formValues
        } = this.props;
        const { showInherited } = this.state;

        return (
            <Form
                onSubmit={this.onSubmit}
                className={classes.root}
                autoComplete="off"
            >
                <Field component={renderHiddenField} name="nodeRef" />
                <Grid container direction="column" spacing={4}>
                    {error && (
                        <Grid item className="serverError" xs={12}>
                            {error}
                        </Grid>
                    )}

                    {isLoadingPermission && (
                        <Grid item className={classes.loading}>
                            <CircularProgress color="inherit" size={30} />
                        </Grid>
                    )}

                    {!isLoadingPermission && (
                        <Grid item>
                            <Grid item>
                                <div
                                    style={{
                                        display: 'flex',
                                        marginBottom: '.5em',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Field
                                        name="isInherited"
                                        help="inheritPermissionsHelp"
                                        component={renderCheckbox}
                                        label={intl.formatMessage(
                                            messages.inheritPermissions
                                        )}
                                    />
                                    {formValues.isInherited && (
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={showInherited}
                                                        onChange={
                                                            this
                                                                .handleShowInherited
                                                        }
                                                        name="checkedA"
                                                        inputProps={{
                                                            'aria-label':
                                                                'secondary checkbox'
                                                        }}
                                                    />
                                                }
                                                label={intl.formatMessage(
                                                    messages.inheritPermissionsShow
                                                )}
                                            />
                                        </FormGroup>
                                    )}
                                </div>
                            </Grid>
                            {showInherited &&
                                formValues.isInherited &&
                                this.renderInheritedPermissions()}
                            {this.renderAuthoritySearch()}
                            {this.renderPermissionsList()}
                        </Grid>
                    )}
                </Grid>
            </Form>
        );
    }
}

export default FormPermissions;
