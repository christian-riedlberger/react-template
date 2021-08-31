// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { renderHiddenField } from 'constants/FormFields';

type DefaultProps = {
    name: string,
    label: string,
    input: Object,
    classes: Object,
    intl: intlShape,
    change: Function
};
type Props = {
    options: Array<Object>
} & DefaultProps;

type State = {
    checked: Array<string>
};

const styles = () => ({
    root: {
        marginTop: '-1em'
    },
    label: {
        fontSize: '1.1em',
        marginLeft: '-1.5em'
    }
});

/**
 *  Component
 *  @desc
 *  @author
 */
@injectIntl
@withStyles(styles)
class FieldStatusList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            checked: this.props.input.value
        };
    }

    componentDidUpdate = (prevProps: Object) => {
        if (!_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input'))) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                checked: this.props.input.value
            });
        }
    };

    handleToggle = (value: string) => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState(
            {
                checked: newChecked
            },
            () => this.props.change(this.props.input.name, newChecked)
        );
    };

    translateOptions = (options: Array<any>, intlProvider: any) => {
        const translatedOptions = [];

        _.forEach(
            options,
            option => {
                const translatedItem = {
                    ...option,
                    label: intlProvider.formatMessage(option.label)
                };
                translatedOptions.push(translatedItem);
            },
            this
        );
        return translatedOptions;
    };

    /**
     *  Default render
     */
    render() {
        const { intl, classes, input, options } = this.props;
        const { checked } = this.state;
        const translatedOptions = this.translateOptions(options, intl);

        return (
            <div>
                <Field {...input} component={renderHiddenField} />

                <React.Fragment>
                    <List className={classes.root}>
                        {translatedOptions.map(option => {
                            const labelId = `checkbox-list-label-${option.value}`;

                            return (
                                <ListItem
                                    key={option.value}
                                    role={undefined}
                                    dense
                                    button
                                    onClick={() =>
                                        this.handleToggle(option.value)
                                    }
                                    data-cy={option.label}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={
                                                checked.indexOf(
                                                    option.value
                                                ) !== -1
                                            }
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={
                                            <div className={classes.label}>
                                                {option.label}
                                            </div>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </React.Fragment>
            </div>
        );
    }
}

export default FieldStatusList;
