// @flow
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';

import PermissionForm from './PermissionForm';
import TitleForm from './TitleForm';
import DetailForm from './DetailForm';

type DefaultProps = {
    intl: intlShape
};
type Props = {
    change: Function
} & DefaultProps;

function TabPanel(props: Object) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '400px'
    }
}));

const OrganizationTabs = (props: Props) => {
    const { intl } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
            >
                <Tab
                    className="cy-org-details"
                    label={intl.formatMessage(messages.basicDetails)}
                    {...a11yProps(0)}
                />
                <Tab
                    className="cy-org-access"
                    label={intl.formatMessage(messages.pageAccess)}
                    {...a11yProps(1)}
                />
            </Tabs>

            <TabPanel value={value} index={0} dir={theme.direction}>
                <TitleForm change={props.change} />
                <DetailForm change={props.change} />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                <PermissionForm {...props} />
            </TabPanel>
        </div>
    );
};

export default injectIntl(OrganizationTabs);
