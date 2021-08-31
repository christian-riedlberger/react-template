// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { compose } from 'recompose';
import messages from 'constants/Messages';
import { hue4 } from 'constants/Theme';

type DefaultProps = {
    classes: Object,
    intl: intlShape
};
type Props = {
    buttonsLeft: Array<any>,
    buttonsRight: Array<any>,
    buttonsBottom: Array<any>,
    flat: boolean,
    classRoot?: string,
    title?: string,
    borderBottom?: boolean
} & DefaultProps;

const styles = {
    buttonLinear: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',

        '& h1': {
            fontSize: '1.75em',
            fontWeight: '300',
            flexShrink: '0',
            margin: 0,
            marginTop: '-0.3em'
        },
        '& .MuiButtonBase-root': {
            margin: '0 .5em!important'
        },
        '& .header-line': {
            background: hue4,
            height: '1px',
            width: '100%',
            opacity: 0.25,
            margin: '0 1em'
        }
    },
    buttonFlat: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        margin: 0,
        paddingLeft: '1em',
        height: '3.3em',

        '& h1': {
            fontSize: '1.75em',
            fontWeight: '300',
            flexShrink: '0',
            margin: 0,
            marginTop: '-0.3em'
        },
        '& .MuiButtonBase-root': {
            margin: '0 .5em!important'
        },
        '& .header-line': {
            background: '#ffffff',
            height: '1px',
            width: '100%',
            opacity: 0.25,
            margin: '0 1em'
        }
    },
    buttonsFlatLeft: {
        width: 'auto',
        marginLeft: '0',
        flexGrow: 1,
        display: 'flex'
    }
};

/**
 * Avatar
 * @param {*} props
 */
const HeaderText = (props: Props) => {
    const {
        title,
        classRoot,
        flat,
        buttonsLeft,
        buttonsRight,
        buttonsBottom,
        classes,
        intl,
        borderBottom
    } = props;

    const flatStyle = flat ? classes.buttonFlat : null;

    const buttonsLeftWithStyle = buttonsLeft ? (
        <div className={classes.buttonsFlatLeft}>
            {_.map(buttonsLeft, (button, i) => (
                <div key={`header-text-${i}-button`}>{button}</div>
            ))}
        </div>
    ) : null;

    return (
        <div className="header-text">
            <div className={flatStyle || classRoot || classes.buttonLinear}>
                {title && (
                    <h1>
                        {messages[title]
                            ? intl.formatMessage(messages[title])
                            : `intl: ${title}`}
                    </h1>
                )}
                {buttonsLeftWithStyle}
                <div className="header-line" />
                {buttonsRight}
            </div>
            {buttonsBottom}
            {borderBottom && (
                <div style={{ borderBottom: '1px solid #d9dee2' }} />
            )}
        </div>
    );
};

export default compose(
    withStyles(styles),
    injectIntl
)(HeaderText);
