// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { textgrey, textblack } from 'constants/Theme';
import messages from 'constants/Messages';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    name: string,
    onClick: Function,
    onDelete?: Function
} & DefaultProps;

const useStyles = makeStyles({
    breadcrumb: {
        display: 'inline-flex'
    },
    link: {
        color: props => (props.inactive ? textgrey : textblack),
        cursor: 'pointer',

        '&:hover': {
            color: props => (props.inactive ? textgrey : textblack),
            textDecoration: props => (props.inactive ? '' : 'underline')
        }
    }
});

const Crumb = (props: Props) => {
    const { intl, name, onClick, onDelete } = props;
    const classes = useStyles(props);

    const ConditionalWrapper = ({ condition, wrapper, children }) =>
        condition ? wrapper(children) : children;

    return (
        <div className={classes.breadcrumb}>
            <ConditionalWrapper
                condition={onDelete}
                wrapper={children => (
                    <Tooltip
                        title={intl.formatMessage(messages.reset)}
                        placement="right-start"
                    >
                        {children}
                    </Tooltip>
                )}
            >
                <a className={classes.link} onClick={() => onClick(name)}>
                    {name}
                </a>
            </ConditionalWrapper>
        </div>
    );
};

export default injectIntl(Crumb);
