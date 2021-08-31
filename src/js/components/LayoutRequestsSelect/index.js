// @flow
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import { withRouter } from 'react-router';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { injectIntl, intlShape } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';

import messages from 'constants/Messages';
import * as theme from 'constants/Theme';
import Button from 'components/Button';
import FormRegistry from 'constants/FormRegistry';
import FieldListOptions from 'components/FieldListOptions';
import type { Option } from 'components/ListButtonOptions';

type DefaultProps = {
    intl: intlShape,
    router: {
        push: string => void
    }
};
type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {},
    list: {
        width: '100%',
        height: '50em',
        '& .MuiList-root': {
            maxHeight: '48em'
        },
        '& .MuiDivider-root': {
            display: 'none'
        },
        '& .MuiListItem-root': {
            minHeight: '6em'
        }
    },
    search: {
        marginLeft: 10,
        width: '98%'
    },
    select: {
        padding: '0px !important',
        backgroundColor: theme.hue1
    },
    icon: {
        padding: 12
    }
});

const LayoutRequestsSelect = (props: Props) => {
    const { intl, router } = props;
    const classes = useStyles();
    const [selectedOption, setOption] = useState(null);

    // Get only request forms
    const requestForms = _.filter(FormRegistry, { type: 'request' });

    const options: Array<
        Option & { formId: String, titleLabel: String }
    > = _.map(requestForms, req => ({
        ...req,
        name: req.titleLabel,
        nodeRef: req.formId,
        secondary: req.descriptionLabel,
        secondaryIcon:
            selectedOption && selectedOption.formId === req.formId ? (
                <RadioButtonCheckedIcon style={{ color: theme.green }} />
            ) : (
                <RadioButtonUncheckedIcon />
            )
    }));

    const onChange = (option: String) => {
        setOption(_.find(options, { nodeRef: option }) || null);
    };

    const handleClick = () => {
        router.push(
            `/requests/drafts/edit?workflowId=${
                selectedOption ? selectedOption.workflowId : ''
            }&formId=${selectedOption ? selectedOption.formId : ''}`
        );
    };

    return (
        <div className={classes.root}>
            <Grid>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    {intl.formatMessage(messages.labelRequestType)}
                </Typography>

                <FieldListOptions
                    input={{
                        onChange,
                        value: selectedOption ? selectedOption.nodeRef : null
                    }}
                    options={options}
                />

                <div style={{ marginTop: '2em' }}>
                    <Button
                        text="start"
                        className={classes.button}
                        disabled={!selectedOption}
                        onClick={handleClick}
                    />
                </div>
            </Grid>
        </div>
    );
};

export default compose(
    withRouter,
    injectIntl
)(LayoutRequestsSelect);
