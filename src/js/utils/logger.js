// @flow
/* eslint-disable no-console */
import React from 'react';

/**
 * Simple log function to change console color
 * @param msg
 * @param color
 */
export function log(msg: string, type?: string, obj?: any) {
    let color = null;

    if (process.env.NODE_ENV === 'test') return null;

    switch (type) {
        case 'red':
            color = 'background: #ED5858; color: #fff';
            break;
        case 'green':
            color = 'background: #64D484; color: #fff';
            break;
        case 'yellow':
            color = 'background: #FFD466; color: #fff';
            break;
        case 'blue':
            color = 'background: #35bddc; color: #fff';
            break;
        case 'purple':
            color = 'background: #9013FE; color: #fff';
            break;
        case 'cyan':
            color = 'background: #68d9bd; color: #fff';
            break;
        default:
            color = 'background: #35bddc; color: #fff';
    }

    console.log(`%c ${msg}`, color);

    // Wrap object so it's easier to see
    if (obj) {
        console.log(obj);
        console.log(`%c ${msg}`, color);
    }
}

export const prefixer = (prefix: string, msg: string): string =>
    `${prefix} ${msg}`;

export const logRender = (WrappedComponent: any) => {
    return (props: Object) => {
        log(
            `render ${WrappedComponent.displayName ||
                WrappedComponent.name ||
                'Component'}`,
            'purple',
            props
        );
        return <WrappedComponent {...props} />;
    };
};
