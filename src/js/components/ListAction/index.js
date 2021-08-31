// @flow
import _ from 'lodash';
import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import Icon from 'components/Icon';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    data: Object,
    actions: any,
    icon: string
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        borderTop: '1px solid #EAEAEA',
        padding: '2em 1.5em',
        '& .list-item': {
            display: 'flex'
        }
    },
    icon: {
        color: '#C6C9CF',
        fontSize: '2.5em',
        marginRight: '.5em',
        maxWidth: '1em'
    },
    button: {
        float: 'right'
    }
});

/**
 * Definition of a pie chart
 * @param {*} param0
 */
const ListAction = ({ data, icon, actions }: Props) => {
    const classes = useStyles();

    return _.map(data, (a, i) => {
        const activeClass = a.active ? '-active' : '';

        return (
            <div key={i} className={classes.root}>
                <div className={classes.button}>{actions}</div>

                <div className="list-item">
                    <Icon
                        id={`${icon}${activeClass}`}
                        className={classes.icon}
                    />
                    <div>
                        <span>{a.title}</span>
                        <div className="supplement">{a.desc}</div>
                    </div>
                </div>

                <p style={{ clear: 'both' }} />
            </div>
        );
    });
};

export default injectIntl(ListAction);
