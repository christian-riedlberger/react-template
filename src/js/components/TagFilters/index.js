import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

type DefaultProps = {};

type Props = {
    tags: Array<Object>,
    border?: boolean
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        paddingRight: '1.25em'
    },
    chip: {
        margin: theme.spacing(0.5),
        backgroundColor: '#f9f9f9'
    }
}));

const FilterTags = (props: Props) => {
    const classes = useStyles();
    const { tags, border } = props;
    const borderStyle = border ? { borderTop: '1px solid #d9dee2' } : {};

    // Nothing to render
    if (!tags || tags.length === 0) return null;

    return (
        <div style={borderStyle}>
            <div className={classes.root}>
                {_.map(tags, tag => {
                    return (
                        <Chip
                            size="small"
                            label={tag.text}
                            onDelete={tag.onClick}
                            className={classes.chip}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FilterTags;
