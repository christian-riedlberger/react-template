// @flow

/**
 *  Collection prop types
 */
export type Collection = {
    name: string,
    description: string,
    color?: string
};

/**
 *  Collection prop types
 */
export type Search = {
    term?: string,
    name?: string,
    sort?: boolean
};

/**
 *  Metadata property
 */
export type TProperty = {
    className?: string,
    icon: string, // Used for type and icon
    name: string,
    title: string,
    type: string,
    default?: string | number,
    mandatory?: boolean,
    isEdit?: boolean,
    options?: Array<string>
};

/**
 *  Metadata aspect
 */
export type TAspect = {
    name: string,
    title: string,
    namespace: string,
    properties: Array<TProperty>
};

/**
 *  Metadata domain
 */
export type TDomain = {
    title: string,
    id: string,
    children: Array<TDomain>
};
