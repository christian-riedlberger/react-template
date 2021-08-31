// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DoneIcon from '@material-ui/icons/Done';

import { TASK_STATUS_OPTS } from 'constants/Config';
import { renderHiddenField } from 'constants/FormFields';

type DefaultProps = {
    name: string,
    label: string,
    input: Object,
    classes: Object,
    intl: intlShape,
    change: Function
};
type Props = {} & DefaultProps;

type State = {
    value: Array<Object>,
    pendingValue: Array<Object>,
    anchorEl: null | HTMLElement
};

const styles = () => ({
    root: {},
    menu: {},
    option: {
        minHeight: 'auto',
        alignItems: 'flex-start',
        padding: 8,
        '&[aria-selected="true"]': {
            backgroundColor: 'transparent'
        }
    },
    iconSelected: {
        width: 17,
        height: 17,
        marginRight: 5,
        marginLeft: -2
    },
    color: {
        width: 14,
        height: 14,
        flexShrink: 0,
        borderRadius: 3,
        marginRight: 8,
        marginTop: 2
    },
    text: {
        flexGrow: 1
    }
});

/**
 *  Component
 *  @desc
 *  @author
 */
@injectIntl
@withStyles(styles)
class FieldStatusSelector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.input.value,
            pendingValue: [],
            anchorEl: null
        };
    }

    componentDidUpdate = (prevProps: Object) => {
        if (!_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input'))) {
            // eslint-disable-next-line react/no-did-update-set-state
            const inputs = [];
            this.props.input.value.forEach(v => {
                inputs.push(_.find(TASK_STATUS_OPTS, { value: v }));
            });
            this.setState({
                value: this.translateOptions(inputs, this.props.intl)
            });
        }
    };

    /**
     *  Change our hidden field
     */
    handleChange = (v: any) => {
        const { value } = this.state;
        const clicked = v[0];
        const newChecked = [...value];
        const newChange = [];
        let remove = false;

        value.forEach(element => {
            if (_.isEqual(clicked, element)) {
                _.remove(newChecked, clicked);
                remove = true;
            } else {
                newChange.push(element.value);
            }
        });

        if (!remove) {
            newChecked.push(clicked);
            newChange.push(clicked.value);
        }

        this.setState(
            {
                value: newChecked
            },
            () => {
                this.props.change(this.props.input.name, newChange);
            }
        );
    };

    handleOpen = (event: Object) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    translateOptions = (options: Array<any>, intlProvider: any) => {
        const translatedOptions = [];

        options.forEach(option => {
            const translatedItem = {
                ...option,
                label: intlProvider.formatMessage(option.label)
            };
            translatedOptions.push(translatedItem);
        }, this);
        return translatedOptions;
    };

    /**
     *  Default render
     */
    render() {
        const { intl, classes, input, label } = this.props;
        const { anchorEl, pendingValue, value } = this.state;
        const options = this.translateOptions(TASK_STATUS_OPTS, intl);

        return (
            <div>
                <Field {...input} component={renderHiddenField} />

                <React.Fragment>
                    <Button
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="contained"
                        onClick={e => this.handleOpen(e)}
                    >
                        {label}
                    </Button>
                    <Menu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                        keepMounted
                        className={classes.menu}
                        open={Boolean(anchorEl)}
                        onClose={() => this.handleClose()}
                    >
                        <MenuItem>
                            <Autocomplete
                                multiple
                                options={options}
                                classes={{
                                    paper: classes.paper,
                                    option: classes.option,
                                    popperDisablePortal:
                                        classes.popperDisablePortal
                                }}
                                value={pendingValue}
                                onChange={(event, newValue) => {
                                    this.handleChange(newValue);
                                }}
                                defaultValue={value}
                                disableCloseOnSelect
                                renderTags={() => null}
                                renderOption={option => {
                                    let selected = false;
                                    value.forEach(element => {
                                        if (_.isEqual(option, element)) {
                                            selected = true;
                                        }
                                    });
                                    return (
                                        <React.Fragment>
                                            <DoneIcon
                                                className={classes.iconSelected}
                                                style={{
                                                    visibility: selected
                                                        ? 'visible'
                                                        : 'hidden'
                                                }}
                                            />
                                            <span
                                                className={classes.color}
                                                style={{
                                                    backgroundColor:
                                                        option.color
                                                }}
                                            />
                                            <div className={classes.text}>
                                                {option.label}
                                            </div>
                                        </React.Fragment>
                                    );
                                }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        autoComplete="off"
                                        variant="standard"
                                        label={label}
                                        placeholder="Search"
                                        fullWidth
                                    />
                                )}
                            />
                        </MenuItem>
                    </Menu>
                </React.Fragment>
            </div>
        );
    }
}

export default FieldStatusSelector;
