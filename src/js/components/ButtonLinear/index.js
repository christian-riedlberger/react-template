// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from 'components/Button';

import { hue4 } from 'constants/Theme';

type DefaultProps = {
    classes: Object
};
type Props = {
    onNext: Function,
    onBack: Function,
    onSkip: Function,
    nextText: string,
    backText: string,
    skipText: string,
    disabled: boolean
} & DefaultProps;

const styles = {
    buttonLinear: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        margin: '1.5em 0',
        width: '100%',
        justifyContent: 'end'
    },
    buttonSingle: {
        margin: '1.5em 0',
        width: '100%',
        textAlign: 'right'
    },
    line: {
        background: hue4,
        height: '1px',
        width: '100%',
        opacity: 0.25
    }
};

/**
 * Avatar
 * @param {*} props
 */
const ButtonLinear = (props: Props) => {
    const {
        onNext,
        onSkip,
        onBack,
        nextText,
        backText,
        skipText,
        classes,
        disabled
    } = props;

    const singleButton = !onBack && !onSkip;

    return (
        <div
            className={
                singleButton ? classes.buttonSingle : classes.buttonLinear
            }
        >
            {onBack && (
                <Button
                    text={backText || 'back'}
                    onClick={onBack}
                    color="grey"
                    size="medium"
                    disabled={disabled}
                />
            )}

            {onNext && onBack && <div className={classes.line} />}

            {onSkip && (
                <Button
                    text={skipText || 'next'}
                    onClick={onSkip}
                    color="grey"
                    disabled={disabled}
                />
            )}
            {onNext && (
                <Button
                    text={nextText || 'next'}
                    onClick={onNext}
                    disabled={disabled}
                />
            )}
        </div>
    );
};

export default withStyles(styles)(ButtonLinear);
