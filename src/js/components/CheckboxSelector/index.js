// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CheckboxGroup from 'components/CheckboxGroup';
import { log, logRender } from 'utils/logger';

type DefaultProps = {
    classes: Object
};

type Box = {
    title: string,
    value: any
};

type Props = {
    onSearch: string => null,
    boxes: Array<Box>,
    defaultValues?: Array<Box>, // ^boxes^ should be present in defaultValues
    labelFilter?: string,
    labelSelected?: string,
    onAdd?: Function,
    onRemove?: Function,
    isLoading?: boolean
} & DefaultProps;

type State = {
    boxes: Array<Box>
};

const styles = {
    root: {
        display: 'flex'
    }
};

class CheckboxSelector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            boxes: _.isEmpty(props.defaultValues)
                ? []
                : _.filter(
                    _.filter(props.defaultValues, b =>
                        _.find(this.props.boxes, { value: b })
                    ),
                    b => !_.isEmpty(b)
                )
        };
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.defaultValues, this.props.defaultValues)) {
            const missingBoxes = _.filter(
                this.props.defaultValues,
                b => !_.find(this.state.boxes, { value: b })
            );

            if (missingBoxes.length > 0)
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    boxes: _.filter(
                        _.concat(this.state.boxes, missingBoxes),
                        b => !_.isEmpty(b)
                    )
                });
        }
    }

    onAdd = (value: any) => {
        const { boxes } = this.props;
        const box = _.find(boxes, { value });
        this.setState(state => ({ boxes: _.concat(state.boxes, box) }));
        if (this.props.onAdd) this.props.onAdd(box);
    };

    onRemove = (value: any) => {
        const { boxes } = this.props;
        const index = _.findIndex(boxes, { value });

        this.setState(state => ({
            boxes: _.filter(state.boxes, b => b.value !== value)
        }));
        if (this.props.onRemove) this.props.onRemove(boxes[index], index);
    };

    render() {
        const {
            onSearch,
            labelFilter,
            labelSelected,
            classes,
            isLoading,
        } = this.props;

        const notSelectedBoxes = _.map(
            _.filter(
                this.props.boxes,
                box =>
                    !_.isEmpty(box.title) &&
                    _.findIndex(this.state.boxes, { value: box.value }) === -1
            ),
            box => ({ ...box, active: false })
        );

        const selectedBoxes = _.map(
            _.filter(this.state.boxes, b => !_.isEmpty(b.title)),
            box => ({
                ...box,
                active: true
            })
        );

        log('CheckboxSelector - state', 'yellow', this.state);

        return (
            <div className={classes.root}>
                <CheckboxGroup
                    className="pick"
                    label={labelFilter}
                    boxes={notSelectedBoxes}
                    onToggle={val => this.onAdd(val)}
                    onSearch={onSearch}
                    isLoading={isLoading}
                    enableSearch
                />
                <CheckboxGroup
                    className="selected"
                    label={labelSelected}
                    boxes={selectedBoxes}
                    isLoading={isLoading}
                    onToggle={val => this.onRemove(val)}
                />
            </div>
        );
    }
}

export default logRender(withStyles(styles)(CheckboxSelector));
