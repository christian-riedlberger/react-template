// @flow
import React, { useEffect } from 'react';
import { Field } from 'redux-form';
import { intlShape, injectIntl } from 'react-intl';
import messages from 'constants/Messages';

import FieldAvatarUpload from 'components/FieldAvatarUpload';

import { AVATAR } from 'constants/ServiceURI';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    userName: string,
    change: Function
} & DefaultProps;

const FormAvatar = (props: Props) => {
    const { intl, userName, change } = props;

    useEffect(() => {
        if (userName) {
            // eslint-disable-next-line compat/compat
            fetch(AVATAR(userName))
                .then(res => {
                    return res.blob();
                })
                .then(blob => {
                    const file = new File([blob], `${userName}_AVATAR`);
                    // setAvatar(file);
                    change('userAvatar', file);
                    return true;
                })
                .catch(e => {
                    throw e;
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change]);

    return (
        <div>
            <Field
                name="userAvatar"
                component={FieldAvatarUpload}
                change={change}
                helperText=""
                label={intl.formatMessage(messages.avatar)}
                imageHeight="50px"
                imageWidth="50px"
                buttonTop="40%"
            />
        </div>
    );
};

export default injectIntl(FormAvatar);
