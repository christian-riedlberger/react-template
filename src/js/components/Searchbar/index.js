// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import { green } from 'constants/Theme';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import messages from 'constants/Messages';

type DefaultProps = {
    classes: Object,
    intl: intlShape
};
type Props = {
    term: string,
    placeholder: string,
    round: boolean,
    onSearch: Function
} & DefaultProps;

type State = {
    term: string,
    category: Object
};

const style = {
    root: {
        border: '1px solid #CECECE',
        boxShadow: 'none',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400
    },
    round: {
        borderRadius: '5em',
        paddingLeft: '.75em',
        paddingRight: '.25em'
    }
};
const styles = theme => ({
    input: {
        marginLeft: theme.spacing(1),
        flex: 1
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

class Searchbar extends Component<Props, State> {
    static defaultProps = {
        term: ''
    };
    constructor(props: Props) {
        super(props);

        this.state = {
            term: props.term,
            category: null
        };
    }

    debounceSearch = () => {
        _.debounce(() => this.onSubmit(), 1000)();
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
                this.debounceSearch();
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
                this.debounceSearch();
            }
        );
    };

    render() {
        const { intl, round, classes, placeholder } = this.props;
        const { term } = this.state;

        const placeholderText = messages[placeholder]
            ? intl.formatMessage(messages[placeholder])
            : placeholder;

        return (
            <Paper
                component="form"
                className="cy-search"
                style={{
                    ...style.root,
                    ...(round ? style.round : {})
                }}
            >
                <InputBase
                    id="cy-search"
                    onChange={event => {
                        this.onChangeTerm(event.target.value);
                    }}
                    value={term}
                    className={classes.input}
                    placeholder={placeholderText}
                    inputProps={{ 'aria-label': placeholderText }}
                />

                {_.isEmpty(term) && (
                    <IconButton
                        type="submit"
                        className={classes.iconButton}
                        aria-label="search"
                    >
                        <clr-icon shape="search" size={20} />
                    </IconButton>
                )}

                {!_.isEmpty(term) && (
                    <IconButton
                        onClick={this.onClear}
                        className={classes.iconButton}
                        aria-label="search"
                    >
                        <clr-icon shape="times" size={20} />
                    </IconButton>
                )}
            </Paper>
        );
    }
}

export default withStyles(styles)(injectIntl(Searchbar));
