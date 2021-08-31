// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { Field } from 'redux-form';
import { renderHiddenField } from 'constants/FormFields';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { GithubPicker } from 'react-color';
import Typography from '@material-ui/core/Typography';
import messages from 'constants/Messages';

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
    color: Object,
    displayColorPicker: boolean
};

const styles = () => ({
    message: {
        paddingRight: '10px'
    },
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px'
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        marginTop: '10px'
    },
    popover: {
        position: 'absolute',
        zIndex: '2'
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
    }
});

/**
 *  Field for redux form to select a color
 *  @desc
 *  @author
 */
class FieldColorSelector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            color: this.props.input.value
        };
    }

    componentDidUpdate = prevProps => {
        if (!_.isEqual(_.get(prevProps, 'input'), _.get(this.props, 'input')))
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                color: this.props.input.value
            });
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = color => {
        this.setState({ color: color.hex }, () => {
            this.props.change(this.props.input.name, `${color.hex}`);
        });
    };

    render() {
        const { classes, input, intl } = this.props;
        const { color } = this.state;

        return (
            <div>
                <Field {...input} component={renderHiddenField} />

                <div>
                    <Typography
                        className={classes.message}
                        variant="body1"
                        display="inline"
                    >
                        {intl.formatMessage(messages.selectColor)}
                    </Typography>

                    <div
                        className={classes.swatch}
                        onClick={this.handleClick}
                        style={{
                            backgroundColor: `${color}`
                        }}
                    >
                        <div className={classes.color} />
                    </div>
                    {this.state.displayColorPicker ? (
                        <div className={classes.popover}>
                            <div
                                className={classes.cover}
                                onClick={this.handleClose}
                            />
                            <GithubPicker
                                color={this.state.color}
                                onChange={this.handleChange}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(FieldColorSelector));
