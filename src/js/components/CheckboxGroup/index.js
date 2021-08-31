// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';

import SearchInput from 'components/SearchInput';

type DefaultProps = {
    classes: Object,
    intl: intlShape
};
type Props = {
    boxes: Array<Object>,
    onToggle: Function,
    label?: string,
    enableSearch?: boolean,
    onSearch?: Function,
    isLoading?: boolean,
    className?: string
} & DefaultProps;

type State = {};

const styles = () => ({
    root: props => ({
        '& .MuiFormGroup-root': {
            border: '1px solid #e0e0e0',
            height: props.enableSearch ? '16em' : '20em',
            overflow: 'auto',
            padding: '.5em 1em',
            display: 'block'
        }
    }),
    formControl: {}
});

/**
 *  Component to render checkboxes in a list
 */
class CheckboxGroup extends Component<Props, State> {
    renderCheckbox = box => {
        return (
            <FormControlLabel
                key={box.value}
                control={<Checkbox value={box.value} />}
                label={box.title}
                checked={box.active}
                disabled={box.disabled}
                onChange={() => {
                    this.props.onToggle(box.value);
                }}
            />
        );
    };

    renderCheckboxes = boxes => {
        return _.map(boxes, (box, i) => {
            return (
                <div key={`${box.value}${i}`}>{this.renderCheckbox(box)}</div>
            );
        });
    };

    render() {
        const {
            label,
            boxes,
            classes,
            enableSearch,
            onSearch,
            isLoading,
            intl,
            className
        } = this.props;

        return (
            <div className={`${classes.root} ${className || ''}`}>
                <div className={classes.formControl}>
                    {label && (
                        <FormLabel
                            component="legend"
                            focused={false}
                            style={{ paddingBottom: '1em' }}
                        >
                            {label}
                        </FormLabel>
                    )}

                    {enableSearch && (
                        <SearchInput onSearch={onSearch} bordered />
                    )}
                    <FormGroup>
                        {isLoading ? (
                            <div>{intl.formatMessage(messages.loading)}</div>
                        ) : (
                            this.renderCheckboxes(boxes)
                        )}
                    </FormGroup>
                </div>
            </div>
        );
    }
}

export default injectIntl(withStyles(styles)(CheckboxGroup));
