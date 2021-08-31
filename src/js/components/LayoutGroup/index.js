// @flow
import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import BreadCrumbGroup from 'components/BreadCrumbGroup';
import ListCompany from 'components/ListCompany';
import { FormName } from 'components/FormFilterGroups';

// import HeaderGroups from 'components/HeaderGroups';
// import DrawerFilterGroups from 'components/DrawerFilterGroups';

type DefaultProps = {
    classes: Object
};

type Props = {} & DefaultProps;

type State = {
    filter: Object,
    filterOpen: boolean
};

const styles = {
    root: {
        background: '#f8f9fb',
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: '1em'
    },
    groups: {
        '& button.MuiButtonBase': {
            padding: '12px!important',
            margin: '0!important'
        },
        '& .MuiDivider-root': {
            'background-color': '#e4e4e4!important'
        }
    },
    navigation: {
        display: 'flex',
        justifyContent: 'space-between'
    }
};

@withStyles(styles)
@connect(state => ({ formValues: _.get(state.form[FormName], 'values') }))
class LayoutGroup extends PureComponent<Props, State> {
    // constructor(props: Props) {
    //     super(props);
    //     this.state = {
    //         filter: {},
    //         filterOpen: false
    //     };
    // }

    // debouncedSearch = _.debounce(
    //     () => this.props.fetchUsers(this.getSearchParams()),
    //     500
    // );

    // /**
    //  * Get the parameters to send via REST
    //  */
    // getSearchParams = () => {
    //     const { filter } = this.state;
    //     const searchParams = {
    //         searchTerm: filter && filter.term ? { term: filter.term } : null
    //     };
    //     return searchParams;
    // };

    // handleFilterOpen = () => {
    //     this.setState({ filterOpen: true });
    // };

    // handleFilterClose = (values: Object) => {
    //     if (!_.isEqual(values, this.state.filter)) {
    //         this.setState(
    //             () => ({
    //                 filterOpen: false,
    //                 filter: values || {}
    //             }),
    //             () => this.debouncedSearch()
    //         );
    //     } else {
    //         this.setState({ filterOpen: false });
    //     }
    // };

    render() {
        const { classes } = this.props;
        // const { filterOpen, filter } = this.state;

        return (
            <div>
                <div style={{ marginTop: '-1.7em' }}>
                    {/* <HeaderGroups
                        onFilter={this.handleFilterOpen}
                        formName={FormName}
                        formValues={filter}
                    /> */}
                    <BreadCrumbGroup />
                </div>
                <div className={classes.root}>
                    <div className={classes.groups}>
                        <ListCompany />
                        {/* <DrawerFilterGroups
                                open={filterOpen}
                                onClose={this.handleFilterClose}
                            /> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default LayoutGroup;
