// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { renderHiddenField } from 'constants/FormFields';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

import countries from 'constants/Countries';

type DefaultProps = {
    name: string,
    label: string,
    input: Object,
    classes: Object,
    intl: intlShape,
    change: Function,
    required: boolean,
    meta: Object
};
type Props = {
    isLoading?: boolean
} & DefaultProps;

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

@withStyles(styles)
@injectIntl
class FieldCountrySelector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.input.value
        };
    }

    componentDidUpdate = (prevProps: Props) => {
        if (!_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input')))
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                value: this.props.input.value
            });
    };

    /**
     *  Change our hidden field
     */
    handleChange = (value: string) => {
        this.setState({ value }, () => {
            // enable backwards compatibilty for components using `change` prop
            if (this.props.change) {
                this.props.change(this.props.input.name, value);
            } else {
                this.props.input.onChange(value);
            }
        });

        return value;
    };

    /**
     *  Default render
     */
    render() {
        const { input, label, meta, required, isLoading } = this.props;
        const { value } = this.state;

        const Loading = (
            <InputAdornment position="end">
                <CircularProgress size={20} />
            </InputAdornment>
        );

        return (
            <div>
                <Field {...input} component={renderHiddenField} />

                <Autocomplete
                    options={countries}
                    classes={{}}
                    value={value}
                    onChange={(e, v) => this.handleChange(v ? v.label : '')}
                    autoHighlight
                    renderOption={option => (
                        <React.Fragment>
                            {option.label} ({option.code})
                        </React.Fragment>
                    )}
                    renderInput={params => (
                        <TextField
                            {...params}
                            error={meta.touched && meta.invalid}
                            required={required}
                            value={value}
                            label={label}
                            placeholder="Country"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                            }}
                            // eslint-disable-next-line react/jsx-no-duplicate-props
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: isLoading ? Loading : params.InputProps.endAdornment
                            }}
                            fullWidth
                        />
                    )}
                />
            </div>
        );
    }
}

export default FieldCountrySelector;
