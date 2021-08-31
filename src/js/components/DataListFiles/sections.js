// @flow
import React from 'react';
import _ from 'lodash';
import { intlShape } from 'react-intl';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';

import { IconButton, Avatar, Tooltip } from '@material-ui/core';
import { MoreVert, SupervisedUserCircleRounded } from '@material-ui/icons';
import SharedIcon from '@material-ui/icons/PeopleOutlineOutlined';

import Button from 'components/Button';
import AvatarUserPopover from 'components/AvatarUserPopover';
import BreadCrumbPath from 'components/BreadCrumbPath';
import Permission from 'components/Permission';

import { fileExtension } from 'utils/string';
import messages from 'constants/Messages';

const iconStyles = {
    locked: {
        height: '1em',
        width: '1em',
        fontSize: '1.5em',
        color: '#ff5151',
        margin: '.5em 0'
    }
};

const crumbGreyStyles = {
    borderBottom: '1px solid #D9DEE3',
    padding: '0.75em 1em'
};

/**
 * Return user friendly file size string
 */
export const getFileSizeType = (type: string, size: string) => {
    if (type === 'cm:folder') return '-';
    return size ? prettyBytes(size) : size;
};

/**
 *  Render all rows on datatable
 */
export type FileProps = {
    files: Array<Object>,
    intl: intlShape,
    classes: Object,
    columns: Array<Object>,
    handleClickPermissions: Object => void,
    handleContextMenuOpen: (SytheticEvent, number, Object) => void
};

export const renderFiles = (props: FileProps) => {
    const {
        files,
        intl,
        classes,
        columns,
        handleClickPermissions,
        handleContextMenuOpen
    } = props;
    return _.map(files, (u, index) => {
        const canShare = _.get(u, 'permission.destroy');
        return _.map(columns, col => {
            switch (col.property) {
                case 'name': {
                    if (u.type === 'cm:folder') {
                        return (
                            <div
                                key={`name-${u.shortName || u.name}`}
                                className={classes.userCellStrong}
                            >
                                <clr-icon shape="folder" />
                                <div
                                    className={classes.username}
                                    data-cy={u.name}
                                >
                                    {u.name}
                                </div>

                                {u.isShared ? (
                                    <SharedIcon
                                        className={classes.sharedIcon}
                                    />
                                ) : null}
                                {canShare ? (
                                    <Tooltip
                                        title={intl.formatMessage(
                                            messages.share
                                        )}
                                        placement="top-end"
                                    >
                                        <div className={classes.shareButton}>
                                            <Button
                                                key="right-1"
                                                text="share"
                                                size="micro"
                                                color="outline"
                                                round
                                                onClick={(e: Object) => {
                                                    e.stopPropagation();
                                                    e.nativeEvent.stopImmediatePropagation();

                                                    handleClickPermissions(u);
                                                    return false;
                                                }}
                                            />
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <div />
                                )}
                            </div>
                        );
                    }

                    return (
                        <div
                            className={classes.userCellStrong}
                            key={`name-${u.shortName || u.name}`}
                        >
                            <Avatar
                                className={classes.avatar}
                                src={`/css/img/mimetypes/${fileExtension(
                                    u.name
                                )}.svg`}
                                alt={`${u.name}`}
                                variant="square"
                            >
                                F
                            </Avatar>

                            <div className={classes.username} data-cy={u.name}>
                                {u.name}
                            </div>
                            {u.isShared ? (
                                <SharedIcon className={classes.sharedIcon} />
                            ) : null}
                            {canShare ? (
                                <div className={classes.shareButton}>
                                    <Button
                                        key="right-1"
                                        text="share"
                                        size="micro"
                                        color="outline"
                                        round
                                        onClick={(e: Object) => {
                                            e.stopPropagation();
                                            e.nativeEvent.stopImmediatePropagation();

                                            handleClickPermissions(u);
                                            return false;
                                        }}
                                    />
                                </div>
                            ) : (
                                <div />
                            )}
                        </div>
                    );
                }

                case 'modified':
                case 'created':
                    return moment(u[col.property]).format('L, LT');

                case 'size': {
                    return getFileSizeType(u.type, u.size);
                }

                case 'actions': {
                    if (_.get(files, `${index}.permission.lockdown`)) {
                        return (
                            <div
                                className="align-right-stop"
                                key={`actions-locked-${u.shortName || u.name}`}
                            >
                                <Tooltip
                                    title={intl.formatMessage(
                                        messages.secureViewOnly
                                    )}
                                    aria-label={intl.formatMessage(
                                        messages.secureViewOnly
                                    )}
                                    style={iconStyles.locked}
                                >
                                    <clr-icon shape="lock" />
                                </Tooltip>
                            </div>
                        );
                    }

                    return (
                        <div
                            className={`align-right-stop cy-file-action cy-multi-file-action-${index}`}
                            key={`actions-${u.shortName || u.name}`}
                        >
                            <IconButton
                                onClick={e => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                    handleContextMenuOpen(e, index, u);
                                }}
                            >
                                <MoreVert />
                            </IconButton>
                        </div>
                    );
                }
                case 'modifier':
                    return (
                        <div key={`avatar-${u.shortName || u.name}`}>
                            <AvatarUserPopover
                                avatarName={u.modifier}
                                avatarDate={moment(u.modified).format('lll')}
                                onClose={e => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                }}
                            />
                        </div>
                    );

                default:
                    return `${col.property} ${u[col.property]}`;
            }
        });
    });
};

export type BreadCrumbProps = {
    classes: Object,
    activeFolder: Object,
    handleClickPermissions: Object => void,
    intl: intlShape,
    isLoading: boolean
};
/**
 * Render breadcrumb displayed above table
 */
export const renderBreadCrumb = (props: BreadCrumbProps) => {
    const {
        classes,
        activeFolder,
        handleClickPermissions,
        intl,
        isLoading
    } = props;

    if (!activeFolder || isLoading) return null;

    const Permissions = (
        <Permission permission={activeFolder.permission} access="all">
            <Tooltip
                title={intl.formatMessage(messages.share)}
                placement="right-start"
            >
                <IconButton
                    onClick={() => {
                        handleClickPermissions(activeFolder);
                    }}
                    className={classes.permissionIcon}
                    aria-label="permissions"
                >
                    <SupervisedUserCircleRounded />
                </IconButton>
            </Tooltip>
        </Permission>
    );

    return (
        <div style={crumbGreyStyles}>
            <div className={classes.align}>
                <BreadCrumbPath
                    path={activeFolder.breadcrumb}
                    buttonsRight={Permissions}
                />
            </div>
        </div>
    );
};

export default { renderFiles, renderBreadCrumb };
