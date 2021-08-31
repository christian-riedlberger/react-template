// @flow

export type Search = {
    term?: string,
    name?: string,
    sort?: {
        name: string,
        direction: string
    },
    paging: {
        maxItems: number,
        skipCount: number
    },
    filter: Array<Object>,
    searchTerm: {
        term: string
    }
};

export type Paging = {
    totalItems: number,
    page: number,
    pageSize: number
};
export type ImageInformation = {
    dataUrl: string,
    name: string
};

export type User = {
    userName: string,
    firstName: string,
    lastName: string,
    avatar: string
};
