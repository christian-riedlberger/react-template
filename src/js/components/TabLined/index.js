// @flow
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'constants/Messages';
import * as themeConst from 'constants/Theme';
import { REPO_SHARED } from 'constants/Config';

type DefaultProps = {
    intl: intlShape
};
type Props = {
    title: string,
    tabs: Array<string>,
    activeTab: number,
    panes?: Array<any>,
    renderAll: boolean,
    className?: string,
    tabPosition?: 'top' | 'bottom',
    noTranslate: boolean,
    variant?: string
} & ({ onChange: number => void, activeTab: number } | {}) &
    DefaultProps;

type Panel = {
    children: any,
    index: number,
    value: any
};

function TabPanel(props: Panel) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            // $FlowFixMe
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    tabs: {
        marginTop: '-1em',
        backgroundColor: '#ffffff',
        color: '#393c40',
        'padding-left': '.6em',
        '& button': {
            fontSize: '0.8em',
            fontFamily: 'Roboto'
        },
        '& .MuiTabs-indicator': {
            'background-color': themeConst.hue4
        },
        '& .MuiTab-root': {
            'min-width': '100px'
        }
    },
    pane: {
        '& .MuiBox-root': {
            'padding-right': 0,
            'padding-left': 0
        },
        '& .MuiDivider-inset': {
            'margin-left': 0
        },
        '& .MuiDivider-root': {
            'background-color': '#fff'
        }
    },
    tabsStandard: {
        marginTop: '0!important',
        backgroundColor: '#ffffff',
        color: '#393c40',
        '& .MuiTabs-flexContainer': { borderBottom: '1px solid #D9DFE5' },
        '& button': {
            padding: '1em 1.5em!important',
            marginRight: '0!important',
            fontFamily: 'Roboto',

            '& .MuiTab-wrapper': {
                fontSize: '1.6em!important',
                fontWeight: '300!important'
            }
        },
        '& .MuiTabs-indicator': {
            backgroundColor: `${themeConst.green}!important`
        },
        '& .MuiTab-root': {
            'min-width': '100px'
        }
    }
}));

const TabLined = (props: Props) => {
    // $FlowFixMe
    const {
        title,
        tabs,
        panes,
        className,
        onChange,
        activeTab,
        variant = null,
        intl,
        tabPosition = 'top',
        noTranslate,
        renderAll
    } = props;
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const variantTabStyles =
        variant === 'standard' ? classes.tabsStandard : classes.tabs;

    useEffect(() => {
        if (activeTab !== value && _.isNumber(activeTab)) setValue(activeTab);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const handleChange = (__event, newValue: number) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const Bar = (
        <AppBar position="static">
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label={title}
                className={variantTabStyles}
            >
                {_.map(tabs, (tab, i) => {
                    // Used for personal folder (personal/username)
                    const tabLabel = tab.split('/')[0];

                    let defaultMessage = `intl:${tabLabel}`;
                    if (messages[tabLabel]) {
                        defaultMessage = intl.formatMessage(messages[tabLabel]);
                    } else if (noTranslate) {
                        defaultMessage = tabLabel;
                    }

                    return tabLabel === REPO_SHARED ? (
                        <Tooltip
                            arrow
                            placement="right"
                            title={intl.formatMessage(messages.sharedTooltip)}
                        >
                            <Tab
                                key={`tab-tab-${i}`}
                                label={defaultMessage}
                                {...a11yProps(i)}
                            />
                        </Tooltip>
                    ) : (
                        <Tab
                            key={`tab-tab-${i}`}
                            label={defaultMessage}
                            {...a11yProps(i)}
                        />
                    );
                })}
            </Tabs>
        </AppBar>
    );
    return (
        <div className={clsx(classes.root, className)}>
            {tabPosition === 'top' && Bar}
            {!_.isEmpty(panes) &&
                (renderAll ? (
                    _.map(panes, (pane, i) => (
                        <TabPanel
                            key={`tab-panel${i}`}
                            value={value}
                            index={i}
                            className={classes.pane}
                        >
                            {pane}
                        </TabPanel>
                    ))
                ) : (
                    <TabPanel
                        key={`tab-panel${activeTab}`}
                        value={value}
                        index={activeTab}
                        className={classes.pane}
                    >
                        {panes[activeTab]}
                    </TabPanel>
                ))}
            {tabPosition === 'bottom' && Bar}
        </div>
    );
};
export default injectIntl(TabLined);
