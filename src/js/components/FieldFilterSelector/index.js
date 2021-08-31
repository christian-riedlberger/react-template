// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import messages from 'constants/Messages';
import ListFilterOptions from 'components/ListFilterOptions';
import { AVATAR } from 'constants/ServiceURI';
import { white0, green } from 'constants/Theme';
import { getAvatarUrl } from 'utils/avatar';

type DefaultProps = {
    intl: intlShape,
    input: Object,
    classes: Object
};

type Authority = {
    displayName: string,
    shortName: string
};

type Props = {
    input: {
        onChange: Function,
        value: {
            users: Array<string>,
            organizations: Array<string>
        }
    },
    className?: string
} & (
    | { users: Array<Authority>, organizations: Array<Authority> }
    | { users: Array<Authority> }
    | {
          organizations: Array<Authority>
      }
) &
    DefaultProps;

type Option = {
    displayName: string,
    shortName: string
};

type State = {
    tab: number,
    usersTerm: string,
    orgTerm: '',
    selectedUsers: Array<Option>,
    selectedOrgs: Array<Option>,
    usersAll: boolean,
    organizationsAll: boolean
};

type Panel = {
    children: any,
    index: any,
    value: any
};

type Namespace = 'users' | 'organizations';

const TabPanel = (props: Panel) => {
    const { children, value, index } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            style={{
                display: index !== value ? 'none' : 'block'
            }}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
};

const a11yProps = index => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
};

/**
 * @desc format/filter options for <ListFilterOptions />, case insensitive
 */
const formatOptions = (allOptions, selectedOptions, searchTerm, type) =>
    _.map(
        _.concat(
            _.map(selectedOptions, o => ({ ...o, chosen: true })),
            _.map(
                _.filter(
                    _.map(allOptions, o => ({
                        displayName: o.displayName,
                        shortName: o.shortName ? o.shortName : o.userName
                    })),
                    o => {
                        if (
                            _.find(selectedOptions, {
                                shortName: o.shortName
                            })
                        )
                            return false;
                        if (searchTerm.length === 0) return true;
                        if (
                            o.shortName
                                .toUpperCase()
                                // .toLowerCase()
                                .indexOf(searchTerm.toUpperCase()) > -1 ||
                            o.displayName
                                .toUpperCase()
                                // .toLowerCase()
                                .indexOf(searchTerm.toUpperCase()) > -1
                        )
                            return true;
                    }
                ),
                o => ({ ...o, chosen: false })
            )
        ),
        o => ({
            ...o,
            icon:
                type === 'user' ? (
                    <Avatar src={AVATAR(o.shortName)} alt={o.shortName} />
                ) : (
                    <Avatar
                        src={getAvatarUrl({ shortName: o.shortName })}
                        alt={o.displayName}
                    />
                )
        })
    );

const styles = () => ({
    iconButton: {
        color: green,
        padding: 10
    },
    panel: {
        '& .MuiBox-root': {
            padding: '24px 0px!important'
        }
    },
    highlight: {
        backgroundColor: green
    },
    label: {
        backgroundColor: white0
    },
    list: {
        width: '100%'
    },
    searchWrapper: {
        display: 'flex',
        justifyContent: 'center',
        '& .MuiOutlinedInput-input': {
            padding: '7.5px 14px'
        }
    },
    input: {
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: 0
        }
    },
    searchAll: {
        position: 'relative',
        top: '-3px'
    },
    tabHide: {
        display: 'none'
    }
});

@injectIntl
@withStyles(styles)
class FieldFilterSelector extends Component<Props, State> {
    constructor(props: Object) {
        super(props);
        this.state = {
            tab: props.users ? 0 : 1,
            usersTerm: '',
            orgTerm: '',
            selectedUsers: _.isArray(_.get(props, 'input.value.users'))
                ? props.input.value.users
                : [],
            selectedOrgs: _.isArray(_.get(props, 'input.value.organizations'))
                ? props.input.value.organizations
                : [],
            usersAll: false,
            organizationsAll: false
        };
    }

    componentDidUpdate = (prevProps: Object) => {
        if (
            !_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input')) &&
            _.isUndefined(this.props.input.value.organizations) &&
            _.isUndefined(this.props.input.value.users)
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                selectedOrgs: [],
                selectedUsers: [],
                usersTerm: '',
                orgTerm: '',
                usersAll: false,
                organizationsAll: false
            });
        }
    };

    /**
     * @desc handle tab change
     */
    handleTabChange = (event: Object, newValue: number) => {
        this.setState({ tab: newValue });
    };

    /**
     * @desc update field values
     */
    updateField = () => {
        const { input } = this.props;
        input.onChange({
            users: _.map(this.state.selectedUsers, user =>
                _.pick(user, 'shortName', 'displayName')
            ),
            organizations: _.map(this.state.selectedOrgs, org =>
                _.pick(org, 'shortName', 'displayName')
            )
        });
    };

    /**
     * @desc handle select all checkbox for given namespace
     */
    handleSelectAll = (namespace: Namespace) => {
        if (namespace === 'users') {
            this.setState(
                state => ({
                    usersAll: !state.usersAll,
                    selectedUsers: state.usersAll
                        ? []
                        : _.map(this.props.users, u => ({
                            displayName: u.displayName,
                            shortName: u.userName
                        }))
                }),
                this.updateField
            );
        }

        if (namespace === 'organizations') {
            this.setState(
                state => ({
                    organizationsAll: !state.organizationsAll,
                    selectedOrgs: state.organizationsAll
                        ? []
                        : _.map(this.props.organizations, o => ({
                            displayName: o.displayName,
                            shortName: o.userName
                        }))
                }),
                this.updateField
            );
        }
    };

    /**
     * @desc handle search
     */
    handleSearch = (event: Object, namespace: Namespace) => {
        if (namespace === 'organizations') {
            this.setState(
                { orgTerm: event.target.value, organizationsAll: false },
                this.updateField
            );
        }
        if (namespace === 'users') {
            this.setState(
                { usersTerm: event.target.value, usersAll: false },
                this.updateField
            );
        }
    };

    /**
     * @desc handle clear text button
     */
    clearSearchInput = (namespace: Namespace) => {
        if (namespace === 'users') this.setState({ usersTerm: '' });
        if (namespace === 'organizations') this.setState({ orgTerm: '' });
    };

    handleSelect = (option: Object, namespace: Namespace) => {
        if (namespace === 'organizations') {
            this.setState(
                ({ selectedOrgs }) => ({
                    selectedOrgs: _.find(selectedOrgs, {
                        shortName: option.shortName
                    })
                        ? _.reject(selectedOrgs, {
                            shortName: option.shortName
                        })
                        : _.concat(selectedOrgs, option)
                }),
                this.updateField
            );
        }

        if (namespace === 'users') {
            this.setState(
                ({ selectedUsers }) => ({
                    selectedUsers: _.find(selectedUsers, {
                        shortName: option.shortName
                    })
                        ? _.reject(selectedUsers, {
                            shortName: option.shortName
                        })
                        : _.concat(selectedUsers, option)
                }),
                this.updateField
            );
        }
    };

    /**
     * @desc render tab
     */
    renderTab = (options: Array<Object>, namespace: Namespace) => {
        const { classes, intl } = this.props;
        const {
            tab,
            usersAll,
            organizationsAll,
            usersTerm,
            orgTerm
        } = this.state;

        let checkedAll;
        let term;
        let index;

        if (namespace === 'organizations') {
            checkedAll = organizationsAll;
            term = orgTerm;
            index = 1;
        }
        if (namespace === 'users') {
            checkedAll = usersAll;
            term = usersTerm;
            index = 0;
        }

        const clearButton = _.isEmpty(term) ? (
            ''
        ) : (
            <IconButton
                onClick={() => this.clearSearchInput(namespace)}
                className={classes.iconButton}
                aria-label="search"
            >
                <clr-icon shape="times" size={20} />
            </IconButton>
        );

        return (
            <div className={classes.panel}>
                <TabPanel value={tab} index={index}>
                    <div>
                        <div className={classes.searchWrapper}>
                            <IconButton
                                onClick={() => this.handleSelectAll(namespace)}
                                className={classes.searchAll}
                            >
                                {checkedAll ? (
                                    <CheckBoxIcon />
                                ) : (
                                    <CheckBoxOutlineBlankIcon />
                                )}
                            </IconButton>

                            <TextField
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                label={
                                    <span>
                                        <clr-icon
                                            shape="search"
                                            style={{
                                                color: green,
                                                margin: '-.25em .25em 0 -.3em'
                                            }}
                                            size={18}
                                        />
                                        {` ${intl.formatMessage(
                                            messages.search
                                        )}`}
                                    </span>
                                }
                                size="small"
                                value={term}
                                className={classes.input}
                                onChange={e => this.handleSearch(e, namespace)}
                                InputProps={{
                                    endAdornment: clearButton
                                }}
                            />
                        </div>
                        <div>
                            <ListFilterOptions
                                className={classes.list}
                                options={options}
                                onPrimaryClick={option =>
                                    this.handleSelect(option, namespace)
                                }
                            />
                        </div>
                    </div>
                </TabPanel>
            </div>
        );
    };

    render() {
        const { intl, users, organizations, className, classes } = this.props;
        const {
            tab,
            usersTerm,
            orgTerm,
            selectedUsers,
            selectedOrgs
        } = this.state;

        return (
            <div className={className || ''}>
                <Grid container spacing={0} direction="column">
                    <Grid item className={classes.tabs}>
                        <Tabs
                            aria-label="Page tabs"
                            value={tab}
                            onChange={this.handleTabChange}
                            classes={{ indicator: classes.highlight }}
                            variant="fullWidth"
                        >
                            <Tab
                                label={intl.formatMessage(messages.users)}
                                data-cy="users"
                                classes={
                                    !users ? { root: classes.tabHide } : null
                                }
                                {...a11yProps(0)}
                            />
                            <Tab
                                label={intl.formatMessage(
                                    messages.organizations
                                )}
                                data-cy="organizations"
                                classes={
                                    !organizations
                                        ? { root: classes.tabHide }
                                        : null
                                }
                                disabled={!organizations}
                                {...a11yProps(1)}
                            />
                        </Tabs>
                    </Grid>
                    <Grid item>
                        {this.renderTab(
                            formatOptions(
                                users || [],
                                selectedUsers,
                                usersTerm,
                                'user'
                            ),
                            'users'
                        )}
                        {this.renderTab(
                            formatOptions(
                                organizations || [],
                                selectedOrgs,
                                orgTerm,
                                'organization'
                            ),
                            'organizations'
                        )}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default FieldFilterSelector;
