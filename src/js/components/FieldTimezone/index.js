// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { Field } from 'redux-form';
import { renderHiddenField } from 'constants/FormFields';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
    value: string
};

const styles = () => ({
    root: {}
});

/**
 *  Component
 *  @desc
 *  @author
 */

const zones = moment.tz.names();

class FieldTimezone extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.input.value
        };
    }

    componentDidUpdate = prevProps => {
        if (!_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input')))
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                value: this.props.input.value
            });
    };

    /**
     *  Change our hidden field
     */
    handleChange = (choice: string) => {
        this.setState({ value: choice }, () =>
            this.props.change(this.props.input.name, choice)
        );

        return choice;
    };

    /**
     *  Default render
     */
    render() {
        const { input, label } = this.props;
        const { value } = this.state;

        return (
            <div>
                <Field {...input} component={renderHiddenField} />

                <Autocomplete
                    options={zones}
                    classes={{}}
                    value={value}
                    onChange={(e, v) => this.handleChange(v || '')}
                    autoHighlight
                    renderOption={option => (
                        <React.Fragment>
                            {option} ({moment.tz(option).format('Z z')})
                        </React.Fragment>
                    )}
                    renderInput={params => (
                        <TextField
                            {...params}
                            value={value}
                            label={label}
                            placeholder=""
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(FieldTimezone));
