/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import { intlShape, injectIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import List from '@material-ui/core/List';
import messages from 'constants/Messages';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import SearchInput from 'components/SearchInput';
import FieldFilterSelector from 'components/FieldFilterSelector';
import { log } from 'utils/logger';

type Props = {
    intl: intlShape,
    users: Array<String>,
    organizations: Array<String>,
    handleUserFilter: Function,
    handleOrganizationFilter: Function
};

type Panel = {
    children: any,
    index: any,
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

const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
});

const SearchSelector = (props: Props) => {
    const { intl } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [users, setUsers] = React.useState(props.users);
    const [organizations, setOrganizations] = React.useState(
        props.organizations
    );

    // TODO - Create the search array value from the initial value
    const [usersSearchValue, setUsersSearchValue] = React.useState(props.users);
    const [orgSearchValue, setOrgSearchValue] = React.useState(
        props.organizations
    );

    const handleSearchResult = (shortName, fieldType) => {
        if (fieldType === 'users') {
            // Remove the value from the array
            const newUsersSearchVals = _.reject(usersSearchValue, {
                shortName
            });
            setUsersSearchValue(newUsersSearchVals);
        } else if (fieldType === 'organizations') {
            const newOrgsSearchVals = _.reject(orgSearchValue, {
                shortName
            });
            setOrgSearchValue(newOrgsSearchVals);
        }
    };

    // Handle the tab change event
    function handleTabChange(event, newValue) {
        setValue(newValue);
    }

    // Create the initial object for state
    const createCheckedObj = objArr => {
        return _.map(objArr, obj => {
            return {
                ...obj,
                checked: false
            };
        });
    };

    // Set initial object from arrays for state
    const userCheckedObj = createCheckedObj(users);
    const orgCheckedObj = createCheckedObj(organizations);
    const [usersArrState, setUsersArrState] = React.useState(userCheckedObj);
    const [orgsArrState, setOrgsArrState] = React.useState(orgCheckedObj);

    // Handle when the user checks a check box
    const handleCheckedEvent = (fieldType, fieldValue) => event => {
        log('fieldValue', 'blue', { fieldValue });
        if (fieldType === 'users') {
            const newUsersArrState = _.map(usersArrState, user => {
                if (user.shortName === fieldValue.shortName)
                    return {
                        ...user,
                        checked: event.target.checked
                    };
                return user;
            });

            setUsersArrState({
                usersArrState: newUsersArrState
            });

            const newUsersSearchVals = _.reject(usersSearchValue, {
                shortName: fieldValue.shortName
            });
            setUsersSearchValue(newUsersSearchVals);
        } else if (fieldType === 'organizations') {
            const newOrgsArrState = _.map(orgsArrState, org => {
                if (org.shortName === fieldValue.shortName)
                    return {
                        ...org,
                        checked: event.target.checked
                    };
                return org;
            });
            setOrgsArrState({
                orgsArrState: newOrgsArrState
            });
            const newOrgsSearchVals = _.reject(orgSearchValue, {
                shortName: fieldValue.shortName
            });
            setOrgSearchValue(newOrgsSearchVals);
        }
    };

    const renderCheckboxFields = (fieldType, checkboxValuesArr) => {
        return _.map(checkboxValuesArr, valueObj => {
            return (
                <ListItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={valueObj.checked}
                                onChange={handleCheckedEvent(
                                    fieldType,
                                    valueObj
                                )}
                                value={valueObj.shortName}
                            />
                        }
                        label={valueObj.displayName}
                    />
                </ListItem>
            );
        });
    };

    const handleCheckedItem = (selected, displayName) => {
        log('selected', 'blue', { selected });
        log('displayName', 'blue', { displayName });
    };

    // const handleSearchChange = () => {

    // }

    // const getFilters = () => {
    //     const userArrFinal = [];
    //     const orgsArrFinal = [];
    //     _.forEach(usersArrState, (val, key) => {
    //         if (usersArrState[key] === true) userArrFinal.push(key);
    //     });
    //     _.forEach(orgsArrState, (val, key) => {
    //         if (orgsArrState[key] === true) orgsArrFinal.push(key);
    //     });
    // };

    return (
        <div>
            <div className={classes.root}>
                <Paper>
                    <Grid container spacing={0}>
                        <Grid item xs={3}>
                            <Tabs
                                value={value}
                                onChange={handleTabChange}
                                aria-label="Page tabs"
                            >
                                <Tab
                                    label={intl.formatMessage(messages.users)}
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    label={intl.formatMessage(
                                        messages.organizations
                                    )}
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Grid>
                    </Grid>
                </Paper>
                <Grid container>
                    {/* <Grid item xs={3}>
                        <FieldFilterSelector initialValues={users} />
                    </Grid> */}
                    <Grid item xs={3}>
                        <TabPanel value={value} index={0}>
                            <FieldFilterSelector
                                initialValues={usersSearchValue}
                                handleSearchResult={handleSearchResult}
                                fieldType="users"
                            />
                            <div>{renderCheckboxFields('users', users)}</div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <FieldFilterSelector
                                initialValues={orgSearchValue}
                                handleSearchResult={handleSearchResult}
                                fieldType="organizations"
                            />
                            <div>
                                {renderCheckboxFields(
                                    'organizations',
                                    organizations
                                )}
                            </div>
                        </TabPanel>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default injectIntl(SearchSelector);

/* eslint-enable */
