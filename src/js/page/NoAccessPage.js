// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

/**
 *  Restricted Access Banner
 */
const NoAccessPage = () => {
    return (
        <div className="page-wrapper" style={{ backgroundColor: '#fff' }}>
            <div className="restricted">
                <img src="/css/img/icons/oh-no.png" alt="No Access" />
                <h1>
                    <FormattedMessage
                        id="error.no_access_title"
                        defaultMessage="Page has been restricted!"
                    />
                </h1>
                <p>
                    <FormattedMessage
                        id="error.no_access_message"
                        defaultMessage="Oops, you dont have access to that page. Please talk with your administrator if you require access."
                    />
                </p>
            </div>
        </div>
    );
};

export default injectIntl(NoAccessPage);
