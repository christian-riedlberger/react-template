// @flow
import React, { useRef, useEffect } from 'react';
import { Field as ReduxField } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFormName } from 'utils/form';

type DefaultProps = {
    dispatch: Function,
    formName: string
};
type Props = {
    name: string
} & DefaultProps;

const Field = (props: Props) => {
    const { dispatch, formName, name } = props;
    const input = useRef(null);

    useEffect(() => {
        dispatch({
            type: '@@redux-form/REGISTER_FIELD',
            meta: { form: formName },
            payload: { name, ref: input, type: 'Field' }
        });
    }, [dispatch, formName, name]);

    return <ReduxField {...props} passRef={input} />;
};

export default compose(
    connect(),
    withFormName
)(Field);
