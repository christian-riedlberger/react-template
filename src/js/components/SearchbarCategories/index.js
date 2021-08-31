/* eslint-disable no-return-assign */
// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import type { Node } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from 'constants/Theme';
import messages from 'constants/Messages';
import { DEBOUNCE_DELAY } from 'constants/Config';
import SearchContainer from 'containers/SearchContainer';
import Categories from './Categories';
import ResultSet from './ResultSet';

type DefaultProps = {
    results: Object,
    fetchSearch: Function,
    clearActiveSearch: Function,
    isLoadingSearch: boolean,
    classes: Object,
    intl: intlShape
};
type Props = {
    term: string,
    category?: Object,
    placeholder: string,
    categories: Array<Object>,
    round: boolean,
    size: string,
    onSearch: Function,
    onClear: Function
} & DefaultProps;

type State = {
    term: string,
    isOpen: boolean,
    category?: Object
};

const style = {
    wrapper: {
        display: 'flex',
        marginBottom: '2em'
    },
    root: {
        border: '1px solid #CECECE',
        boxShadow: 'none',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400
    },
    round: {
        borderRadius: '0 5em 5em 0',
        paddingLeft: '.75em',
        paddingRight: '.5em'
    },
    small: {
        padding: '0px 0.5em 0px 0.75em'
    },
    large: {
        width: '100%',
        height: '4em'
    },
    largeText: {
        fontSize: '1.1em'
    },
    categories: {
        width: '14em',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: '14em'
    }
};
const styles = theme => ({
    input: props => {
        return {
            marginLeft: theme.spacing(1),
            flex: 1,
            fontSize: props.size === 'large' ? '1.1em' : '1em'
        };
    },
    iconButton: {
        color: green,
        padding: 10
    },
    divider: {
        height: 28,
        margin: 4
    }
});

/**
 *  Component
 *  @desc
 *  @author
 */
@SearchContainer()
class SearchbarCategories extends Component<Props, State> {
    node: Node;

    static defaultProps = {
        term: '',
        category: {},
        categories: []
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            term: props.term,
            category: props.category,
            isOpen: true
        };
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false);
    }
    componentWillUnmount() {
        document.removeEventListener(
            'mousedown',
            this.handleClickOutside,
            false
        );
        this.props.clearActiveSearch();
    }

    debouncedSearch = _.debounce(() => {
        this.suggestSearch();
    }, DEBOUNCE_DELAY);

    /**
     *  Close results
     */
    handleClickOutside = (e: Object) => {
        // $FlowFixMe
        if (this.node && this.node.contains(e.target)) {
            this.setState(state => ({
                ...state,
                isOpen: true
            }));
        } else {
            this.setState(state => ({
                ...state,
                isOpen: false
            }));
        }
    };

    /**
     * Call global search
     */
    suggestSearch = () => {
        const { category, term } = this.state;

        this.props.fetchSearch({
            category: category ? category.value : null,
            term
        });
    };

    /**
     *  Search term changed
     */
    onSubmit = () => {
        const { category, term } = this.state;

        this.props.onSearch({
            term,
            category: category ? category.value : null
        });
    };

    /**
     *  Search term changed
     */
    onChangeTerm = (term: string) => {
        this.setState(
            state => {
                return {
                    ...state,
                    term
                };
            },
            () => {
                this.debouncedSearch();
            }
        );
    };

    /**
     *  Search term changed
     */
    onChangeCategory = (category: Object) => {
        this.setState(
            state => {
                return {
                    ...state,
                    category
                };
            },
            () => {
                this.debouncedSearch();
            }
        );
    };

    /**
     *  Clear search text
     */
    onClear = () => {
        this.setState(
            state => {
                return {
                    ...state,
                    term: ''
                };
            },
            () => {
                this.debouncedSearch();
            }
        );
        if (this.props.onClear) this.props.onClear();
    };

    renderCategories = () => {
        const { categories, size, classes } = this.props;
        const { category } = this.state;
        return (
            <div className={classes.categories}>
                <Categories
                    size={size}
                    categories={categories}
                    category={category}
                    onChange={this.onChangeCategory}
                />
            </div>
        );
    };

    render() {
        const {
            intl,
            round,
            size,
            results,
            classes,
            placeholder,
            isLoadingSearch
        } = this.props;
        const { term, isOpen } = this.state;

        const placeholderText = messages[placeholder]
            ? intl.formatMessage(messages[placeholder])
            : placeholder;

        return (
            // $FlowFixMe
            <div ref={node => (this.node = node)}>
                <div
                    style={{
                        ...style.wrapper
                    }}
                >
                    {this.renderCategories()}

                    <Paper
                        component="form"
                        style={{
                            ...style.root,
                            // $FlowFixMe - Not worth applying the the fix - Flow trying to avoid heavy computing. https://github.com/facebook/flow/issues/8186
                            ...(round ? style.round : {}),
                            ...(size === 'large' ? style.large : {}),
                            ...(size === 'small' ? style.small : {})
                        }}
                    >
                        {isLoadingSearch && (
                            <IconButton
                                className={classes.iconButton}
                                aria-label="search"
                            >
                                <CircularProgress color="inherit" size={20} />
                            </IconButton>
                        )}
                        <InputBase
                            id="cy-search"
                            onChange={event => {
                                this.onChangeTerm(event.target.value);
                            }}
                            onKeyPress={ev => {
                                if (ev.key === 'Enter') {
                                    ev.preventDefault();
                                }
                            }}
                            value={term}
                            className={classes.input}
                            placeholder={placeholderText}
                            inputProps={{
                                'aria-label': placeholderText,
                                autoComplete: 'off'
                            }}
                        />

                        {!isLoadingSearch && _.isEmpty(term) && (
                            <IconButton
                                type="submit"
                                className={classes.iconButton}
                                aria-label="search"
                            >
                                <clr-icon shape="search" size={20} />
                            </IconButton>
                        )}

                        {!isLoadingSearch && !_.isEmpty(term) && (
                            <IconButton
                                onClick={this.onClear}
                                className={classes.iconButton}
                                aria-label="search"
                            >
                                <clr-icon shape="times" size={20} />
                            </IconButton>
                        )}
                    </Paper>
                </div>

                {isOpen && !isLoadingSearch && (
                    <ResultSet term={term} results={results} size={size} />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(SearchbarCategories));
