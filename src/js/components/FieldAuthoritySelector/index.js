// @flow
import _ from 'lodash';
import React, { Fragment, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { injectIntl, intlShape } from 'react-intl';
import Avatar from '@material-ui/core/Avatar';

import { fetchGroupsBrowse, fetchGroup } from 'actions/ActionGroups';
import messages from 'constants/Messages';
import type { Field } from 'types/formTypes';
import { DEBOUNCE_DELAY } from 'constants/Config';
import { grey0, grey1, errorred } from 'constants/Theme';
import type { Group as GroupType } from 'types/groupTypes';
import { getAvatarUrl } from 'utils/avatar';

type Group = GroupType & { isHover?: boolean };
type DefaultProps = {
    intl: intlShape,
    input: Object,
    classes: Object
} & Field;

type State = {
    selectedGroups: Array<Group> | Group | string,
    tmp: string,
    resultsLoading: boolean,
    results: Array<Group>,
    groupsLoading: boolean,
    isOpen: boolean,
    initialValue: string
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
    meta: Object,
    classes: Object,
    initialValue: string
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
    },
    listbox: {
        overflowY: 'auto !important',
        overflowX: 'hidden !important'
    }
});

const getIcon = (group: GroupType) => {
    let rowIcon = (
        <PersonIcon fontSize="small" style={{ marginRight: '17px' }} />
    );

    if (_.get(group, 'fullName', '').indexOf('GROUP_') > -1) {
        rowIcon = (
            <GroupIcon fontSize="small" style={{ marginRight: '17px' }} />
        );
    }
    if (_.get(group, 'shortName', '').indexOf('_ORGANIZATION') > -1) {
        rowIcon = (
            <Avatar
                src={getAvatarUrl(group)}
                alt={group.displayName}
                style={{ marginRight: '17px' }}
            />
        );
    }
    return rowIcon;
};

/**
 * @container FormRequest
 * @description
 */
@injectIntl
@withStyles(styles)
class FieldAuthoritySelector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedGroups: props.multiple ? [] : {},
            tmp: '',
            resultsLoading: false,
            results: [],
            groupsLoading: false,
            isOpen: false,
            initialValue: ''
        };
    }

    componentDidMount() {
        const {
            parentName,
            showOrganizations,
            type,
            input,
            initialValue
        } = this.props;
        const parentNames = _.castArray(parentName);

        // get the initial value to display by priority: 1. value set using component(input.value) 2. initialValue prop(shortName: string) 3. default empty string
        let mountValue = '';
        if (input.value) {
            mountValue = input.value;
        } else if (initialValue && initialValue.length > 0) {
            mountValue = initialValue;
            input.onChange(initialValue);
        }
        // eslint-disable-next-line compat/compat
        Promise.all(
            _.map(
                parentNames,
                name =>
                    fetchGroupsBrowse({
                        type,
                        parentName: name,
                        filterOnParent: name,
                        isOrganization: showOrganizations
                    }).payload
            )
        )
            .then(responses => {
                const groups = _.concat(
                    ..._.map(responses, resp => resp.data.data)
                );
                const initGroup = _.find(groups, g => {
                    return g.shortName === mountValue;
                });
                this.setState({
                    results: _.uniqBy(groups, 'shortName'),
                    resultsLoading: false,
                    isOpen: false,
                    initialValue: _.isObject(initGroup)
                        ? initGroup.displayName
                        : ''
                });
                return true;
            })
            .catch(e => {
                throw e;
            });
    }

    componentDidUpdate(prevProps: Props) {
        const { defaultAuthorities, input, multiple } = this.props;
        if (
            defaultAuthorities &&
            !_.isEqual(prevProps.defaultAuthorities, defaultAuthorities)
        ) {
            // eslint-disable-next-line
            this.setState({ groupsLoading: true }, () => {
                fetchGroup(defaultAuthorities)
                    .payload.then(resp =>
                        this.setState({
                            groupsLoading: false,
                            selectedGroups: _.castArray(resp.data.data),
                            isOpen: false
                        })
                    )
                    .catch(e => {
                        throw e;
                    });
            });
        }

        // Update for reset button click
        if (
            !_.isEqual(prevProps.input.value, input.value) &&
            input.value === ''
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                selectedGroups: multiple ? [] : {},
                initialValue: ''
            });
        }
    }

    handleClick = () => {
        const { disabled } = this.props;
        if (!disabled) this.setState({ isOpen: true });
    };

    debouncedSearch = _.debounce((event, input) => {
        this.handleSearch(event, input);
    }, DEBOUNCE_DELAY);

    handleSearch = (event: Object, value: string) => {
        const { parentName, showOrganizations, type } = this.props;
        this.setState({ resultsLoading: true }, () => {
            const parentNames = _.castArray(parentName);
            // eslint-disable-next-line compat/compat
            Promise.all(
                _.map(
                    parentNames,
                    name =>
                        fetchGroupsBrowse({
                            type,
                            term: value,
                            parentName: name,
                            isOrganization: showOrganizations,
                            keepParent: true
                        }).payload
                )
            )
                .then(responses =>
                    this.setState({
                        results: _.uniqBy(
                            _.concat(
                                ..._.map(responses, resp => resp.data.data)
                            ),
                            'shortName'
                        ),
                        resultsLoading: false
                    })
                )
                .catch(e => {
                    throw e;
                });
        });
    };

    updateField = () => {
        const {
            input: { onChange },
            multiple
        } = this.props;
        const { selectedGroups } = this.state;

        const newValue = multiple
            ? _.map(selectedGroups, 'shortName')
            : // $FlowFixMe
            selectedGroups.shortName;
        onChange(newValue);
    };

    handleSelect = (event: SyntheticEvent, value: Group) => {
        const { resultsLoading } = this.state;
        if (!resultsLoading && value) {
            const { multiple } = this.props;
            const { selectedGroups } = this.state;

            const newGroups = multiple
                ? _.concat(selectedGroups, value)
                : value;
            this.setState(
                {
                    selectedGroups: newGroups,
                    isOpen: false
                },
                this.updateField
            );
        }
    };

    handleClose = () => {
        this.setState({
            isOpen: false,
            tmp: ''
        });
    };

    handleRemove = (group: Group) => {
        const { selectedGroups } = this.state;
        const newGroups = _.reject(selectedGroups, {
            fullName: group.fullName
        });
        this.setState(
            {
                selectedGroups: newGroups
            },
            this.updateField
        );
    };

    handleEnter = (hoverGroup: Group) => {
        const { disabled } = this.props;
        if (!disabled) {
            this.setState(state => ({
                ...state,
                selectedGroups: _.map(state.selectedGroups, group =>
                    group.fullName === hoverGroup.fullName
                        ? { ...group, isHover: true }
                        : { ...group, isHover: false }
                )
            }));
        }
    };

    handleLeave = () => {
        const { disabled } = this.props;
        if (!disabled) {
            this.setState(state => ({
                ...state,
                selectedGroups: _.map(state.selectedGroups, group => ({
                    ...group,
                    isHover: false
                }))
            }));
        }
    };

    renderSelected = () => {
        const { intl, classes, disabled } = this.props;
        const { groupsLoading, selectedGroups } = this.state;

        const dividerLabel = intl.formatMessage(messages.youAdded, {
            // $FlowFixMe
            count: selectedGroups.length
        });

        return (
            <Fragment>
                <Grid
                    container
                    item
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                    className={classes.divider}
                >
                    <Divider className={classes.dividerLine} />
                    <Grid item>
                        {groupsLoading ? (
                            <Fragment>
                                <div className={classes.loadingMessage}>
                                    {intl.formatMessage(messages.groupsLoading)}
                                </div>
                                <CircularProgress color="inherit" size={20} />
                            </Fragment>
                        ) : (
                            <div>{dividerLabel}</div>
                        )}
                    </Grid>
                    <Divider className={classes.dividerLine} />
                </Grid>
                <List>
                    {_.map(selectedGroups, (group: Group) => (
                        <ListItem
                            key={group.fullName}
                            button
                            disabled={!!disabled}
                            onClick={() => this.handleRemove(group)}
                            onMouseEnter={() => this.handleEnter(group)}
                            onMouseLeave={() => this.handleLeave()}
                            className={classes.selectedGroupsList}
                        >
                            <ListItemIcon className={classes.icon}>
                                {getIcon(group)}
                            </ListItemIcon>
                            <ListItemText
                                primary={group.displayName}
                                secondary={group.shortName}
                            />
                            <ListItemIcon className={classes.icon}>
                                <CancelOutlinedIcon
                                    className={clsx(
                                        group.isHover && classes.iconSelect
                                    )}
                                />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        );
    };

    render() {
        const {
            // $FlowFixMe
            meta,
            classes,
            multiple,
            fullWidth,
            label,
            disabled
        } = this.props;
        const {
            results,
            resultsLoading,
            selectedGroups,
            tmp,
            isOpen,
            initialValue
        } = this.state;

        let helperText = null;
        if (meta && meta.touched && meta.error) helperText = meta.error;

        return (
            <div
                className={clsx(
                    meta.touched && !!meta.error && classes.errorSelector,
                    classes.root
                )}
            >
                <Autocomplete
                    data-cy="issuers"
                    key={initialValue}
                    open={isOpen}
                    disabled={disabled}
                    options={results}
                    loading={resultsLoading}
                    getOptionLabel={option =>
                        option.displayName || initialValue
                    }
                    getOptionDisabled={option =>
                        multiple
                            ? Boolean(
                                _.find(selectedGroups, {
                                    shortName: option.shortName
                                })
                            )
                            : // $FlowFixMe
                            option.shortName === tmp
                    }
                    classes={{
                        root: classes.authSearch,
                        inputRoot: classes.input,
                        listbox: classes.listbox
                    }}
                    onChange={this.handleSelect}
                    value={multiple ? tmp : selectedGroups}
                    onInputChange={this.debouncedSearch}
                    renderOption={option => (
                        <ListItem data-cy={option.displayName} component="div">
                            <ListItemIcon className={classes.icon}>
                                {getIcon(option)}
                            </ListItemIcon>
                            <ListItemText
                                primary={option.displayName}
                                secondary={option.shortName}
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
                            key={initialValue}
                            fullWidth={fullWidth}
                            color="primary"
                            variant="outlined"
                            label={label}
                            value={multiple ? tmp : selectedGroups}
                            helperText={helperText}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {resultsLoading && isOpen ? (
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
                <div className={classes.input}>
                    {multiple && this.renderSelected()}
                </div>
            </div>
        );
    }
}

export default FieldAuthoritySelector;
