// @flow

/* eslint-disable */
import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import messages from 'constants/Messages';

type DefaultProps = {
    classes: Object,
    intl: intlShape
};
type Props = {} & DefaultProps;

type State = {};

const styles = theme => ({
    root: {}
});

/**
 *  Component
 *  @desc
 *  @author
 */
// @ItemContainer()
@AssessmentContainer({
    fetchAll: true
})
class MyComponent extends Component<Props, State> {
    render() {
        const { intl, classes } = this.props;

        return <div className={classes.root}>Start here</div>;
    }
}

export default withStyles(styles)(injectIntl(MyComponent));
/* eslint-enable */
