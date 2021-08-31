// @flow
import React from 'react';
import _ from 'lodash';
import { HOST, AVATAR, GROUP_AVATAR } from 'constants/ServiceURI';
import { injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import ReactImageFallback from 'react-image-fallback';
import messages from 'constants/Messages';
import Avatar from '@material-ui/core/Avatar';
import TimeAgo from 'components/TimeAgo';
import prettyBytes from 'pretty-bytes';

type DefaultProps = {
    intl: intlShape
};

export type OrgResults = Array<{
    authorityDisplayName: string,
    identifier: string,
    name: string,
    nodeRef: string,
    type: string,
    address?: string,
    city?: string,
    country?: string,
    phone?: string
}>;

type Props = {
    // eslint-disable-next-line react/no-unused-prop-types
    size?: string,
    term: string,
    results: {
        documents: Array<Object>,
        organizations: OrgResults,
        people: Array<Object>,
        requests: Array<Object>
    }
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        position: 'relative',
        width: '100%',
        '& .row': {
            color: '#333',
            cursor: 'pointer',
            display: 'flex',
            padding: '.5em 1.5em'
        },
        '& .row:hover h1': {
            textDecoration: 'underline'
        },
        '& .row:nth-child(odd)': {
            background: '#f9f9f9'
        },
        '& .row:hover': {
            background: '#d7f3e2!important'
        }
    },

    searchWrapper: (props: Props) => {
        return {
            position: 'absolute',
            top: '-2.1em',
            left: props.size === 'small' ? '8.85em' : '16.1em',
            paddingBottom: '1em',
            width: '80%',
            zIndex: 9999,
            background: '#ffffff',
            border: '1px solid #cecece',
            boxShadow: '0px 5px 12px -2px #ededed',
            maxHeight: '530px',
            overflowY: 'auto',
            overflowX: 'hidden',

            '& .row-sepatator': {
                borderTop: '1px solid #ecebeb',
                marginTop: '1em'
            },

            '& .row-sepatator:first-child': {
                borderTop: 0,
                marginTop: 0,
                paddingTop: 0
            },

            '& .empty': {
                textAlign: 'left',
                padding: '1em 0 0em 1.25em',
                fontWeight: 400
            }
        };
    },
    thumbnail: {
        width: '50px',
        height: '50px',
        marginRight: '1em',
        boxShadow: '0px 1px 2px #c2c0c0'
    },
    folderIcon: {
        width: '50px',
        height: '50px',
        marginRight: '1em',
        color: '#868686',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        marginRight: '1em',
        boxShadow: '0px 1px 2px #c2c0c0'
    },
    detailWrapper: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'left'
    },
    categoryTitle: {
        marginBottom: '1em',
        fontWeight: 400,
        fontSize: '1.1em',
        marginTop: '1em',
        paddingLeft: '1em',
        textAlign: 'left'
    },
    title: {
        fontWeight: '300',
        fontSize: '1.05em',
        margin: '0',
        lineHeight: '1.2em'
    },
    details: {
        color: '#939393',
        marginTop: '.15em',
        fontSize: '0.9em'
    },
    workflowDetails: {
        color: '#939393',
        marginTop: '.15em',
        fontSize: '0.9em',
        maxWidth: '400px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
});

const ResultSet = ({ results, intl, term, size }: Props) => {
    const classes = useStyles({ size });

    if (!results || _.isEmpty(results)) return null;
    const { documents, requests, people, organizations } = results;

    const allEmptyResults =
        _.isEmpty(documents) &&
        _.isEmpty(requests) &&
        _.isEmpty(people) &&
        _.isEmpty(organizations);

    // No resultsx
    if (term && term !== '' && allEmptyResults) {
        return (
            <div className={classes.root}>
                <div className={classes.searchWrapper}>
                    <div className="empty">
                        {intl.formatMessage(messages.noResultsFound)}
                    </div>
                </div>
            </div>
        );
    }

    if (allEmptyResults) {
        return null;
    }

    /**
     * Get thumbnail
     * @param {*} r
     */
    const getThumbnail = r => {
        const isLocked = r.permission.lockdown && !r.verified;

        if (r.type === 'cm:folder') {
            return (
                <div className={classes.folderIcon}>
                    <clr-icon shape="folder" size={40} />
                </div>
            );
        }
        return (
            <ReactImageFallback
                src={
                    isLocked
                        ? '/css/img/icons/thumbnail-locked.svg'
                        : `${HOST}${r.thumbnail}`
                }
                fallbackImage="/css/img/icons/generic-fiie.png"
                alt={r.name}
                className={classes.thumbnail}
            />
        );
    };

    /**
     * Render documents
     * @param {*} result
     */
    const renderDocuments = (docRows: Object) => {
        if (_.isEmpty(docRows)) return null;

        return (
            <div className="row-sepatator">
                <div className={classes.categoryTitle}>
                    {intl.formatMessage(messages.catDocuments)}
                </div>

                {_.map(docRows, r => {
                    const linkURL =
                        r.type === 'cm:folder'
                            ? `/documents#/${r.breadcrumb}`
                            : `/documents/details/${r.nodeRef.replace(
                                'workspace://SpacesStore/',
                                ''
                            )}`;

                    return (
                        <Link className="row" key={r.nodeRef} to={linkURL}>
                            <div>{getThumbnail(r)}</div>
                            <div className={classes.detailWrapper}>
                                <h1 className={classes.title}>{r.name}</h1>

                                {r.size && (
                                    <div className={classes.details}>
                                        {prettyBytes(r.size)}
                                    </div>
                                )}

                                <div className={classes.details}>
                                    <span>
                                        <TimeAgo date={r.modified} />
                                    </span>{' '}
                                    | <span>{r.modifier} </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    };

    /**
     * Render people
     * @param {*} result
     */
    const renderPeople = (peopleRows: Object) => {
        if (_.isEmpty(peopleRows)) return null;

        return (
            <div className="row-sepatator">
                <div className={classes.categoryTitle}>
                    {intl.formatMessage(messages.catPeople)}
                </div>

                {_.map(peopleRows, r => {
                    const link = `/people/users/${r.userName}`;

                    return (
                        <Link className="row" key={r.userName} to={link}>
                            <div>
                                <Avatar
                                    src={AVATAR(r.userName)}
                                    alt={r.userName}
                                    className={classes.avatar}
                                />
                            </div>
                            <div className={classes.detailWrapper}>
                                <div className={classes.title}>
                                    {r.firstName} {r.lastName}
                                </div>
                                <div className={classes.details}>
                                    {r.userName}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    };

    /**
     * Render organization
     * @param {*} result
     */
    const renderOrganizations = (orgRows: OrgResults) => {
        if (_.isEmpty(orgRows)) return null;

        return (
            <div className="row-sepatator">
                <div className={classes.categoryTitle}>
                    {intl.formatMessage(messages.catOrganizations)}
                </div>

                {_.map(orgRows, r => {
                    return (
                        <Link
                            className="row"
                            key={r.authorityDisplayName}
                            to={`/organizations/profile/${r.identifier}`}
                        >
                            <div>
                                <Avatar
                                    src={GROUP_AVATAR(_.toLower(r.identifier))}
                                    alt={r.authorityDisplayName}
                                    className={classes.avatar}
                                />
                            </div>
                            <div className={classes.detailWrapper}>
                                <div className={classes.title}>
                                    {r.authorityDisplayName}
                                </div>
                                <div className={classes.details}>
                                    {r.city}, {r.country}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    };

    /**
     * Render requests
     * @param {*} result
     */
    const renderRequests = (requestRows: Object) => {
        if (_.isEmpty(requestRows)) return null;

        return (
            <div className="row-sepatator">
                <div className={classes.categoryTitle}>
                    {intl.formatMessage(messages.catRequests)}
                </div>

                {_.map(requestRows, (r: Object) => {
                    return (
                        <Link
                            className="row"
                            key={r.id}
                            to={`/workflow/details/${r.id}`}
                        >
                            <div className={classes.folderIcon}>
                                <clr-icon shape="tasks" size={40} />
                            </div>

                            <div className={classes.detailWrapper}>
                                <div className={classes.title}>{r.title}</div>
                                <div className={classes.workflowDetails}>
                                    {r.description}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={classes.root}>
            <div className={classes.searchWrapper}>
                {renderDocuments(results.documents)}
                {renderRequests(results.requests)}
                {renderPeople(results.people)}
                {renderOrganizations(results.organizations)}
            </div>
        </div>
    );
};

export default injectIntl(ResultSet);
