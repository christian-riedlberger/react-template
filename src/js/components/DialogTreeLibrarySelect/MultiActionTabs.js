// @flow
import _ from 'lodash';
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { injectIntl } from 'react-intl';
import type { Node } from 'react';

type DefaultProps = {};
type Props = {
    tabs: Array<string>,
    panes: Array<Node>,
    onChange?: number => void // optional change listener
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
        width: '100%',
        marginTop: '-1em',

        '& .MuiTabs-flexContainer': {
            borderBottom: '1px solid #efecec'
        }
    }
}));

const MultiActionTabs = (props: Props) => {
    const { tabs, panes, onChange } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
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
                {_.map(tabs, (tab, index) => {
                    return (
                        <Tab
                            key={`cy-tab-${index}`}
                            className={`cy-tab-${index}`}
                            label={tab}
                            {...a11yProps(index)}
                        />
                    );
                })}
            </Tabs>

            {_.map(panes, (pane, index) => {
                return (
                    <TabPanel value={value} index={index} dir={theme.direction}>
                        {pane}
                    </TabPanel>
                );
            })}
        </div>
    );
};

export default injectIntl(MultiActionTabs);
