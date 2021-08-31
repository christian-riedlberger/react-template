// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { green } from 'constants/Theme';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import messages from 'constants/Messages';
import ListFilterOptions from 'components/ListFilterOptions';
import { AVATAR } from 'constants/ServiceURI';
import { DEBOUNCE_DELAY } from 'constants/Config';
import { log } from 'utils/logger';

type User = {
    shortName: string,
    icon: Component<>,
    displayName: string
};

type DefaultProps = {
    intl: intlShape,
    classes: Object
};

type Props = {
    className?: string,
    modifiers: Array<Object>,
    input: Object
} & DefaultProps;

type State = {
    users: Array<User>,
    selectedUsers: Array<User>,
    term: string,
    checkedAll: boolean
};

const styles = () => ({
    iconButton: {
        color: green,
        padding: 10
    },
    searchWrapper: {
        display: 'flex',
        justifyContent: 'center'
    },
    input: {
        '& .MuiOutlinedInput-adornedEnd': {
            paddingRight: 0
        }
    },
    searchAll: {
        position: 'relative',
        top: '-3px'
    }
});

@injectIntl
@withStyles(styles)
class FieldFilterUsers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            users: props.modifiers,
            selectedUsers: _.isArray(_.get(props, 'input.value'))
                ? props.input.value
                : [],
            term: '',
            checkedAll: false
        };
    }

    componentDidUpdate = (prevProps: Object) => {
        if (
            !_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input')) &&
            _.isEmpty(this.props.input.value)
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                selectedUsers: [],
                term: '',
                checkedAll: false
            });
        }
    };

    handleSelect = (user: User) => {
        const { input } = this.props;
        const userObj = _.pick(user, 'shortName', 'displayName');
        this.setState(
            ({ selectedUsers }) => ({
                selectedUsers: _.find(selectedUsers, userObj)
                    ? _.reject(selectedUsers, userObj)
                    : _.concat(selectedUsers, userObj)
            }),
            () => {
                input.onChange(this.state.selectedUsers);
            }
        );
    };

    debouncedSearch = (searchTerm: string) => {
        _.debounce(() => {
            log('SEARCH', 'blue', searchTerm);

            this.setState({
                users: _.filter(
                    this.state.users,
                    _.conforms({
                        shortName(n) {
                            return n.includes(searchTerm);
                        }
                    })
                )
            });
        }, DEBOUNCE_DELAY)();
    };

    handleSearch = (event: Object) => {
        const searchTerm = event.target.value;

        log('searchTerm', 'blue', searchTerm);

        this.setState({ term: searchTerm, checkedAll: false }, () => {
            this.debouncedSearch(searchTerm);
        });
    };

    handleClear = () => {
        this.setState({
            users: [],
            term: ''
        });
    };

    handleAll = () => {
        const { checkedAll } = this.state;
        const { input } = this.props;
        if (checkedAll) {
            this.setState(
                {
                    checkedAll: false,
                    selectedUsers: []
                },
                () => {
                    this.debouncedSearch(this.state.term);
                    input.onChange(this.state.selectedUsers);
                }
            );
        } else {
            this.setState(
                ({ selectedUsers, users }) => ({
                    checkedAll: true,
                    selectedUsers: _.concat(
                        selectedUsers,
                        _.reject(users, u => _.find(selectedUsers, u))
                    )
                }),
                () => {
                    input.onChange(this.state.selectedUsers);
                }
            );
        }
    };

    render() {
        const { intl, className, classes, modifiers } = this.props;

        const { users, selectedUsers, term, checkedAll } = this.state;

        const userList = users.length > 0 ? users : modifiers;

        const userOptions = _.map(
            _.concat(
                _.map(selectedUsers, u => ({ ...u, chosen: true })),
                _.map(_.reject(userList, u => _.find(selectedUsers, u)), u => ({
                    ...u,
                    chosen: false
                }))
            ),
            u => ({
                ...u,
                icon: <Avatar src={AVATAR(u.shortName)} alt={u.shortName} />
            })
        );

        const clearButton = _.isEmpty(term) ? (
            ''
        ) : (
            <IconButton
                onClick={this.handleClear}
                className={classes.iconButton}
                aria-label="search"
            >
                <clr-icon shape="times" size={20} />
            </IconButton>
        );

        return (
            <div className={clsx(classes.root, className)}>
                <div>
                    <div className={classes.searchWrapper}>
                        <IconButton
                            onClick={this.handleAll}
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
                            size="small"
                            value={term}
                            onChange={this.handleSearch}
                            className={classes.input}
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
                                    {` ${intl.formatMessage(messages.search)}`}
                                </span>
                            }
                            InputProps={{
                                endAdornment: clearButton
                            }}
                        />
                    </div>
                </div>
                <div>
                    <ListFilterOptions
                        options={userOptions}
                        onPrimaryClick={this.handleSelect}
                    />
                </div>
            </div>
        );
    }
}
export default FieldFilterUsers;
