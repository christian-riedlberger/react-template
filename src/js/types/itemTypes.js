// @flow

/**
 *  Item prop types
 */
export type Item = {
    nodeRef: string,
    modified?: string,
    modifier?: string,
    name?: string,
    collectionName?: string,
    description?: string,
    version?: string,
    interactionType?: string,
    sectionName?: string,
    type?: string,
    friends?: Array<string>,
    enemies?: Array<string>
}

/**
 *  Item search type
 */
export type Search = {
    filter?: string,
    term?: string,
    name?: string,
    sort?: boolean,
    desc?: boolean,
    sectionRef?: string,
    customData?: Array<string>,
    skipCount?: number,
    pageSize?: number,
    type?: string,
    collection?: string
}
