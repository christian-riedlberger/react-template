// @flow
import _ from 'lodash';
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import { MAIN_MENU_LINKS, DISABLE_SUBNAV } from 'constants/Config';
import NavMain from '../NavMain';
import NavSub from '../NavSub';

const styles = {
    root: {
        display: 'flex',
        'flex-direction': 'row',
        height: '100vh'
    }
};

type DefaultProps = {
    classes: Object
};

type Props = {
    access: Object,
    intl: intlShape
} & DefaultProps;

/**
 *  @package App
 *  @component Nav
 *  @desc Main navigation
 *  @author: mike.priest
 */
class Nav extends Component<Props> {
    renderSubNav = () => {
        const urlPath = _.compact(window.location.pathname.split('/'));

        // Get first path name
        let firstPath = _.find(MAIN_MENU_LINKS, o => {
            return o.title === urlPath[0];
        });

        // Is it a child page?
        if (
            firstPath &&
            firstPath.link !== window.location.pathname.substr(1)
        ) {
            const exactMatch = _.find(firstPath.children, o => {
                const regEx = new RegExp(o.link);
                if (o.inheritParent) return false;
                return regEx.test(window.location.pathname);
            });

            if (exactMatch) firstPath = exactMatch;
        }

        if (firstPath && firstPath.children) {
            return <NavSub title={urlPath[0]} links={firstPath.children} />;
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <NavMain {...this.props} />
                {!DISABLE_SUBNAV && this.renderSubNav()}
            </div>
        );
    }
}

export default withStyles(styles)(injectIntl(Nav));
