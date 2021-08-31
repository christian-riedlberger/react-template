// @flow
import React from 'react';
import _ from 'lodash';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { reset } from 'redux-form';

import messages from 'constants/Messages';
import FormTasksFilter, {
    FormName as FiltersFormName
} from 'components/FormTasksFilter';
import Drawer from 'components/Drawer';

type DefaultProps = {
    intl: intlShape,
    reduxFilters: Object
};

type Props = {
    open: boolean,
    onClose: Function,
    dispatch: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const DrawerFilterTasks = (props: Props) => {
    const { intl, open, onClose, reduxFilters, dispatch } = props;
    const classes = useStyles();

    const handleReset = () => {
        dispatch(reset(FiltersFormName));
    };

    return (
        <div className={classes.root}>
            <Drawer
                title={intl.formatMessage(messages.filters)}
                noButton
                open={open}
                onReset={() => handleReset()}
                onClose={() => onClose(reduxFilters)}
                width={400}
            >
                {/* $FlowFixMe */}
                <FormTasksFilter />
            </Drawer>
        </div>
    );
};
// $FlowFixMe
export default connect(store => ({
    reduxFilters: _.get(store, `form.${FiltersFormName}.values`, null)
}))(injectIntl(DrawerFilterTasks));
