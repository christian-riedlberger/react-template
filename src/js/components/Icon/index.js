// @flow
import React from 'react';

type Props = {
    id: string,
    className?: string
};

/**
 * Definition of a pie chart
 * @param {*} param0
 */
const Icon = ({ id, className }: Props) => {
    return <span className={`ico-${id} ${className || ''}`} />;
};

Icon.defaultProps = {
    className: ''
};

export default Icon;
