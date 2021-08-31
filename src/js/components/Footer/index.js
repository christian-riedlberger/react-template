// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';
import { VERSION } from 'constants/Config';

type Props = {
    className?: string
};

/**
 *  @ package Global
 *  @component Footer
 *  @desc Global application footer
 *  @author: mike.priest
 */
const Footer = (props: Props) => {
    const { className } = props;

    return (
        <div id="footer" className={className}>
            <div>
                <FormattedMessage
                    {...messages.globalFooterTitle}
                    values={{
                        version:
                            localStorage.getItem('greenfence.VERSION') ||
                            VERSION
                    }}
                />
                <FormattedMessage {...messages.globalFooterCompany} />
            </div>
        </div>
    );
};

Footer.defaultProps = {
    className: ''
};

export default Footer;
