import React, { useState, useEffect } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import TabLined from 'components/TabLined';
import Header from 'components/Header';
import LayoutUsers from 'components/LayoutUsers';
import LayoutGroup from 'components/LayoutGroup';
import InformationPage from 'components/InformationPage';
import { NAMESPACE } from 'constants/Config';
import messages from 'constants/Messages';

const NAMESPACE_PEOPLE_USER = `${NAMESPACE}.people.users`;

type DefaultProps = {
    intl: intlShape
};

type Props = {
    startIndex: number
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '61vh',
        width: '100%',
        '& .MuiTypography-root.MuiTypography-body1': {
            width: '100%'
        },
        '& .MuiPaper-root': {
            width: '100%'
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    tabs: {
        marginTop: '1em',
        '& header': {
            paddingLeft: 0
        },
        '& span.MuiTab-wrapper': {
            textTransform: 'none',
            fontSize: '1.4em',
            fontWeight: 400
        },
        '& .MuiTabs-root': {
            minHeight: 'auto',
            marginTop: '1em'
        }
    }
}));

function LayoutPeople({ intl, startIndex }: Props) {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState(0);
    const panes = [<LayoutUsers />, <LayoutGroup />];
    const tabs = ['users', 'groups'];

    useEffect(() => {
        if (startIndex) setActiveTab(startIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (index: number) => {
        setActiveTab(index);
        window.history.replaceState({}, null, tabs[index]);
    };

    return (
        <div className={classes.root}>
            <Header page="people" disableBreadcrumb enableSearchbar />

            <InformationPage
                allowHide
                limit={500}
                fullWidth
                customStyle="header-tip"
                message="paymentReviewInformation"
                namespace={NAMESPACE_PEOPLE_USER}
            />

            <div className={classes.tabs}>
                <TabLined
                    tabs={tabs}
                    panes={panes}
                    variant="standard"
                    title={intl.formatMessage(messages.people)}
                    onChange={handleChange}
                    activeTab={activeTab}
                />
            </div>
        </div>
    );
}

export default withRouter(injectIntl(LayoutPeople));
