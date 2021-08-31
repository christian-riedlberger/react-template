// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { showMessage, hideMessage } from 'actions/ActionMessage';
import type { ShowMessageArgs } from 'actions/ActionMessage';

/**
 * Selector function that returns a value from the component's own props
 * @arg Object - component's own props
 */

export type ContainerProps = {
    showMessage: ShowMessageArgs => void,
    hideMessage: () => void
};

const MessageContainer = () =>
    compose(
        connect(
            null,
            {
                showMessage,
                hideMessage
            }
        )
    );

export default MessageContainer;
