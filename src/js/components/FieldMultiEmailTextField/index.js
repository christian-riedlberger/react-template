// @flow
import React, { Component } from 'react';
import { Field } from 'redux-form';
import { injectIntl, intlShape } from 'react-intl';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';

import { withStyles } from '@material-ui/core/styles';
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
    emails: Array<string>
};

const styles = () => ({
    root: {
        marginTop: '-1em'
    },
    label: {
        fontSize: '1.1em',
        marginLeft: '-1.5em'
    },
    input: {
        width: '95%',
        minHeight: '4em',
        borderColor: '#c4c4c4',

        '& input': {
            width: '95% !important' // Needed to override 'auto !important'
        }
    }
});

/**
 *  Component
 *  @desc
 *  @author
 */
@injectIntl
@withStyles(styles)
class FieldMultiEmailTextField extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            emails: []
        };
    }

    componentDidMount = () => {
        const { input, change } = this.props;
        change(input.name, []);
    };

    /**
     *  Default render
     */
    render() {
        const { input, change, label, classes } = this.props;
        const { emails } = this.state;

        return (
            <React.Fragment>
                <Field {...input} component={renderHiddenField} />
                <ReactMultiEmail
                    className={classes.input}
                    placeholder={label}
                    emails={emails}
                    onChange={(_emails: string[]) => {
                        this.setState({ emails: _emails }, () =>
                            change(input.name, _emails)
                        );
                    }}
                    validateEmail={email => {
                        return isEmail(email); // return boolean
                    }}
                    getLabel={(
                        email: string,
                        index: number,
                        removeEmail: (index: number) => void
                    ) => {
                        return (
                            <div data-tag key={index}>
                                {email}
                                <span
                                    data-tag-handle
                                    onClick={() => removeEmail(index)}
                                >
                                    ×
                                </span>
                            </div>
                        );
                    }}
                />
            </React.Fragment>
        );
    }
}

export default FieldMultiEmailTextField;
