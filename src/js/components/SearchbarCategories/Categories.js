// @flow
import _ from 'lodash';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as theme from 'constants/Theme';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    size: string,
    category: Object,
    categories: Array<Object>,
    onChange: Function
} & DefaultProps;

const style = {
    root: {
        display: 'inline-block',
        borderLeft: '1px solid #CECECE',
        borderTop: '1px solid #CECECE',
        borderBottom: '1px solid #CECECE',
        boxShadow: 'none',
        padding: '2px 4px',
        alignItems: 'center',
        borderRadius: '5em 0 0 5em',
        paddingLeft: '.75em',
        width: 'auto'
    },
    button: {
        color: theme.hue5,
        height: '100%',
        width: '100%',
        textTransform: 'initial',
        backgroundColor: '#FFF',
        borderRadius: '5em 0 0 5em',
        justifyContent: 'space-between',
        fontWeight: '300'
    },
    icon: {
        marginLeft: '1em',
        fontSize: '1.5em',
        color: theme.hue4
    },
    small: {
        padding: '4px 4px 3px 0.75em'
    },
    large: {
        height: '4em',
        width: '15em'
    },
    largeText: {
        fontSize: '1.1em'
    }
};

const Categories = ({ category, categories, size, onChange, intl }: Props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (obj: Object) => {
        setAnchorEl(null);

        if (!obj.value) return;
        onChange(obj);
    };

    const message = _.isEmpty(category) ? 'category' : category.id;
    const activeMessage = messages[message] ? messages[message] : message;

    return (
        <Paper
            component="form"
            style={{
                ...style.root,
                ...(size === 'large' ? style.large : {}),
                ...(size === 'small' ? style.small : {})
            }}
        >
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{
                    ...style.button,
                    ...(size === 'large' ? style.largeText : {})
                }}
            >
                {intl.formatMessage(activeMessage)}{' '}
                <ExpandMoreIcon style={style.icon} />
            </Button>
            <Menu
                id="search-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {_.map(categories, cat => {
                    return (
                        <MenuItem
                            key={cat.id}
                            onClick={() => {
                                handleClose(cat);
                            }}
                        >
                            {intl.formatMessage(messages[cat.id])}
                        </MenuItem>
                    );
                })}
            </Menu>
        </Paper>
    );
};

export default injectIntl(Categories);
