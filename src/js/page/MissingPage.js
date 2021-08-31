// @flow
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

/**
 *  Restricted Access Banner
 */
const MissingPage = () => {
    return (
        <div className="page-wrapper" style={{ backgroundColor: '#fff' }}>
            <div
                className="restricted"
                style={{
                    backgroundColor: '#fff',
                    margin: '0 auto',
                    width: 400,
                    paddingTop: '20em'
                }}
            >
                <img
                    src="/css/img/icons/404.svg"
                    alt="No Access"
                    style={{
                        width: 170,
                        float: 'left',
                        marginRight: '1em'
                    }}
                />
                <div style={{ paddingTop: '7em' }}>
                    <h1>
                        <FormattedMessage
                            id="error.missing_page_title"
                            defaultMessage="Oops!"
                        />
                    </h1>
                    <p>
                        <FormattedMessage
                            id="error.missing_page_message"
                            defaultMessage="You seem to have found a page that we did not build."
                        />
                    </p>
                </div>
            </div>
        </div>
    );
};

export default injectIntl(MissingPage);
