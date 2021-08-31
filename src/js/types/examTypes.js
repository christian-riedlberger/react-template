// @flow

/**
 *  Collection prop types
 */
export type Browser = {
    name: string,
    description: string,
    parentRef: string,
    score: number,
    time: number
}

/**
 *  Collection prop types
 */
export type Search = {
    term?: string,
    name?: string,
    sort?: boolean
}
