import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { authCheck } from 'utils/pages';
import { hot } from 'react-hot-loader/root';
import { log } from 'utils/logger';
import reloadable from 'utils/reloadable';
import messages from 'constants/Messages';
import moment from 'moment';
import App from 'components/App';

// Typography
import HeaderText from 'components/HeaderText';
import Typography from '@material-ui/core/Typography';

import Header from 'components/Header';
import Button from 'components/Button';
import ButtonLinear from 'components/ButtonLinear';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Searchbar from 'components/Searchbar';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import SidebarRight from 'components/SidebarRight';
import SearchbarCategories from 'components/SearchbarCategories';
import FieldCompanySelector from 'components/FieldCompanySelector';
import FieldStatusSelector from 'components/FieldStatusSelector';
import FieldStatusList from 'components/FieldStatusList';
import FieldAvatarUpload from 'components/FieldAvatarUpload';

import FieldDatePicker from 'components/FieldDatePicker';
import DateRangeSelector from 'components/DateRangeSelector';
import DialogUploadStatus from 'components/DialogUploadStatus';
import CollapsableLine from 'components/CollapsableLine';
import { Field, reduxForm } from 'redux-form';
import TreeLibrary from 'components/TreeLibrary';
import Comments from 'components/LayoutComments';
import DialogDocumentPicker from 'components/DialogDocumentPicker';
import ProgressBar from 'components/ProgressBar';
// import FieldFilterSelector from 'components/FieldFilterSelector';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    section: {
        margin: '1em 0em 1em 0',
        padding: '1em 0 4em 0',
        borderBottom: '1px solid #00c771'
    },
    h1: {
        color: '#b7b9bf',
        fontFamily: 'Roboto',
        fontSize: '18px',
        textTransform: 'uppercase',
        marginBottom: '2em'
    },
    h2: {
        color: '#cbcbcb',
        fontFamily: 'Roboto',
        fontSize: '15px',
        textTransform: 'uppercase',
        marginBottom: '1em'
    }
};

// const users = [
//     {
//         displayName: 'Tester Mctesterson',
//         avatar: 'placeholder.img',
//         shortName: 'tester'
//     },
//     {
//         displayName: 'Tester2 Tester',
//         avatar: 'placeholder.img',
//         shortName: 'tester2'
//     },
//     {
//         displayName: 'Testes Test',
//         avatar: 'placeholder.img',
//         shortName: 'testes'
//     },
//     {
//         displayName: 'Testhair Tests',
//         avatar: 'placeholder.img',
//         shortName: 'testhair'
//     },
//     {
//         displayName: 'Testhair2 Tests',
//         avatar: 'placeholder.img',
//         shortName: 'testhair2'
//     }
// ];
// const organizations = [
//     {
//         displayName: 'Pepsi',
//         avatar: 'placeholder.img',
//         shortName: 'pepsi'
//     },
//     {
//         displayName: 'Coke',
//         avatar: 'placeholder.img',
//         shortName: 'coke'
//     },
//     {
//         displayName: 'Proctor & Gamble',
//         avatar: 'placeholder.img',
//         shortName: 'proctor&Gamble'
//     },
//     {
//         displayName: 'Test Org',
//         avatar: 'placeholder.img',
//         shortName: 'testOrg'
//     }
// ];

type DefaultProps = {
    classes: Object
};

type Props = {
    intl: intlShape,
    change: Function
} & DefaultProps;

const validate = () => ({});

type State = {
    nodeRef: string
};

/**
 *  @package Dashboard (dashboard)
 *  @container DashboardPage
 *  @desc Dashboard Page Wrapper
 *  @author: mike.priest
 */
@authCheck
@reduxForm({ form: 'styles', enableReinitialize: true, validate })
class DashboardPage extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.dialog = DialogDocumentPicker;

        this.state = {
            nodeRef: ''
        };
    }

    handleDateRange = dates => {
        log('START AND END DATE', 'purple', { dates });
    };

    handleChange = event => {
        this.setState({
            ...this.state,
            nodeRef: event.target.value
        });
    };

    render() {
        const { intl, change, classes } = this.props;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.dashboardDocTitle)}
                    </title>
                </Helmet>

                <div className="page-wrapper">
                    <Header page="styles" />

                    <div
                        className="page-with-sidebar"
                        style={{ display: 'block' }}
                    >
                        <div className="main">
                            <div className={classes.section}>
                                <h1 className={classes.h1}>Set NodeRef</h1>
                                <form noValidate autoComplete="off">
                                    <TextField
                                        autoComplete="off"
                                        id="nodeRef"
                                        label="NodeRef"
                                        onChange={e => this.handleChange(e)}
                                        variant="outlined"
                                    />
                                </form>
                            </div>

                            <div className={classes.section}>
                                <h1 className={classes.h1}>Typography</h1>

                                <Typography variant="h1">Header 1</Typography>

                                <Typography variant="h2">Header 2</Typography>

                                <Typography variant="h3">Header 3</Typography>

                                <Typography variant="h4">Header 4</Typography>

                                <Typography variant="h5">Header 5</Typography>

                                <Typography variant="body1" paragraph>
                                    Text paragraph ipsum dolor sit amet,
                                    consectetur adipisicing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna
                                    aliqua. Ut enim ad minim veniam, quis
                                    nostrud exercitation ullamco laboris nisi ut
                                    aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate
                                    velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat
                                    non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum. Sed ut
                                    perspiciatis unde omnis iste natus error sit
                                    voluptatem accusantium doloremque
                                    laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi
                                    architecto beatae vitae dicta sunt
                                    explicabo. Nemo enim ipsam voluptatem quia
                                    voluptas sit aspernatur aut odit aut fugit,
                                    sed quia consequuntur magni dolores eos qui
                                    ratione voluptatem sequi nesciunt. Neque
                                    porro quisquam est, qui dolorem ipsum quia
                                    dolor sit amet, consectetur, adipisci velit,
                                    sed quia non numquam eius modi tempora
                                    incidunt ut labore et dolore magnam aliquam
                                    quaerat voluptatem.
                                </Typography>

                                <Typography variant="body2" paragraph>
                                    By signing up, you agree to the greenfence
                                    Terms of Use
                                </Typography>

                                <Typography variant="subtitle1">
                                    Free label
                                </Typography>
                            </div>

                            <div className={classes.section}>
                                <h1 className={classes.h1}>Headers</h1>

                                <HeaderText title="No buttons or language prop" />

                                <HeaderText
                                    title="requests"
                                    buttonsRight={[
                                        <Button
                                            text="pay"
                                            size="small"
                                            color="grey0"
                                            round
                                        />,
                                        <Button
                                            text="pay"
                                            size="small"
                                            color="grey0"
                                            round
                                        />
                                    ]}
                                />
                            </div>

                            <div className={classes.section}>
                                <h1 className={classes.h1}>Buttons</h1>
                                <h2 className={classes.h2}>Default</h2>
                                <Button text="enabled" />
                                <Button text="submit" disabled />
                                <Button text="back" color="grey" />

                                <h2 className={classes.h2}>Medium</h2>
                                <Button text="enabled" size="medium" />
                                <Button text="submit" size="medium" disabled />
                                <Button
                                    text="back"
                                    color="grey"
                                    size="medium"
                                />

                                <Button
                                    text="addIngredient"
                                    color="outline"
                                    size="medium"
                                    round
                                    icon={<clr-icon shape="plus" size={15} />}
                                    iconPosition="left"
                                />

                                <h2 className={classes.h2}>Small - Round</h2>
                                <Button text="resume" size="small" round />
                                <Button
                                    text="pay"
                                    size="small"
                                    color="grey0"
                                    round
                                />
                                <Button
                                    text="issueAndSend"
                                    color="grey0"
                                    size="small"
                                    round
                                    icon={
                                        <ChevronRightIcon
                                            style={{
                                                lineHeight: '1em',
                                                fontSize: '2em',
                                                marginLeft: '0',
                                                marginRight: '-.4em'
                                            }}
                                        />
                                    }
                                    iconPosition="right"
                                />

                                <h2 className={classes.h2}>Micro - Round</h2>
                                <Button text="resume" size="micro" round />
                                <Button
                                    text="pay"
                                    size="micro"
                                    color="grey0"
                                    round
                                />
                            </div>

                            <div className={classes.section}>
                                <h1 className={classes.h1}>Wizard</h1>
                                <ButtonLinear
                                    onBack={() => {
                                        alert('Back was clicked');
                                    }}
                                    onNext={() => {
                                        alert('Next was clicked');
                                    }}
                                />
                            </div>

                            <div className={classes.section}>
                                <h1 className={classes.h1}>Search</h1>
                                <Searchbar
                                    placeholder="whatNext"
                                    onSearch={search => {
                                        log('SEARCH', 'blue', search);
                                    }}
                                />
                                <br />
                                <Searchbar
                                    placeholder="whatNext"
                                    round
                                    onSearch={search => {
                                        log('SEARCH', 'blue', search);
                                    }}
                                />

                                <br />
                                <SearchbarCategories
                                    onSearch={search => {
                                        log(
                                            'SEARCH WITH CATEGORY',
                                            'blue',
                                            search
                                        );
                                    }}
                                    categories={[
                                        { id: 'library', value: 'library' }
                                    ]}
                                    placeholder="whatNext"
                                    round
                                />

                                <br />
                                <SearchbarCategories
                                    categories={[
                                        { id: 'library', value: 'library' },
                                        { id: 'documents', value: 'documents' }
                                    ]}
                                    category={{
                                        id: 'library',
                                        value: 'library'
                                    }}
                                    onSearch={search => {
                                        log(
                                            'SEARCH WITH CATEGORY',
                                            'blue',
                                            search
                                        );
                                    }}
                                    placeholder="whatNext"
                                    size="large"
                                    round
                                />
                            </div>

                            <div className={classes.section} />
                            <h1 className={classes.h1}>Forms</h1>

                            <h2 className={classes.h2}>Checkbox</h2>
                            <Checkbox value="primary" color="primary" />

                            <Checkbox
                                defaultChecked
                                value="primary"
                                color="primary"
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        value="with label"
                                    />
                                }
                                label="This is a checkbox"
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Organization search</h1>
                        <div>
                            <Field
                                name="companies"
                                component={FieldCompanySelector}
                                defaultCompanies={['test']}
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Avatar</h1>
                        <div>
                            <Field
                                name="avatar"
                                component={FieldAvatarUpload}
                                change={change}
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Status List</h1>
                        <div>
                            <Field
                                name="status"
                                component={FieldStatusList}
                                change={change}
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Status Selector</h1>
                        <div>
                            <Field
                                name="status"
                                component={FieldStatusSelector}
                                label="Status"
                                change={change}
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Date Picker</h1>
                        <div>
                            <Field
                                disablePast
                                name="dueDate"
                                value={moment()
                                    .add(30, 'days')
                                    .toDate()}
                                component={FieldDatePicker}
                                fullSize
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Date Range Selector</h1>
                        <div
                            style={{
                                width: '328px',
                                marginTop: '-2em'
                            }}
                        >
                            <Field
                                name="dateRange"
                                component={DateRangeSelector}
                                label="Date Range"
                                open
                                value={[]}
                                change={change}
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Documents</h1>
                        <div
                            style={{
                                width: '328px',
                                maxHeight: '500px',
                                overflow: 'auto',
                                minHeight: '300px'
                            }}
                        >
                            <TreeLibrary parentRef="root" />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Comments</h1>
                        <div style={{ width: '328px' }}>
                            <Comments nodeRef={this.state.nodeRef} />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Progress Bar</h1>
                        <div>
                            <ProgressBar
                                file={{
                                    name: 'Testfile.pdf',
                                    progress: 75
                                }}
                                testing="true"
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>File Picker</h1>
                        <div style={{ width: '328px' }}>
                            <Button
                                text="open"
                                size="medium"
                                onClick={() => this.dialog.open()}
                            />
                            <DialogDocumentPicker
                                passRef={ref => {
                                    this.dialog = ref;
                                }}
                                onClose={results => {
                                    log('DialogDocumentPicker', 'red', {
                                        results
                                    });
                                    this.dialog.close();
                                }}
                            />
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Field Filter Selector</h1>
                        <div style={{ width: '500px' }}>
                            {/* <FieldFilterSelector
                                users={users}
                                organizations={organizations}
                            /> */}
                        </div>
                    </div>

                    <div className={classes.section}>
                        <h1 className={classes.h1}>Collapsable Line</h1>
                        <div style={{ width: '500px' }}>
                            <CollapsableLine title="Example title" isOpen>
                                I am some content inside of collapse
                            </CollapsableLine>
                        </div>
                    </div>
                    <DialogUploadStatus
                        title="Upload Dialog"
                        files={[]}
                        open="true"
                    />
                    <SidebarRight />
                </div>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(withStyles(styles)(DashboardPage))));
