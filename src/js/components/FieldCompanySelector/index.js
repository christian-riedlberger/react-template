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
import AddBoxIcon from '@material-ui/icons/AddBox';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { injectIntl, intlShape } from 'react-intl';

import { fetchOrganizations, fetchGroup } from 'actions/ActionGroups';
import messages from 'constants/Messages';
import type { Field } from 'types/formTypes';
import { AVATAR } from 'constants/ServiceURI';
import { DEBOUNCE_DELAY } from 'constants/Config';
import { grey0, grey1, errorred } from 'constants/Theme';
import type { Group } from 'types/groupTypes';
import { getAvatarUrl } from 'utils/avatar';

type DefaultProps = {
    intl: intlShape,
    classes: Object
} & Field;

type State = {
    selectedGroups: Array<Group> | Group,
    selectedValue: string,
    resultsLoading: boolean,
    results: Array<Group>,
    groupsLoading: boolean,
    isOpen: boolean,
    inputValue: string
};

type Props = {
    defaultCompanies?: Array<string>,
    label?: string,
    multiple?: boolean,
    fullWidth?: boolean,
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

const getIcon = (classes, group) =>
    group.authorityType === 'GROUP' ? (
        <Avatar
            style={{ marginRight: '17px' }}
            className={classes.avatar}
            src={getAvatarUrl(group)}
            alt={`${group.displayName}`}
        />
    ) : (
        <Avatar
            style={{ marginRight: '17px' }}
            className={classes.avatar}
            src={AVATAR(group.shortName)}
            alt={group.shortName}
        />
    );

/**
 * @container FormRequest
 * @description
 */
@injectIntl
@withStyles(styles)
class FieldCompanySelector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedGroups: props.multiple ? [] : {},
            selectedValue: '',
            resultsLoading: false,
            results: [],
            groupsLoading: false,
            isOpen: false,
            inputValue: ''
        };
    }

    componentDidMount() {
        const { defaultCompanies } = this.props;
        if (_.isEmpty(defaultCompanies)) {
            // eslint-disable-next-line compat/compat
            this.defaultSearch();
        }
    }

    componentDidUpdate(prevProps: Props) {
        // $FlowFixMe
        const { defaultCompanies, multiple } = this.props;

        if (!_.isEqual(prevProps.defaultCompanies, defaultCompanies)) {
            // eslint-disable-next-line
            this.setState({ groupsLoading: true }, () => {
                fetchGroup(defaultCompanies)
                    .payload.then(resp =>
                        this.setState({
                            selectedGroups: multiple
                                ? _.castArray(resp.data.data)
                                : resp.data.data,
                            isOpen: false
                        })
                    )
                    .catch(e => {
                        throw e;
                    });
            });
        }
    }

    handleClick = () => {
        this.setState({ isOpen: true });
    };

    debouncedSearch = _.debounce((event, value) => {
        this.handleSearch(event, value);
    }, DEBOUNCE_DELAY);

    handleSearch = (event: Object, value: string) => {
        const { groupsLoading } = this.state;
        if (value && !groupsLoading) {
            this.setState({ resultsLoading: true }, () => {
                fetchOrganizations({
                    term: value
                })
                    .payload.then(resp =>
                        this.setState({
                            results: resp.data.data,
                            resultsLoading: false
                        })
                    )
                    .catch(e => {
                        throw e;
                    });
            });
        } else if (groupsLoading) {
            this.setState({ groupsLoading: false, isOpen: false });
        } else {
            this.defaultSearch();
        }
    };

    defaultSearch = () => {
        // eslint-disable-next-line compat/compat
        fetchOrganizations({
            term: ''
        })
            .payload.then(resp =>
                this.setState({
                    results: resp.data.data,
                    resultsLoading: false,
                    isOpen: false
                })
            )
            .catch(e => {
                throw e;
            });
    };

    updateField = () => {
        const {
            input: { onChange },
            multiple
        } = this.props;
        const { selectedGroups } = this.state;
        let newValue;
        if (multiple && _.isArray(selectedGroups)) {
            newValue = _.map(selectedGroups, 'shortName');
        } else {
            // $FlowFixMe
            newValue = selectedGroups.shortName;
        }

        onChange(newValue);
    };

    handleSelect = (event: any, value: any) => {
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
                    inputValue: '',
                    isOpen: false
                },
                this.updateField
            );
        }
    };

    handleClose = () => {
        this.setState({
            isOpen: false,
            selectedValue: ''
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
        this.setState(state => ({
            ...state,
            selectedGroups: _.map(state.selectedGroups, group =>
                group.fullName === hoverGroup.fullName
                    ? { ...group, isHover: true }
                    : { ...group, isHover: false }
            )
        }));
    };

    handleLeave = () => {
        this.setState(state => ({
            ...state,
            selectedGroups: _.map(state.selectedGroups, group => ({
                ...group,
                isHover: false
            }))
        }));
    };

    /**
     * Handle text input to TextField to allow for clearing-on-select
     * @jira GF-565
     */
    handleInputChange = (
        event: SyntheticEvent<HTMLInputElement>,
        params: Object
    ) => {
        this.setState({ inputValue: event.currentTarget.value, isOpen: true });
        return params.inputProps.onChange(event);
    };

    renderSelected = () => {
        const { intl, classes } = this.props;
        const { groupsLoading, selectedGroups } = this.state;

        const dividerLabel = intl.formatMessage(messages.youAdded, {
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
                    {_.map(selectedGroups, group => (
                        <ListItem
                            key={group.fullName}
                            button
                            onClick={() => this.handleRemove(group)}
                            onMouseEnter={() => this.handleEnter(group)}
                            onMouseLeave={() => this.handleLeave()}
                            className={classes.selectedGroupsList}
                        >
                            <ListItemIcon className={classes.icon}>
                                {getIcon(classes, group)}
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
            meta: { touched, error },
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
            selectedValue,
            isOpen
        } = this.state;

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
                    data-cy="recipients"
                    disableCloseOnSelect
                    open={isOpen}
                    disabled={disabled}
                    options={results}
                    loading={resultsLoading}
                    getOptionLabel={option => option.displayName || ''}
                    getOptionDisabled={option =>
                        multiple
                            ? Boolean(
                                _.find(selectedGroups, {
                                    shortName: option.shortName
                                })
                            )
                            : option.shortName === selectedValue
                    }
                    classes={{
                        root: classes.authSearch,
                        inputRoot: classes.input
                    }}
                    onChange={this.handleSelect}
                    value={multiple ? selectedValue : selectedGroups}
                    onInputChange={this.debouncedSearch}
                    renderOption={option => (
                        <ListItem data-cy={option.displayName} component="div">
                            <ListItemIcon className={classes.icon}>
                                {getIcon(classes, option)}
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
                            autoComplete="new-pasword"
                            fullWidth={fullWidth}
                            color="primary"
                            variant="outlined"
                            label={label}
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
                            // eslint-disable-next-line react/jsx-no-duplicate-props
                            inputProps={{
                                ...params.inputProps,
                                value: this.state.inputValue,
                                onChange: e => this.handleInputChange(e, params)
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

export default FieldCompanySelector;
