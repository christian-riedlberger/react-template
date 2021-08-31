import _ from 'lodash';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

/**
 *  Types
 */
type DefaultProps = {
    classes: Object
};

type Props = {
    items: Array<Object>
} & DefaultProps;

const styles = {
    root: {
        '& .alice-carousel__dots': {
            margin: '.25em 0 0 0'
        },
        '& .alice-carousel__dots-item': {
            backgroundColor: '#D5D5D5',
            width: '5px',
            height: '5px'
        },
        '& .alice-carousel__dots-item:not(:last-child)': {
            marginRight: '5px'
        },
        '& .alice-carousel__dots-item.__active': {
            backgroundColor: '#979797'
        }
    }
};

class Carousel extends Component<Props> {
    render() {
        const { items, classes } = this.props;

        return (
            <div className={classes.root}>
                <AliceCarousel
                    {...this.props}
                    buttonsDisabled
                    items={_.map(items, (item, i) => (
                        <div key={i}>{item}</div>
                    ))}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Carousel);
