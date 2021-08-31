// @flow
export type Group = {
    nodeRef: string,
    isNew: boolean,
    shortName: string,
    fullName: string,
    displayName: string,
    parentName: string,
    fullName: string,
    roles: string,
    authorityType: 'GROUP' | 'USER',
    isOrganization: boolean,
    isRestricted: boolean,
    length: number,
    groupRootOrganization: string,
    avatarUrl: string
};

export type Organization = {
    isNew: boolean,
    shortName: string,
    displayName: string,
    parentName: string,
    roles: string,
    authorityType: 'GROUP',
    address: string,
    city: string,
    country: string,
    color?: string,
    postalcode: string,
    phone?: string,
    website: string,
    avatar: any,
    avatarUrl: string,
    long: string,
    lat: string,
    twitter?: string,
    facebook?: string,
    linkedin?: string,
    about?: string,
    tag?: string,
    email?: string,
    about?: string,
    locationVisible?: boolean,
    tagVisible?: boolean,
    aboutVisible?: boolean,
    phoneVisible?: boolean,
    emailVisible?: boolean,
    twitterVisible?: boolean,
    linkedinVisible?: boolean,
    facebookVisible?: boolean
};

export type GroupBrowseReload = 'Initialize' | 'Next' | 'Update' | 'All';

export type GroupsBrowse = {
    type: GroupBrowseReload,
    columns: Array<Object> | null,
    items: Array<Object> | null
};

export const PEOPLE_ROLE: string = 'people';
export const DASHBOARD_ROLE: string = 'configure';
