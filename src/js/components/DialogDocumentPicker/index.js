// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

import Dialog from 'components/Dialog';
import messages from 'constants/Messages';
import ListButtonOptions from 'components/ListButtonOptions';
import { grey0 } from 'constants/Theme';
import PickerContainer from 'containers/PickerContainer';
import type { ContainerProps as PickerContainerProps } from 'containers/PickerContainer';
import { DOCLIB } from 'constants/Config';

type defaultProps = {
    intl: intlShape,
    classes: Object
} & PickerContainerProps;

type Props = {
    passRef: Function,
    onClose: (Array<string>) => null,
    parentRef?: string,
    defaultValues?: Array<{ name: string, nodeRef: string }>
} & defaultProps;

type State = {
    selectedItems: Array<Object>,
    breadcrumbs: Array<Object>,
    results: Array<Object>,
    isItemsLoading: boolean
};

const styles = () => ({
    dialog: {},
    list: {
        width: '260px',
        height: '18em',
        display: 'block',
        '& ul': {
            maxHeight: '16.9em'
        },
        '& hr': {
            margin: 'unset'
        },
        border: `1px solid ${grey0}`
    },
    separator: {
        color: grey0
    },
    link: {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer'
        }
    },
    loading: {
        alignItems: 'center',
        textAlign: 'center'
    }
});

@injectIntl
@PickerContainer()
@withStyles(styles)
class DialogDocumentPicker extends Component<Props, State> {
    open: Function;
    close: Function;
    intialBreadcrumbs: Array<Object>;

    constructor(props: Props) {
        super(props);
        this.intialBreadcrumbs = props.parentRef
            ? []
            : [
                {
                    nodeName: DOCLIB,
                    name: 'Documents',
                    nodeRef: DOCLIB,
                    type: 'cm:folder'
                }
            ];

        this.state = {
            selectedItems: props.defaultValues || [],
            breadcrumbs: [],
            // eslint-disable-next-line react/no-unused-state
            results: [],
            isItemsLoading: false
        };
    }

    componentDidMount() {
        this.populateFields();
    }

    componentDidUpdate(prevProps: Props) {
        const { defaultValues } = this.props;
        if (!_.isEqual(defaultValues, prevProps.defaultValues)) {
            // eslint-disable-next-line
            this.setState({
                selectedItems: _.map(defaultValues, selected => ({
                    ...selected,
                    disabled: true
                }))
            });
        }

        if (
            !_.isEqual(
                _.get(prevProps, 'parentRef'),
                _.get(this.props, 'parentRef')
            )
        ) {
            this.props
                // $FlowFixMe
                .fetchFolder({ nodeRef: this.props.parentRef })
                .then(resp =>
                    this.setState({
                        breadcrumbs: [resp.action.payload.data]
                    })
                )
                .catch(e => {
                    throw new Error(JSON.stringify(e));
                });
        }
    }

    populateFields = () => {
        const { parentRef, fetchFolder } = this.props;
        this.setState({ isItemsLoading: true }, () => {
            if (parentRef && this.intialBreadcrumbs.length === 0) {
                fetchFolder({ nodeRef: parentRef })
                    .then(resp =>
                        this.setState({
                            breadcrumbs: [resp.action.payload.data.data],
                            isItemsLoading: false
                        })
                    )
                    .catch(e => {
                        this.setState({
                            isItemsLoading: false
                        });
                        throw new Error(JSON.stringify(e));
                    });
            } else {
                fetchFolder(this.intialBreadcrumbs[0])
                    .then(() =>
                        this.setState({
                            breadcrumbs: this.intialBreadcrumbs,
                            isItemsLoading: false
                        })
                    )
                    .catch(e => {
                        this.setState({
                            isItemsLoading: false
                        });
                        throw new Error(e);
                    });
            }
        });
    };

    /**
     * handle dialog save clicked
     */
    handleSave = () => {
        const { onClose, fetchFolder, parentRef } = this.props;
        const { selectedItems } = this.state;
        const results = _.cloneDeep(selectedItems);
        // cleanup state / redux
        if (parentRef) {
            this.setState(
                { breadcrumbs: [this.state.breadcrumbs[0]], selectedItems: [] },
                () => {
                    fetchFolder({ nodeRef: parentRef });
                }
            );
        } else {
            this.setState(
                { breadcrumbs: this.intialBreadcrumbs, selectedItems: [] },
                () => {
                    fetchFolder({ nodeName: DOCLIB });
                }
            );
        }

        if (onClose) {
            onClose(results);
        }
    };

    handleClose = () => {
        this.populateFields();
    };

    /**
     * handle breadcumb clicked
     */
    handleBreadCrumb = (index: number) => {
        const { fetchFolder } = this.props;
        this.setState(
            state => ({
                ...state,
                breadcrumbs: state.breadcrumbs.slice(0, index + 1)
            }),
            () => {
                const selected = this.state.breadcrumbs.slice(-1)[0];
                if (selected.nodeName) {
                    return fetchFolder({
                        nodeName: selected.nodeName
                    });
                }
                return fetchFolder({ nodeRef: selected.nodeRef });
            }
        );
    };

    /**
     * handle a file clicked
     */
    handleSelect = (option: Object) => {
        if (option.type === 'cm:folder') {
            const { fetchFolder } = this.props;
            fetchFolder({ nodeRef: option.nodeRef });
            this.setState(state => ({
                ...state,
                breadcrumbs: _.concat(state.breadcrumbs, option)
            }));
        }

        if (option.type === 'cm:content') {
            this.setState(state => ({
                ...state,
                selectedItems: _.concat(state.selectedItems, option)
            }));
        }
    };

    /**
     * handle removing a file from selected options
     */
    handleRemove = (option: Object, index: number) => {
        const { selectedItems } = this.state;
        const newSelected = _.filter(
            selectedItems,
            (__, itemIndex) => itemIndex !== index
        );

        this.setState(state => ({
            ...state,
            results: _.map(state.results, file => ({
                ...file,
                disabled: _.find(newSelected, { nodeRef: file.nodeRef })
            })),
            selectedItems: newSelected
        }));
    };

    formatItem = (r: Object) => {
        return {
            ...r,
            name:
                r.name.length > 16 && r.type !== 'cm:folder'
                    ? `${r.name.slice(0, 16)}...`
                    : r.name,
            icon:
                r.type === 'cm:folder' ? (
                    <clr-icon shape="folder" />
                ) : (
                    <clr-icon shape="file" />
                ),
            tooltip: r.name.length > 16 && r.type !== 'cm:folder' && r.name,
            secondaryIcon: r.type !== 'cm:folder' && (
                <clr-icon shape="plus-circle" />
            )
        };
    };

    renderBreadCrumb = () => {
        const { classes } = this.props;
        const { breadcrumbs } = this.state;

        const path = _.map(breadcrumbs, b => ({
            ...b,
            title: b.name
        }));

        return (
            <Breadcrumbs
                separator={<span className={classes.separator}>/</span>}
                maxItems={4}
                aria-label="breadcrumb"
            >
                {_.map(path, (link, index) => {
                    if (index === path.length - 1) {
                        return (
                            <Typography
                                key={link.title}
                                className={classes.active}
                            >
                                {link.title}
                            </Typography>
                        );
                    }

                    return (
                        <span
                            className={classes.link}
                            color="inherit"
                            href={link.href}
                            key={link.title}
                            onClick={() => this.handleBreadCrumb(index)}
                        >
                            {link.title}
                        </span>
                    );
                })}
            </Breadcrumbs>
        );
    };

    render() {
        const {
            intl,
            passRef,
            classes,
            items,
            isItemsLoading: containerItemsLoading
        } = this.props;
        const { selectedItems, isItemsLoading } = this.state;

        const filteredItems = _.map(items, file => ({
            ...file,
            disabled: !!_.find(selectedItems, { nodeRef: file.nodeRef })
        }));

        const hideSave = !(selectedItems.length > 0);

        return (
            <div>
                <Dialog
                    className={classes.dialog}
                    intl={intl}
                    ref={passRef}
                    hideSave={hideSave}
                    title={intl.formatMessage(messages.pickerDialogTitle)}
                    onSave={this.handleSave}
                    onClose={this.handleClose}
                    onOpen={() =>
                        this.setState({
                            selectedItems: _.map(
                                _.get(this.props, 'defaultValues', []),
                                selected => ({
                                    ...selected,
                                    disabled: true
                                })
                            )
                        })
                    }
                    primaryActionMessage={intl.formatMessage(
                        messages.confirmSelectedFiles
                    )}
                >
                    <Grid container spacing={4}>
                        <Grid
                            xs={12}
                            style={{ padding: '.5em 1.25em 0 1.25em' }}
                        >
                            {this.renderBreadCrumb()}
                        </Grid>
                        <Grid item xs={6}>
                            <ListButtonOptions
                                className={classes.list}
                                options={_.map(filteredItems, this.formatItem)}
                                onPrimaryClick={this.handleSelect}
                                isLoading={
                                    isItemsLoading || containerItemsLoading
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ListButtonOptions
                                className={classes.list}
                                options={_.map(selectedItems, s => ({
                                    ...s,
                                    secondaryIcon: !s.disabled && (
                                        <clr-icon shape="times" />
                                    )
                                }))}
                                onPrimaryClick={this.handleRemove}
                            />
                        </Grid>
                    </Grid>
                </Dialog>
            </div>
        );
    }
}

export default DialogDocumentPicker;
