// @flow
import { defineMessages } from 'react-intl';
import { formValueSelector } from 'redux-form';

const messages = defineMessages({
    dashboard: {
        id: 'menu.dashboard',
        defaultMessage: 'Dashboard'
    },
    documents: {
        id: 'menu.documents',
        defaultMessage: 'Documents'
    },
    people: {
        id: 'menu.people',
        defaultMessage: 'People'
    },
    tasks: {
        id: 'menu.tasks',
        defaultMessage: 'Tasks'
    },
    labelDate: {
        id: 'messages.label.date',
        defaultMessage: 'Date:'
    },
    requests: {
        id: 'menu.requests',
        defaultMessage: 'Requests'
    },
    received: {
        id: 'menu.received',
        defaultMessage: 'Received'
    },
    enabled: {
        id: 'text.enabled',
        defaultMessage: 'Enabled'
    },
    issued: {
        id: 'menu.issued',
        defaultMessage: 'Issued'
    },
    assign: {
        id: 'menu.assign',
        defaultMessage: 'Assign New'
    },
    reports: {
        id: 'menu.reports',
        defaultMessage: 'Reports'
    },
    createNew: {
        id: 'button.create_new',
        defaultMessage: 'Create new'
    },
    createNewRequest: {
        id: 'button.createNewRequest',
        defaultMessage: 'Create a new request'
    },
    library: {
        id: 'menu.library',
        defaultMessage: 'Library'
    },
    everything: {
        id: 'menu.everything',
        defaultMessage: 'Everything'
    },
    drafts: {
        id: 'menu.drafts',
        defaultMessage: 'Drafts'
    },
    details: {
        id: 'menu.details',
        defaultMessage: 'Details'
    },
    globalFooterTitle: {
        id: 'global.footer_title',
        defaultMessage: 'GFR {version}'
    },
    globalFooterCompany: {
        id: 'global.footer_company',
        defaultMessage: 'Greenfence Trust Management Platform'
    },
    dashboardDocTitle: {
        id: 'document.dashboard.doc_title',
        defaultMessage: 'Home - Greenfence'
    },
    documentsDocTitle: {
        id: 'document.documents.doc_title',
        defaultMessage: 'Documents - Greenfence'
    },
    invigilators: {
        id: 'messages.invigilators',
        defaultMessage: 'Invigilators'
    },
    candidates: {
        id: 'messages.candidates',
        defaultMessage: 'Candidates'
    },
    candidateExams: {
        id: 'messages.candidateExams',
        defaultMessage: 'exams'
    },
    candidateOrganizations: {
        id: 'messages.candidateOrganizations',
        defaultMessage: 'organizations'
    },
    candidateInfractions: {
        id: 'messages.candidateInfractions',
        defaultMessage: 'infractions'
    },
    candidateActiveFor: {
        id: 'messages.candidateActiveFor',
        defaultMessage: 'Member since:'
    },
    labelRequestType: {
        id: 'label.request.select',
        defaultMessage: 'Please choose one of the following request types:'
    },
    attachedDocuments: {
        id: 'label.attached.docs',
        defaultMessage: 'Attached documents'
    },
    location: {
        id: 'messages.location',
        defaultMessage: 'Location'
    },
    locations: {
        id: 'messages.locations',
        defaultMessage: 'Locations'
    },
    overview: {
        id: 'messages.overview',
        defaultMessage: 'Overview'
    },
    assessments: {
        id: 'messages.assessments',
        defaultMessage: 'Assessments'
    },
    items: {
        id: 'messages.items',
        defaultMessage: 'Items'
    },
    action: {
        id: 'messages.action',
        defaultMessage: 'Action'
    },
    to: {
        id: 'messages.to',
        defaultMessage: 'To'
    },
    filters: {
        id: 'messages.filters',
        defaultMessage: 'Filters'
    },
    filterAll: {
        id: 'messages.filters.all',
        defaultMessage: 'All Time'
    },
    filterMonth: {
        id: 'messages.filters.month',
        defaultMessage: 'This Month'
    },
    filterYear: {
        id: 'messages.filters.year',
        defaultMessage: 'This Year'
    },
    filterRange: {
        id: 'messages.filters.range',
        defaultMessage: 'Range'
    },
    labelNewReport: {
        id: 'messages.label.need_new_report',
        defaultMessage: 'Need a new report?'
    },
    documentDetailsPage: {
        id: 'page.title.document_details',
        defaultMessage: 'Document details - Greenfence'
    },
    taskDetailsPage: {
        id: 'page.title.task_details',
        defaultMessage: 'Task details - Greenfence'
    },
    workflowDetailsPage: {
        id: 'page.title.workflow_details',
        defaultMessage: 'Workflow document details - Greenfence'
    },
    createReport: {
        id: 'messages.label.createAReport',
        defaultMessage: 'Create a report'
    },
    byMe: {
        id: 'messages.by_me',
        defaultMessage: 'By me'
    },
    byOthers: {
        id: 'messages.by_others',
        defaultMessage: 'By others'
    },
    active: {
        id: 'messages.active',
        defaultMessage: 'Active'
    },
    inactive: {
        id: 'messages.inactive',
        defaultMessage: 'Inactive'
    },
    completed: {
        id: 'messages.completed',
        defaultMessage: 'Completed'
    },

    redLabel: {
        id: 'messages.red_label',
        defaultMessage: 'Problem areas'
    },

    yellowLabel: {
        id: 'messages.yellow_label',
        defaultMessage: 'Warning signs'
    },
    greenLabel: {
        id: 'messages.green_label',
        defaultMessage: 'No issues'
    },
    sectionByName: {
        id: 'messages.section.title_name',
        defaultMessage: 'Search by name'
    },
    sectionByDate: {
        id: 'messages.section.title_date',
        defaultMessage: 'Search by date'
    },
    sectionByCreated: {
        id: 'messages.section.title_created',
        defaultMessage: 'Created'
    },
    sectionByLevel: {
        id: 'messages.section.title_level',
        defaultMessage: 'Suspicion Level'
    },
    sectionByStatus: {
        id: 'messages.section.title_status',
        defaultMessage: 'Status'
    },
    viewReviews: {
        id: 'messages.button.view_reviews',
        defaultMessage: 'View All Reviews'
    },
    positive: {
        id: 'messages.positive',
        defaultMessage: 'Positive'
    },
    negative: {
        id: 'messages.negative',
        defaultMessage: 'Negative'
    },
    reviews: {
        id: 'messages.reviews',
        defaultMessage: 'Reviews'
    },
    save: {
        id: 'messages.save',
        defaultMessage: 'Save changes'
    },
    add: {
        id: 'messages.add',
        defaultMessage: 'ADD'
    },
    or: {
        id: 'messages.or',
        defaultMessage: ' or '
    },
    cancel: {
        id: 'messages.cancel',
        defaultMessage: 'Cancel'
    },
    cancelAll: {
        id: 'messages.cancelAll',
        defaultMessage: 'Cancel All'
    },
    cancelled: {
        id: 'messages.cancelled',
        defaultMessage: 'Cancelled'
    },
    close: {
        id: 'message.close',
        defaultMessage: 'Close'
    },
    show: {
        id: 'message.show',
        defaultMessage: 'Show'
    },
    hide: {
        id: 'message.hide',
        defaultMessage: 'Hide'
    },
    unauthorized: {
        id: 'messages.unauthorized',
        defaultMessage: 'Unauthorized'
    },
    clear: {
        id: 'messages.clear',
        defaultMessage: 'Clear'
    },
    groupsLabel: {
        id: 'messages.groups_label',
        defaultMessage: 'Security Groups'
    },
    personalLabel: {
        id: 'messages.personal_label',
        defaultMessage: 'Details'
    },
    updateAvatar: {
        id: 'messages.update_avatar',
        defaultMessage: 'Change profile image'
    },

    socialLabel: {
        id: 'messages.social_label',
        defaultMessage: 'Add links to further enhance your profile'
    },
    organizationLabel: {
        id: 'messages.location_org',
        defaultMessage: 'Organization'
    },
    locationLabel: {
        id: 'messages.location_label',
        defaultMessage: 'About my location'
    },
    credentialsLabel: {
        id: 'messages.credentials_label',
        defaultMessage: 'Password'
    },
    socialMediaLabel: {
        id: 'messages.social_medial_label',
        defaultMessage: 'SOCIAL MEDIA'
    },
    usersEmailInvalid: {
        id: 'users.email_invalid',
        defaultMessage: 'Email is invalid'
    },
    usersFirstNameInvalid: {
        id: 'users.email_first_invalid',
        defaultMessage: 'First name is invalid'
    },
    usersLastNameInvalid: {
        id: 'users.email_last_invalid',
        defaultMessage: 'Last name is invalid'
    },
    usersUserNameInvalid: {
        id: 'users.user_name_invalid',
        defaultMessage: 'User Name is invalid'
    },
    usersUserNameValidationText: {
        id: 'users.user_name_validation_text',
        defaultMessage: 'User Name must have at least 2 characters'
    },
    filterByAssessment: {
        id: 'messages.filter.assessment',
        defaultMessage: 'Filter by exam'
    },
    filterByLocation: {
        id: 'messages.filter.location',
        defaultMessage: 'Filter by location'
    },
    filterByOrg: {
        id: 'messages.filter.org',
        defaultMessage: 'Filter by organization'
    },
    labelAssessment: {
        id: 'messages.label.assessment',
        defaultMessage: 'Exam:'
    },
    labelLocation: {
        id: 'messages.label.location',
        defaultMessage: 'Loc:'
    },
    labelOrg: {
        id: 'messages.label.org',
        defaultMessage: 'Org:'
    },
    search: {
        id: 'messages.search',
        defaultMessage: 'Search'
    },
    searchTerm: {
        id: 'messages.search.term',
        defaultMessage: 'Search term...'
    },
    placeholderSearch: {
        id: 'messages.placeholder.search',
        defaultMessage: 'Search...'
    },
    availableExams: {
        id: 'messages.available_exams',
        defaultMessage: 'Available exams'
    },
    selectedExams: {
        id: 'messages.selected_exams',
        defaultMessage: 'Exams selected'
    },
    availableLocations: {
        id: 'messages.available_locations',
        defaultMessage: 'Available locations'
    },
    selectedLocations: {
        id: 'messages.selected_locations',
        defaultMessage: 'Locations selected'
    },
    availableOrgs: {
        id: 'messages.available_orgs',
        defaultMessage: 'Available Organizations'
    },
    selectedOrgs: {
        id: 'messages.selected_orgs',
        defaultMessage: 'Organizations selected'
    },
    required: {
        id: 'errors.required',
        defaultMessage: 'Required'
    },
    editDetails: {
        id: 'menu.edit_details',
        defaultMessage: 'Edit details'
    },
    editChart: {
        id: 'menu.edit_chart',
        defaultMessage: 'Edit chart'
    },
    deleteUser: {
        id: 'menu.delete_user',
        defaultMessage: 'Delete user'
    },
    signingUserName: {
        id: 'Signing.username',
        defaultMessage: 'Username'
    },
    signingPassword: {
        id: 'Signing.password',
        defaultMessage: 'Password'
    },
    signingKeepSigned: {
        id: 'Signing.keep_signed',
        defaultMessage: 'Keep me signed in?'
    },
    signingSessionExpiredMessage: {
        id: 'Signing.session_expired_message',
        defaultMessage: 'You are no longer signed in'
    },
    signingEnterCredentialsMessage: {
        id: 'Signing.enter_credentials_message',
        defaultMessage: 'Enter username and password'
    },
    signingEnterUsernameMessage: {
        id: 'Signing.enter_username_message',
        defaultMessage: 'Enter username'
    },
    signingEnterPasswordMessage: {
        id: 'Signing.enter_password_message',
        defaultMessage: 'Enter password'
    },
    signingClickHereLoginMessage: {
        id: 'Signing.click_here_login_message',
        defaultMessage: 'Click here to login'
    },
    signingPasswordWasResetMessage: {
        id: 'Signing.password_was_reset_message',
        defaultMessage: 'Your password was reset!'
    },
    signingConfirmUsernamePasswordMessage: {
        id: 'Signing.confirm_username_password_message',
        defaultMessage: 'Please confirm your username and enter a new password'
    },
    signingResetPasswordMessage: {
        id: 'Signing.reset_password_message',
        defaultMessage: 'Reset password'
    },
    signingResetRequestedMessage: {
        id: 'Signing.reset_requested_message',
        defaultMessage:
            'If an account with that username exists, you will receive an email with reset password instructions'
    },
    signingUsernamePasswordResetMessage: {
        id: 'Signing.username_password_reset_message',
        defaultMessage: 'Please enter your username and reset your password'
    },

    signingInvalidCredentialsMessage: {
        id: 'Signing.invalid_credentials_message',
        defaultMessage: 'Invalid username or password'
    },
    signinShow: {
        id: 'Signing.show',
        defaultMessage: 'Show'
    },
    signinHide: {
        id: 'Signing.hide',
        defaultMessage: 'Hide'
    },
    hideInfo: {
        id: 'messages.hideInfo',
        defaultMessage: 'OK, got it'
    },
    infractions: {
        id: 'messages.infractions',
        defaultMessage: 'infractions'
    },
    reliability: {
        id: 'messages.reliability',
        defaultMessage: 'reliability'
    },
    optionsRoleConsumer: {
        id: 'options.consumer',
        defaultMessage: 'Read'
    },
    optionsRoleCommentator: {
        id: 'options.commentator',
        defaultMessage: 'Read'
    },
    optionsRoleContributor: {
        id: 'options.contributor',
        defaultMessage: 'Contributor'
    },
    optionsRoleCollaborator: {
        id: 'options.collaborator',
        defaultMessage: 'Read/Write'
    },
    optionsRoleCoordinator: {
        id: 'options.coordinator',
        defaultMessage: 'Administrator'
    },
    rights: {
        id: 'Signing.rights',
        defaultMessage:
            '@{year} All Rights Reserved. Greenfence® is a registered  trademark.'
    },
    page: {
        id: 'messages.label.page',
        defaultMessage: 'Page'
    },
    continue: {
        id: 'messages.button.continue',
        defaultMessage: 'Continue'
    },
    back: {
        id: 'messages.button.back',
        defaultMessage: 'Back'
    },
    next: {
        id: 'messages.button.next',
        defaultMessage: 'Next'
    },
    submit: {
        id: 'messages.button.submit',
        defaultMessage: 'Submit'
    },
    resume: {
        id: 'messages.button.resume',
        defaultMessage: 'Resume'
    },
    addIngredient: {
        id: 'messages.button.add_ingredient',
        defaultMessage: 'Add Ingredient'
    },
    pay: {
        id: 'messages.button.pay',
        defaultMessage: 'Pay'
    },
    issueAndSend: {
        id: 'messages.button.issue_send',
        defaultMessage: 'Issue & Send'
    },
    updateProfile: {
        id: 'messages.user.update_profile',
        defaultMessage: 'Update Profile'
    },
    updateProfileDescription: {
        id: 'messages.user.update_profile_description',
        defaultMessage: 'Update user profile'
    },
    whatNext: {
        id: 'messages.whatNext',
        defaultMessage: 'What would you like to do next?'
    },
    name: {
        id: 'messages.form.name',
        defaultMessage: 'Name'
    },
    firstName: {
        id: 'messages.form.firstName',
        defaultMessage: 'First Name'
    },
    lastName: {
        id: 'messages.form.lastName',
        defaultMessage: 'Last Name'
    },
    category: {
        id: 'messages.category',
        defaultMessage: 'Category'
    },
    organization: {
        id: 'messages.form.organization',
        defaultMessage: 'Organization'
    },
    jobTitle: {
        id: 'messages.form.jobTitle',
        defaultMessage: 'Job Title'
    },
    email: {
        id: 'messages.form.email',
        defaultMessage: 'Email'
    },
    username: {
        id: 'messages.username',
        defaultMessage: 'Username'
    },
    actions: {
        id: 'messages.actions',
        defaultMessage: 'Actions'
    },
    facebook: {
        id: 'messages.form.facebook',
        defaultMessage: 'Facebook'
    },
    twitter: {
        id: 'messages.form.twitter',
        defaultMessage: 'Twitter'
    },
    linkedin: {
        id: 'messages.form.linkedin',
        defaultMessage: 'Linkedin'
    },
    userName: {
        id: 'messages.form.userName',
        defaultMessage: 'UserName'
    },
    oldPassword: {
        id: 'messages.form.oldPassword',
        defaultMessage: 'Old Password'
    },
    newPassword: {
        id: 'messages.form.newPassword',
        defaultMessage: 'New Password *'
    },
    verifyPassword: {
        id: 'messages.form.verifyPassword',
        defaultMessage: 'Verify Password *'
    },
    oldPasswordMissing: {
        id: 'messages.form.oldPasswordMissing',
        defaultMessage: 'Old password is missing'
    },
    description: {
        id: 'message.form.description',
        defaultMessage: 'Description'
    },
    address: {
        id: 'messages.form.address',
        defaultMessage: 'Address'
    },
    city: {
        id: 'messages.form.city',
        defaultMessage: 'City'
    },
    country: {
        id: 'messages.form.country',
        defaultMessage: 'Country'
    },
    postalcode: {
        id: 'messages.form.postalcode',
        defaultMessage: 'Postal Code'
    },
    phone: {
        id: 'messages.form.phone',
        defaultMessage: 'Phone'
    },
    state: {
        id: 'messages.form.state',
        defaultMessage: 'State'
    },
    lineOne: {
        id: 'messages.form.line_one',
        defaultMessage: 'Line 1'
    },
    lineTwo: {
        id: 'messages.form.line_two',
        defaultMessage: 'Line 2'
    },
    townCity: {
        id: 'messages.form.town_city',
        defaultMessage: 'Town/City'
    },
    timezone: {
        id: 'messages.form.timezone',
        defaultMessage: 'Timezone'
    },
    localTime: {
        id: 'messages.form.localTime',
        defaultMessage: 'Local time'
    },
    countrycode: {
        id: 'messages.form.countrycode',
        defaultMessage: 'Country code'
    },
    mobile: {
        id: 'messages.form.mobile',
        defaultMessage: 'Mobile Phone Number'
    },
    mobileShort: {
        id: 'messages.form.mobileShort',
        defaultMessage: 'Mobile'
    },
    aboutMe: {
        id: 'messages.form.about_me',
        defaultMessage: 'More about me'
    },
    aboutMePlaceholder: {
        id: 'messages.form.about_me_placeholder',
        defaultMessage:
            'Add your education, skills, experience, so others can learn more about you'
    },

    website: {
        id: 'messages.form.website',
        defaultMessage: 'Website'
    },
    color: {
        id: 'messages.form.color',
        defaultMessage: 'Color'
    },
    avatar: {
        id: 'messages.form.avatar',
        defaultMessage: 'Avatar'
    },
    errorReportExists: {
        id: 'message.validate.report_exists',
        defaultMessage: 'That report name already exists'
    },
    finish: {
        id: 'messages.button.finish',
        defaultMessage: 'Finish'
    },
    skip: {
        id: 'messages.button.skip',
        defaultMessage: 'Skip'
    },
    domainsToQuery: {
        id: 'messages.form.domains_to_query',
        defaultMessage: 'Select domains to query'
    },
    domainsToQueryDescription: {
        id: 'messages.form.domains_to_query_description',
        defaultMessage:
            'Your new report will query for possible fraudulent data. Use the form below to specify what data streams you want to report by. If a domain is not selected, the report will use all possible data in that category'
    },
    dateRange: {
        id: 'messages.form.date_range',
        defaultMessage: 'Date range'
    },
    domainDateRangeDescription: {
        id: 'messages.form.domain_date_range_description',
        defaultMessage:
            'Your report will only focus on candidate submissions between these dates:'
    },
    domainFocusDescription: {
        id: 'messages.form.domain_focus_description',
        defaultMessage:
            'Your report will only focus on the {value} listed below:'
    },
    organizations: {
        id: 'messages.form.organizations',
        defaultMessage: 'Organizations'
    },
    domainOrganizationDescription: {
        id: 'messages.form.domain_organization_description',
        defaultMessage:
            'Your report will only focus on the organizations listed below:'
    },
    usersAndGroups: {
        id: 'messages.form.users_and_groups',
        defaultMessage: 'Users and groups'
    },
    whoNotify: {
        id: 'messages.form.who_notify',
        defaultMessage: 'Who should be notified?'
    },
    howOften: {
        id: 'messages.form.how_often',
        defaultMessage: 'How often?'
    },
    howOftenDescription: {
        id: 'messages.form.how_often_description',
        defaultMessage: 'Change how often you want to recieve emails:'
    },
    fraudSensitivity: {
        id: 'messages.form.fraud_sensitivity',
        defaultMessage: 'Fraud sensitivity'
    },
    fraudSensitivityDescription: {
        id: 'messages.form.fraud_sensitivity_description',
        defaultMessage: 'Change fraud detection levels:'
    },
    sensitivity: {
        id: 'messages.form.sensitivity',
        defaultMessage: 'Sensitivity'
    },
    selectedUsersAndGroups: {
        id: 'messages.form.selected_users_groups',
        defaultMessage: 'Selected users/groups'
    },
    period: {
        id: 'messages.form.period',
        defaultMessage: 'Period'
    },
    threshold: {
        id: 'messages.form.threshold',
        defaultMessage: 'Threshold'
    },
    selectionDaily: {
        id: 'messages.selection.daily',
        defaultMessage: 'Daily'
    },
    selectionWeekly: {
        id: 'messages.selection.weekly',
        defaultMessage: 'Weekly'
    },
    selectionMonthly: {
        id: 'messages.selection.mothly',
        defaultMessage: 'Monthly'
    },
    selectionWarning: {
        id: 'messages.selection.warning',
        defaultMessage: 'Warning signs'
    },
    selectionOccured: {
        id: 'messages.selection.danger',
        defaultMessage: 'Occured signs'
    },
    integrations: {
        id: 'messages.form.integrations',
        defaultMessage: 'Integrations'
    },
    integrationsDescription: {
        id: 'messages.form.integrations_description',
        defaultMessage:
            'Improve fraud detection by connecting your other assessment tools. Get notified immediately when issues are found'
    },
    notifications: {
        id: 'messages.form.notifications',
        defaultMessage: 'Notifications'
    },
    optional: {
        id: 'messages.form.label.optional',
        defaultMessage: 'Optional'
    },
    lifecycle: {
        id: 'messages.form.lifecycle',
        defaultMessage: 'Lifecycle'
    },
    enableIntegrations: {
        id: 'message.form.enable_integrations',
        defaultMessage: 'Enable integrations'
    },
    enableEmailUpdates: {
        id: 'messages.form.enable_email_updates',
        defaultMessage: 'Enable email updates'
    },
    subscribeToNotifications: {
        id: 'messafges.form.subscribe_to_notifications',
        defaultMessage: 'Subscribe to notifications'
    },
    subscribeToNotificationsDescription: {
        id: 'messages.form.subscribe_to_notifications_description',
        defaultMessage: 'Would you like to get updates when issues happen'
    },
    reportLifecycle: {
        id: 'messages.form.report_lifecycle',
        defaultMessage: 'Report lifecycle'
    },
    reportLifecycleDescription: {
        id: 'messages.form.report_lifecycle_description',
        defaultMessage:
            "A report should be created for a specific use-case and/or business purpose. Once a report has ved it's purpose it should be archived and then eventually destroyed. Use the form below to setup the lifecycle:"
    },
    enableLifecycle: {
        id: 'messages.form.enable_lifecycle',
        defaultMessage: 'Enable lifecycle'
    },
    reportExpiration: {
        id: 'messages.form.report_expiration',
        defaultMessage: 'Report expiration'
    },
    reportRetention: {
        id: 'messages.form.report_retention',
        defaultMessage: 'Report retention'
    },
    reportRetentionDescription: {
        id: 'messages.form.report_retention_description',
        defaultMessage: 'How long should this report be kept for once expired?'
    },
    expDate: {
        id: 'message.form.exp_date',
        defaultMessage: 'Exp. Date'
    },
    expTime: {
        id: 'messages.form.exp_time',
        defaultMessage: 'Exp. Time'
    },
    selection1Year: {
        id: 'messages.selection.1_year',
        defaultMessage: '1 Year'
    },
    selection1Month: {
        id: 'messages.selection.1_month',
        defaultMessage: '1 Month'
    },
    selection3Month: {
        id: 'messages.selection.3_month',
        defaultMessage: '3 Months'
    },
    selection1Week: {
        id: 'messages.selection.1_week',
        defaultMessage: '1 Week'
    },
    selectionWarnings: {
        id: 'messages.selection.warnings',
        defaultMessage: 'Warning signs'
    },
    selectionInfractions: {
        id: 'messages.selection.infractions',
        defaultMessage: 'Infraction signs'
    },
    domainAssementDescription: {
        id: 'messages.form.domain_assessment_description',
        defaultMessage:
            'Your report will only focus on the assessments listed below:'
    },
    domainLocationtDescription: {
        id: 'messages.form.domain_locationt_description',
        defaultMessage:
            'Your report will only focus on the locations listed below:'
    },
    fromDate: {
        id: 'messages.field.from_date',
        defaultMessage: 'From date'
    },
    toDate: {
        id: 'messages.field.to_Date',
        defaultMessage: 'To date'
    },
    availableOrganizations: {
        id: 'messages.available_organizations',
        defaultMessage: 'Available organizations'
    },
    changeDate: {
        id: 'messages.picker.change_date',
        defaultMessage: 'Change date'
    },
    changeTime: {
        id: 'messages.picker.change_time',
        defaultMessage: 'Change time'
    },
    loading: {
        id: 'messages.body.loading',
        defaultMessage: 'loading...'
    },
    cantBeEmpty: {
        id: 'messages.error.cant_be_empty',
        defaultMessage: "Can't be empty"
    },
    endBeforeStart: {
        id: 'messages.error.end_before_start',
        defaultMessage: 'End date is before start date'
    },
    dateBeforeToday: {
        id: 'messages.form.date_before_today',
        defaultMessage: 'Date is before today'
    },
    nameLengthInvalid: {
        id: 'messages.validation.name_length_invalid',
        defaultMessage: "Name can't be shorter than 3 characters"
    },
    nameLengthMaximumExceeded: {
        id: 'messages.validation.name_length_maxiumu_exceeded',
        defaultMessage: "Name can't be greater than 50 characters"
    },
    chartType: {
        id: 'messages.chart_type',
        defaultMessage: 'Chart type'
    },
    reportDashboard: {
        id: 'action.report_dashboard',
        defaultMessage: 'Report dashboard'
    },
    reportSummary: {
        id: 'action.report_summary',
        defaultMessage: 'Summary (PDF)'
    },
    messageReportUpdatePending: {
        id: 'message.report_update_pending',
        defaultMessage: 'Updating report...'
    },
    messageReportUpdateSuccess: {
        id: 'message.report_update_success',
        defaultMessage: 'Report has been updated'
    },
    messageReportUpdateError: {
        id: 'message.report_update_error',
        defaultMessage: 'There was a problem updating the report'
    },
    messageReportCreatePending: {
        id: 'message.report_create_pending',
        defaultMessage: 'Creating report...'
    },
    messageReportCreateSuccess: {
        id: 'message.report_create_success',
        defaultMessage: 'Success. Report created!'
    },
    messageReportCreateError: {
        id: 'message.report_create_error',
        defaultMessage: 'There was a problem creating the report'
    },
    accessDenied: {
        id: 'users.access_denied',
        defaultMessage:
            'You do not have the appropriate permissions to perform this action.'
    },
    basicDetails: {
        id: 'label.basic_details',
        defaultMessage: 'Basic Details'
    },
    serverError: {
        id: 'users.server_error',
        defaultMessage: 'Server error'
    },
    usersEmailRequired: {
        id: 'users.missing_email_error',
        defaultMessage: 'Email is required'
    },
    usersFirstNameRequired: {
        id: 'users.missing_first_name_error',
        defaultMessage: 'First name is required'
    },
    usersLastNameRequired: {
        id: 'users.missing_last_name_error',
        defaultMessage: 'Last name is required'
    },
    usersPasswordRequired: {
        id: 'users.missing_password_error',
        defaultMessage: 'Password is required'
    },
    usersUserNameRequired: {
        id: 'users.missing_user_name_error',
        defaultMessage: 'Username is required'
    },
    usersPasswordStrength: {
        id: 'users.password_strength',
        defaultMessage:
            'Password is too weak. Try adding numbers, capital letters, and special characters to make it stronger'
    },
    usersPasswordValidationText: {
        id: 'users.password_validation_text',
        defaultMessage: 'Password must have at least 3 characters'
    },
    usersPasswordVerificationText: {
        id: 'users.password_verification_text',
        defaultMessage: "Password fields don't match"
    },
    usersNewPasswordValidationText: {
        id: 'users.new_password_validation_text',
        defaultMessage: 'New password cannot be the same as the old one'
    },
    usersOldPasswordRequired: {
        id: 'users.old_password_required',
        defaultMessage: 'Old password required to change password'
    },
    userAlreadyExists: {
        id: 'users.already_exists',
        defaultMessage: 'User with the same username already exists.'
    },
    usersEnabledLabel: {
        id: 'users.enabled_label',
        defaultMessage: 'Account enabled?'
    },
    usersExternalLabel: {
        id: 'users.external_label',
        defaultMessage: 'External User?'
    },
    saveChanges: {
        id: 'common.save_changes',
        defaultMessage: 'Save anges'
    },
    userProfile: {
        id: 'common.user_profile',
        defaultMessage: 'User profile'
    },
    cancelAndRevert: {
        id: 'common.cancel_and_revert',
        defaultMessage: 'cancel and revert'
    },
    edit: {
        id: 'common.edit',
        defaultMessage: 'Edit'
    },
    info: {
        id: 'common.info',
        defaultMessage: 'Properties'
    },
    updated: {
        id: 'common.updated',
        defaultMessage: 'updated'
    },
    editAvatarTitle: {
        id: 'users.edit_avatar_title',
        defaultMessage: 'Edit Avatar'
    },
    propertiesName: {
        id: 'actions.groups.propertiesName',
        defaultMessage: 'Properties: {name}'
    },
    propertiesCreated: {
        id: 'actions.groups.propertiesCreated',
        defaultMessage: 'Created: {created}'
    },
    propertiesUpdated: {
        id: 'actions.groups.propertiesUpdated',
        defaultMessage: 'Updated: {updated}'
    },
    propertiesDescription: {
        id: 'actions.groups.propertiesDescription',
        defaultMessage: 'Description: {description}'
    },
    propertiesFileSize: {
        id: 'actions.groups.propertiesFileSize',
        defaultMessage: 'Filesize: {fileSize}'
    },
    editAvatarMessage: {
        id: 'users.edit_avatar_message',
        defaultMessage: 'Upload and edit avatar'
    },
    wrongOldPassword: {
        id: 'users.old_password_wrong',
        defaultMessage: 'Wrong old password'
    },
    saveSucceeded: {
        id: 'users.save_succeeded',
        defaultMessage: 'Save Succeeded'
    },
    tipGsDfDsTiDesc: {
        id: 'tip.tipGsDfDsTi_desc',
        defaultMessage:
            'Guttman score dependent on difficulty, distance and time'
    },

    /**
     * Item Datalist hints
     */
    hintTotalNoneRcTitle: {
        id: 'hint.datalist_items_total_rc_none_title',
        defaultMessage: 'Total None RC'
    },
    hintTotalNoneRcDesc: {
        id: 'hint.datalist_items_total_rc_none_desc',
        defaultMessage: 'Response count, no response given'
    },
    hintSampleRcTitle: {
        id: 'hint.sample_rc_title',
        defaultMessage: 'Sample RC'
    },
    hintSampleRcDesc: {
        id: 'hint.sample_rc_desc',
        defaultMessage: 'Response Count'
    },
    hintTotalCrcTitle: {
        id: 'hint._total_crc_title',
        defaultMessage: 'Total CRC'
    },
    hintTotalCrcDesc: {
        id: 'hint._total_crc_Desc',
        defaultMessage: 'Total Correct Response Count'
    },
    hintTotalRcTitle: {
        id: 'hint._total_r_title',
        defaultMessage: 'Total RC'
    },
    hintTotalRcDesc: {
        id: 'hint._total_rc_Desc',
        defaultMessage: 'Item response time given by a unique candidate'
    },
    hintPValueSdTitle: {
        id: 'hint.p_value_s_d_title',
        defaultMessage: 'P-Value SD'
    },
    hintPValueSdDesc: {
        id: 'hint.p_value_s_d_desc',
        defaultMessage: 'P-Value Standard Deviation'
    },
    hintRitTitle: {
        id: 'hint.rit_title',
        defaultMessage: 'RIT'
    },
    hintRitDesc: {
        id: 'hint.rit_desc',
        defaultMessage: 'Rasch Unit'
    },
    hintTotalArtTitle: {
        id: 'hint.total_art_title',
        defaultMessage: 'Total Art'
    },
    hintTotalArtDesc: {
        id: 'hint.total_art_desc',
        defaultMessage: 'Total Average Response Time'
    },
    hintSdDfTitle: {
        id: 'hint.sd_df_title',
        defaultMessage: 'SD df'
    },
    hintSdDfDesc: {
        id: 'hint.sd_df_desc',
        defaultMessage:
            'Standard Deviation for difficulty. 1 SD difference from average'
    },
    messageFolderCreateSuccess: {
        id: 'message.folder.action.create_success',
        defaultMessage: 'Success. Folder created!'
    },
    messageFolderUpdateSuccess: {
        id: 'message.folder.action.update_success',
        defaultMessage: 'Success. Folder updated!'
    },
    messageFolderCopySuccess: {
        id: 'message.folder.action.copy_success',
        defaultMessage: 'Success. Folder(s) Copied!'
    },
    messageFolderCopyError: {
        id: 'message.folder.action.copy_error',
        defaultMessage: 'Error: Failed to copy Folder(s)'
    },
    messageFolderMoveSuccess: {
        id: 'message.folder.action.move_success',
        defaultMessage: 'Success. Folder(s) Moved!'
    },
    messageFolderMoveError: {
        id: 'message.folder.action.move_error',
        defaultMessage: 'Error: Failed to move Folder(s)'
    },
    messageFolderDeleteSuccess: {
        id: 'message.folder.action.delete_success',
        defaultMessage: 'Success. item(s) deleted!'
    },
    messageFolderDeleteError: {
        id: 'message.folder.action.delete_error',
        defaultMessage: 'Error'
    },
    messageFileUpdateSuccess: {
        id: 'message.file.action.update_success',
        defaultMessage: 'Success. File updated!'
    },
    messageFileCopySuccess: {
        id: 'message.file.action.copy_success',
        defaultMessage: 'Success. File(s) Copied!'
    },
    messageFileCopyError: {
        id: 'message.file.action.copy_error',
        defaultMessage: 'Error: Failed to copy file(s)'
    },
    messageFileMoveSuccess: {
        id: 'message.file.action.move_success',
        defaultMessage: 'Success. File(s) Moved!'
    },
    messageFileMoveError: {
        id: 'message.file.action.move_error',
        defaultMessage: 'Error: Failed to move file(s)'
    },
    messageFileDeleteSuccess: {
        id: 'message.file.action.delete_success',
        defaultMessage: 'Success. File(s) deleted!'
    },
    messageFolderDeleteError: {
        id: 'message.file.action.delete_error',
        defaultMessage: 'Error'
    },
    messageWorkflowCancelSuccess: {
        id: 'message.file.action.cancel_workflow_success',
        defaultMessage: 'Success. Workflow canceled!'
    },
    messageWorkflowCancelError: {
        id: 'message.file.action.cancel_workflow_error',
        defaultMessage: 'Error. Could not find active workflow.'
    },
    messageWorkflowView: {
        id: 'message.file.action.workflow_view',
        defaultMessage: 'Workflow Progress'
    },
    messageWorkflowType: {
        id: 'message.file.action.workflow_type',
        defaultMessage: 'TYPE'
    },
    messageWorkflowAssignee: {
        id: 'message.file.action.workflow_assignee',
        defaultMessage: 'ASSIGNEE'
    },
    messageWorkflowCompleted: {
        id: 'message.file.action.workflow_completed',
        defaultMessage: 'COMPLETED'
    },
    messageWorkflowOutcome: {
        id: 'message.file.action.workflow_outcome',
        defaultMessage: 'OUTCOME'
    },
    messageFolderNoTargetError: {
        id: 'message.folder.action.target_error',
        defaultMessage: 'Error: No destination folder selected'
    },
    messageFolderNoOrgError: {
        id: 'message.folder.action.messageFolderNoOrgError',
        defaultMessage: 'Error: Cannot select organization folder'
    },
    messageFolderSameTargetError: {
        id: 'message.folder.action.messageFolderSameTargetError',
        defaultMessage: 'Error: Cannot select same folder'
    },
    messageFolderInvalidTargetError: {
        id: 'message.folder.action.messageFolderInvalidTargetError',
        defaultMessage: 'Error: Invalid target folder'
    },
    messageFolderNoWriteAccess: {
        id: 'message.folder.action.messageFolderNoWriteAccess',
        defaultMessage: "Error: Can't write to folder"
    },

    /**
     * Candidate DataList Hints
     */
    hintItemsMircTitle: {
        id: 'hint.items_mirc_title',
        defaultMessage: 'Minimum Response Count'
    },
    hintItemsMircDesc: {
        id: 'hint.items_mirc_desc',
        defaultMessage: 'Items with least responses'
    },
    hintItemsMarcTitle: {
        id: 'hint.items_marc_title',
        defaultMessage: 'Maximum Response Count'
    },
    hintItemsMarcDesc: {
        id: 'hint.items_marc_desc',
        defaultMessage: 'Items with most responses'
    },
    hintAvgRitTitle: {
        id: 'hint.avg_rit_title',
        defaultMessage: 'Avg RIT'
    },
    hintAvgRitDesc: {
        id: 'hint.avg_rit_desc',
        defaultMessage: 'Average Rasch unit'
    },
    hintGErrorTitle: {
        id: 'hint.g_error_title',
        defaultMessage: 'Guttman error'
    },
    hintGErrorDesc: {
        id: 'hint.g_error_desc',
        defaultMessage:
            'This can be translated as the sum of the sum of all correct responses after each incorrect response in a response vector of an individual test taker.'
    },
    hintGScoreTitle: {
        id: 'hint.g_score_title',
        defaultMessage: 'Guttman score'
    },
    hintGScoreDesc: {
        id: 'hint.g_score_desc',
        defaultMessage:
            'This can be translated as the Guttman error divided by the number of correct responses * the number of incorrect responses.'
    },
    hintGScoreDifficultyTitle: {
        id: 'hint.g_score_difficulty_title',
        defaultMessage: 'Guttman Score Difficulty'
    },
    hintGScoreDifficultyDesc: {
        id: 'hint.g_score_difficulty_desc',
        defaultMessage:
            'This can be translated as the Guttman score but only for item responses that are separated by a given difficulty in the response vector of the individual test taker. Thus, a Guttman error will only be counted as such when the difference between items g and h suffices the given difficulty level.'
    },
    hintGScoreDistanceTitle: {
        id: 'hint.g_score_distance_title',
        defaultMessage: 'Guttman Score Distance'
    },
    hintGScoreDistanceDesc: {
        id: 'hint.g_score_distance_desc',
        defaultMessage:
            'This can be translated as the Guttman score but only for item responses that are separated by a given distance in the response vector of the individual test taker. Thus, a Guttman error will only be counted as such when the difference between items g and h suffices the given distance level.'
    },
    hintGScoreDsDfTitle: {
        id: 'hint.g_score_ds_df_title',
        defaultMessage: 'Guttman Score Distance Difference'
    },
    hintGScoreDsDfDesc: {
        id: 'hint.g_score_ds_df_desc',
        defaultMessage: 'Guttman Score Distance Difference'
    },
    hintGScoreTiTitle: {
        id: 'hint.g_score_ti_title',
        defaultMessage: 'Guttman Score Response Time'
    },
    hintGScoreTiDesc: {
        id: 'hint.g_score_ti_desc',
        defaultMessage:
            'This can be translated as the Guttman score but only for item responses that are 3SD away from the mean response time for that particular item. Thus, a Guttman error will only be counted as such when the difference between items g and h suffices the response time constraint.'
    },
    hintGScoreTiDfTitle: {
        id: 'hint.g_score_ti_df_title',
        defaultMessage: 'Guttman Score Time + Difficulty'
    },
    hintGScoreTiDfDesc: {
        id: 'hint.g_score_ti_df_desc',
        defaultMessage:
            'This can be translated as the Guttman score but only for item responses that are 3SD away from the mean response time for that particular item. Thus, a Guttman error will only be counted as such when the difference between items g and h suffices the response time and difficulty constraint.'
    },
    hintGScoreDsTiTitle: {
        id: 'hint._g_score_ds_ti_title',
        defaultMessage: 'Guttman Score Distance Response Time'
    },
    hintGScoreDsTiDesc: {
        id: 'hint._g_score_ds_ti_desc',
        defaultMessage:
            'This can be translated as the Guttman score but only for item responses that are 3SD away from the mean response time for that particular item. Thus, a Guttman error will only be counted as such when the difference between items g and h suffices the response time and distance constraint.'
    },
    hintGScoreDsTiDfTitle: {
        id: 'hint.g_score_ds_ti_df_title',
        defaultMessage: 'Guttman Score Distance Time Difference'
    },
    hintGScoreDsTiDfDesc: {
        id: 'hint.g_score_ds_ti_df_desc',
        defaultMessage: 'Guttman Score Distance Time Difference'
    },
    hintWpTitle: {
        id: 'hint.wp_title',
        defaultMessage: 'Working Pace'
    },
    hintWpDesc: {
        id: 'hint.wp_desc',
        defaultMessage:
            'This formula first calculates the working speed for each test taker, which is the total time on the test / divided by the expected time on the test. The expected time on the test is the same as the first part in the formula under 8. It is the average response time, but now for all items in the test of the test taker (so N is still the number of responses but now only to the items that were in that specific test). The expected response time on the item E(Itemtime) is defined as the average response time on the item, while Otime is the actual or observed response time on the item. The first part of the formula is an absolute number which means that in the case that it is negative it will be transformed into a positive number.'
    },
    guttmanAnalysis: {
        id: 'scale.guttman_analysis',
        defaultMessage: 'Guttman Analysis'
    },
    guttmanAnalysisDesc: {
        id: 'scale.guttman_analysis_desc',
        defaultMessage:
            'Listed below are the standard deviations for the Guttman scoring. These variables are used to validate and flag aberrant behaviour in exams.'
    },
    deltas: {
        id: 'scale.deltas',
        defaultMessage: 'Δ Deltas'
    },
    deltasDesc: {
        id: 'scale.deltas_desc',
        defaultMessage:
            'Listed below are the standard deviations for the Guttman scoring. These variables are used to validate and flag aberrant behaviour in exams.'
    },
    time: {
        id: 'messages.time',
        defaultMessage: 'Time'
    },
    pValue: {
        id: 'message.p_value',
        defaultMessage: 'P'
    },
    pos: {
        id: 'messages.pos',
        defaultMessage: 'Pos'
    },
    setThresholds: {
        id: 'form.set_custom_thresholds',
        defaultMessage: 'Set report thresholds'
    },
    setThresholdsDesc: {
        id: 'form.set_custom_thresholds_desc',
        defaultMessage:
            'Listed below are the standard deviations for the Guttman scoring and the Deltas. These variables are used to validate and flag aberrant behaviour in exams.'
    },
    enableGuttmanThresholds: {
        id: 'form.enable_guttman_threshold',
        defaultMessage: 'Enable Custom Guttman Threshold'
    },
    enableDeltaThresholds: {
        id: 'form.enable_delta_threshold',
        defaultMessage: 'Enable Custom Delta Threshold'
    },
    deltaPTitle: {
        id: 'scale.delta_p_title',
        defaultMessage: 'ΔP'
    },
    deltaPDesc: {
        id: 'scale.delta_p_desc',
        defaultMessage:
            'This can be translated as the sum of the sum of all correct responses after each incorrect response with a minimum difference in P of … in a response vector of an individual test taker.'
    },
    deltaPositionsTitle: {
        id: 'scales.delta_position_title',
        defaultMessage: 'ΔPositions'
    },
    deltaPositionsDesc: {
        id: 'scales.delta_position_desc',
        defaultMessage:
            'This can be translated as the sum of the sum of all correct responses after each incorrect response with a minimum distance in positions of … in a response vector of an individual test taker.'
    },
    deltaTimeTitle: {
        id: 'scales.delta_time_title',
        defaultMessage: 'ΔTime'
    },
    deltaTimeDesc: {
        id: 'scales.delta_time_desc',
        defaultMessage:
            'This can be translated as the sum of the sum of all correct responses after each incorrect response where the observed response time is at least … standard deviations away from the expected response time in a response vector of an individual test taker.'
    },
    enableDeltaThresholds: {
        id: 'form.enable_delta_thresholds',
        defaultMessage: 'Enable delta thresholds'
    },
    hintSdTiDfTitle: {
        id: 'hint.sdtidf_title',
        defaultMessage: 'Standard Deviation for difficulty and time'
    },
    hintSdTiDfDesc: {
        id: 'hint.sdtidf_desc',
        defaultMessage: 'The amount of SD’s the test taker is from average'
    },
    confirm: {
        id: 'messages.confirmDialog.confirm',
        defaultMessage: 'Confirm'
    },
    confirmation: {
        id: 'messages.confirmDialog.confirmation',
        defaultMessage: 'Confirmation'
    },
    cancelConfirm: {
        id: 'messages.confirmDialog.cancel',
        defaultMessage: 'Cancel'
    },
    confirmDeleteUsersTitle: {
        id: 'messages.confirmDialog.title.users',
        defaultMessage: 'Delete Users?'
    },
    confirmDeleteFilesTitle: {
        id: 'messages.confirmDialog.title.files',
        defaultMessage: 'Delete Files?'
    },
    confirmDeleteUsersContent: {
        id: 'messages.confirmDialog.content.users',
        defaultMessage:
            'Would you like to delete the following users permanently?'
    },
    confirmDeleteFileContent: {
        id: 'messages.confirmDialog.content.files',
        defaultMessage:
            'Would you like to delete the following items permanently?'
    },
    confirmSelectedFiles: {
        id: 'button.text.confirmSelectedFiles',
        defaultMessage: 'Confirm selected files'
    },
    testMessage: {
        id: 'test.message',
        defaultMessage: 'Test Message Localized'
    },
    globalRequiredEmptyMessage: {
        id: 'global.required_empty_message',
        defaultMessage: 'Required field cannot be empty'
    },
    view: {
        id: 'actions.view',
        defaultMessage: 'View'
    },
    viewWorkflow: {
        id: 'actions.viewWorkflow',
        defaultMessage: 'View Workflow'
    },
    cancelWorkflow: {
        id: 'actions.cancelWorkflow',
        defaultMessage: 'Cancel Workflow'
    },
    add: {
        id: 'actions.add',
        defaultMessage: 'Add'
    },
    new: {
        id: 'actions.new',
        defaultMessage: 'New'
    },
    actions: {
        id: 'actions.actions',
        defaultMessage: 'Actions'
    },
    delete: {
        id: 'actions.label.delete',
        defaultMessage: 'Delete'
    },
    download: {
        id: 'actions.label.download',
        defaultMessage: 'Download'
    },
    edit: {
        id: 'actions.edit',
        defaultMessage: 'Edit'
    },
    permissions: {
        id: 'selection.permissions',
        defaultMessage: 'Share...'
    },
    editGroup: {
        id: 'actions.groups.editGroup',
        defaultMessage: 'Edit: {groupName}'
    },
    newGroup: {
        id: 'actions.groups.newGroup',
        defaultMessage: 'New group'
    },
    newOrganization: {
        id: 'actions.organizations.newOrganization',
        defaultMessage: 'New Organization'
    },
    newOperation: {
        id: 'actions.operations.newOperation',
        defaultMessage: 'New Operation'
    },
    organizationSaving: {
        id: 'snackbar.message.organizationSaving',
        defaultMessage: 'Saving organization'
    },
    groupSaving: {
        id: 'snackbar.message.groupSaving',
        defaultMessage: 'Saving group'
    },
    organizationCreated: {
        id: 'snackbar.message.organizationCreated',
        defaultMessage: 'Organization created successfully'
    },
    groupCreated: {
        id: 'snackbar.message.groupCreated',
        defaultMessage: 'Group created successfully'
    },
    organizationSaved: {
        id: 'snackbar.message.organizationSaved',
        defaultMessage: 'Organization saved successfully'
    },
    groupSaved: {
        id: 'snackbar.message.groupSaved',
        defaultMessage: 'Group saved successfully'
    },
    groupsCannotBeSaved: {
        id: 'groups.error.save',
        defaultMessage: 'Group could not be saved'
    },
    organizationCannotBeSaved: {
        id: 'organization.error.save',
        defaultMessage: 'Organization could not be saved'
    },
    operationCannotBeSaved: {
        id: 'operation.error.save',
        defaultMessage: 'Operation could not be saved'
    },
    groupNameInvalid: {
        id: 'error.groups.groupNameInvalid',
        defaultMessage: 'Group name is invalid'
    },
    invalidLength50: {
        id: 'error.groups.invalidLength50',
        defaultMessage: 'Name cannot exceed 50 characters'
    },
    invalidExtension: {
        id: 'error.groups.invalidExtension',
        defaultMessage: 'Missing filename extension'
    },
    groupNameRestrictedWord: {
        id: 'error.groups.groupNameRestrictedWord',
        defaultMessage: 'Name contains restricted word'
    },
    groupNameRestrictedChar: {
        id: 'error.groups.groupNameRestrictedChar',
        defaultMessage: 'Name contains restricted character'
    },
    requiredMissing: {
        id: 'error.form.requiredMissing',
        defaultMessage: 'Required field(s) are empty'
    },
    confirmDelete: {
        id: 'action.dialog.confirmDelete',
        defaultMessage: 'Are you sure you want to delete: {name}?'
    },
    confirmCancel: {
        id: 'action.dialog.confirmCancel',
        defaultMessage: 'Are you sure you want to cancel workflow: {name}?'
    },
    confirmDeleteItems: {
        id: 'action.dialog.confirmDeleteItems',
        defaultMessage: 'Are you sure you want to delete the following items?'
    },
    remove: {
        id: 'actions.remove',
        defaultMessage: 'Remove'
    },
    confirmRemove: {
        id: 'action.dialog.confirmRemove',
        defaultMessage: 'Are you sure you want to remove: {name}?'
    },
    confirm: {
        id: 'action.dialog.confirm',
        defaultMessage: 'Confirm'
    },
    addAuthority: {
        id: 'groups.dialog.addAuthority',
        defaultMessage: 'Add group or user to: {name}'
    },
    addOperation: {
        id: 'groups.dialog.addOperation',
        defaultMessage: 'Add operation to: {name}'
    },
    groups: {
        id: 'label.groups',
        defaultMessage: 'Groups'
    },
    organizations: {
        id: 'label.organizations',
        defaultMessage: 'Organizations'
    },
    operations: {
        id: 'label.operations',
        defaultMessage: 'Operations'
    },
    users: {
        id: 'label.users',
        defaultMessage: 'Users'
    },
    upload: {
        id: 'button.upload',
        defaultMessage: 'Upload'
    },
    requestsReceived: {
        id: 'label.requests_received',
        defaultMessage: 'Requests received'
    },
    requestsIssued: {
        id: 'label.requests_issued',
        defaultMessage: 'Requests issued by me'
    },
    tasks: {
        id: 'label.tasks',
        defaultMessage: 'Tasks'
    },
    reset: {
        id: 'label.reset',
        defaultMessage: 'Reset'
    },
    copy: {
        id: 'actions.label.copy',
        defaultMessage: 'Copy'
    },
    move: {
        id: 'actions.label.move',
        defaultMessage: 'Move'
    },
    moveSelected: {
        id: 'actions.label.move_selected',
        defaultMessage: 'Move to'
    },
    copySelected: {
        id: 'actions.label.copy_selected',
        defaultMessage: 'Copy to'
    },
    newFolder: {
        id: 'dialog.title.new',
        defaultMessage: 'New folder'
    },
    selectFolder: {
        id: 'dialog.title.selectFolder',
        defaultMessage: 'Select a folder'
    },
    selectCopyFolder: {
        id: 'dialog.title.selectCopyDestination',
        defaultMessage: 'Copy to: '
    },
    selectCopyMultipleFolderDestination: {
        id: 'dialog.title.selectCopyMultiDestination',
        defaultMessage: 'Copying {count} items to:'
    },
    selectMoveMultipleFolderDestination: {
        id: 'dialog.title.selectMoveMultiDestination',
        defaultMessage: 'Moving {count} items to:'
    },
    selectMoveFolder: {
        id: 'dialog.title.selectMoveDestination',
        defaultMessage: 'Move to: '
    },
    selectDefaultFolderDestination: {
        id: 'dialog.title.selectDefaultFolderDestination',
        defaultMessage: 'Select a destination folder'
    },
    select: {
        id: 'action.dialog.select',
        defaultMessage: 'Select'
    },
    selectColor: {
        id: 'form.title.selectColor',
        defaultMessage: 'Color identifier (optional):'
    },
    selectFile: {
        id: 'form.title.selectFile',
        defaultMessage: 'Select existing file'
    },
    uploadFile: {
        id: 'form.title.uploadFile',
        defaultMessage: 'Upload a file'
    },
    inheritPermissions: {
        id: 'form.label.inheritPermissions',
        defaultMessage: 'Inherit Permissions'
    },
    inheritPermissionsHelpTitle: {
        id: 'form.help.title.inheritPermissionsHelp',
        defaultMessage: 'Share...'
    },
    inheritPermissionsHelpDesc: {
        id: 'form.help.desc.inheritPermissionsHelp',
        defaultMessage:
            'Inherit permissions will include the rules set above this item. Turn this off to ensure your permissions are the only rules applied'
    },
    inheritPermissionsShow: {
        id: 'form.label.inheritPermissionsShow',
        defaultMessage: 'Show inherited permission'
    },
    contributor: {
        id: 'from.permissions.contributor',
        defaultMessage: 'Contributor'
    },
    consumer: {
        id: 'from.permissions.consumer',
        defaultMessage: 'Read'
    },
    collaborator: {
        id: 'from.permissions.collaborator',
        defaultMessage: 'Read/Write'
    },
    coordinator: {
        id: 'from.permissions.coordinator',
        defaultMessage: 'Administrator'
    },
    commentator: {
        id: 'from.permissions.commentator',
        defaultMessage: 'Read'
    },
    manager: {
        id: 'from.permissions.manager',
        defaultMessage: 'Manager'
    },
    editor: {
        id: 'from.permissions.editor',
        defaultMessage: 'Editor'
    },
    secureconsumer: {
        id: 'from.permissions.secureconsumer',
        defaultMessage: 'Read (Secured)'
    },
    consumer: {
        id: 'from.permissions.consumer',
        defaultMessage: 'Read'
    },
    readOnly: {
        id: 'tooltip.title.readOnly',
        defaultMessage: 'Read only'
    },
    documentsToReview: {
        id: 'form.request.documentsToReview',
        defaultMessage: 'Documents to Review'
    },
    newDocument: {
        id: 'form.request.new',
        defaultMessage: 'Issue New Document Review Request'
    },
    nameYourRequest: {
        id: 'form.request.nameYourRequest',
        defaultMessage: 'Name your Document Review Request'
    },
    requestCatagory: {
        id: 'form.request.requestCatagory',
        defaultMessage: 'Request or Document(s) category'
    },
    step: {
        id: 'header.step',
        defaultMessage: 'Step {step}'
    },
    catagory: {
        id: 'label.catagory',
        defaultMessage: 'Category'
    },
    selectAssignedOperation: {
        id: 'form.request.selectAssignedOperation',
        defaultMessage: 'Select the Assigning Operation(s)'
    },
    selectOrgOps: {
        id: 'form.request.selectOrgOps',
        defaultMessage:
            'Select your organization(s) & operation(s) issuing this requirement'
    },
    myBusiness: {
        id: 'form.label.myBusiness',
        defaultMessage: 'My Business'
    },
    myOperation: {
        id: 'form.label.myOperation',
        defaultMessage: 'My Operation'
    },
    selectRecipients: {
        id: 'form.request.selectRecipients',
        defaultMessage: 'Select Recipient(s)'
    },
    selectOneOrMoreRecipients: {
        id: 'form.request.selectOneOrMoreRecipients',
        defaultMessage: 'Select one or more recipients for the request(s)'
    },
    searchUsersAndOrgs: {
        id: 'form.label.searchUsersAndOrgs',
        defaultMessage: 'Search Users and Organizations'
    },
    schedule: {
        id: 'header.schedule',
        defaultMessage: 'Schedule'
    },
    selectDueDate: {
        id: 'form.label.selectDueDate',
        defaultMessage:
            'Select the due date you want to request to be acknowledged and be implemented'
    },
    responseDeadline: {
        id: 'form.label.responseDeadline',
        defaultMessage: 'Deadline for Response or Acknowledgement'
    },
    fieldsFilled: {
        id: 'stepper.label.fieldsFilled',
        defaultMessage: 'Filled out: {count} fields'
    },
    requestTitle: {
        id: 'form.title.requestTitle',
        defaultMessage: 'Title your request'
    },
    selectOrganization: {
        id: 'form.label.selectOrganization',
        defaultMessage: 'Select organization'
    },

    requestRecipients: {
        id: 'form.title.requestRecipients',
        defaultMessage: 'Add recipients'
    },
    requestDueDate: {
        id: 'form.title.requestDueDate',
        defaultMessage: 'Set due date'
    },
    recipients: {
        id: 'field.label.recipients',
        defaultMessage: 'Recipients'
    },
    youAdded: {
        id: 'form.label.youAdded',
        defaultMessage: "You've added {count} authorities"
    },
    youAddedLabel: {
        id: 'form.label.youAddedLabel',
        defaultMessage: "You've added {count}"
    },
    groupsLoading: {
        id: 'form.label.groupsLoading',
        defaultMessage: 'Groups Loading'
    },
    urgent: {
        id: 'form.label.urgent',
        defaultMessage: 'Urgent'
    },
    urgentTask: {
        id: 'form.label.urgent_task',
        defaultMessage: 'Urgent task'
    },
    endDay: {
        id: 'form.label.endDay',
        defaultMessage: 'End of day'
    },
    noon: {
        id: 'form.label.noon',
        defaultMessage: 'Noon'
    },
    custom: {
        id: 'form.label.custom',
        defaultMessage: 'Custom'
    },
    markAs: {
        id: 'label.markAs',
        defaultMessage: 'Mark as'
    },
    requestIssuer: {
        id: 'form.title.requestIssuer',
        defaultMessage: 'Issuing business or Operation'
    },
    requestAdditionalInfo: {
        id: 'form.title.requestAdditionalInfo',
        defaultMessage: 'Additional Information'
    },
    requestAdditionalInfoTitle: {
        id: 'form.title.requestAdditionalInfoTitle',
        defaultMessage: 'Add additional information'
    },
    requestReview: {
        id: 'form.title.requestReview',
        defaultMessage: 'Review'
    },
    certSupplierCertification: {
        id: 'label.process.overview.certificate',
        defaultMessage: 'Do you have a certificate?'
    },
    certSupplierCertificationIntake: {
        id: 'label.process.overview.upload',
        defaultMessage: 'Upload audit report and certificate'
    },
    certPmaQuote: {
        id: 'label.process.overview.document',
        defaultMessage: 'Document Verification'
    },
    certPaymentReview: {
        id: 'label.process.overview.payment',
        defaultMessage: 'Payment for services'
    },
    certPmaAuthenticate: {
        id: 'label.process.overview.authentication',
        defaultMessage: 'Certificate Authentication'
    },
    month: {
        id: 'messages.selector.month',
        defaultMessage: 'Month'
    },
    quarter: {
        id: 'messages.selector.quarter',
        defaultMessage: 'Quarter'
    },
    year: {
        id: 'messages.selector.year',
        defaultMessage: 'Year'
    },
    range: {
        id: 'messages.selector.range',
        defaultMessage: 'Selected Range'
    },
    accept: {
        id: 'messages.selector.accept',
        defaultMessage: 'Accept'
    },
    status: {
        id: 'messages.form.status',
        defaultMessage: 'Status'
    },
    statusPending: {
        id: 'messages.status.pending',
        defaultMessage: 'Pending'
    },
    statusInProgress: {
        id: 'messages.status.inProgress',
        defaultMessage: 'In Progress'
    },
    statusCompliant: {
        id: 'messages.status.compliant',
        defaultMessage: 'Compliant'
    },
    statusNotCompliant: {
        id: 'messages.status.notCompliant',
        defaultMessage: 'Not Compliant'
    },
    statusNA: {
        id: 'messages.status.na',
        defaultMessage: 'Not Applicable'
    },
    statusOverdue: {
        id: 'messages.status.overdue',
        defaultMessage: 'Overdue'
    },
    pickerDialogTitle: {
        id: 'picker.dialog_title',
        defaultMessage: 'Choose Documents To Add'
    },
    pickerUpIcon: {
        id: 'picker.up_icon',
        defaultMessage: 'Up icon'
    },
    pickerEmptyFolder: {
        id: 'picker.empty_folder',
        defaultMessage: 'Empty folder'
    },
    pickerNoReferenceGiven: {
        id: 'picker.no_reference_given',
        defaultMessage: 'No reference given'
    },
    noneSelected: {
        id: 'picker.none_selected',
        defaultMessage: 'No items selected.'
    },
    documentIssuedTitle: {
        id: 'datalist.issuedTasks.issuedTitle',
        defaultMessage: 'Document Reviews Assigned By Me'
    },
    noDateAssigned: {
        id: 'datalist.issuedTasks.noDateAssigned',
        defaultMessage: 'There was no {dateText} assigned'
    },
    groupsLoading: {
        id: 'form.label.groupsLoading',
        defaultMessage: 'Groups Loading'
    },
    issuers: {
        id: 'form.label.issuers',
        defaultMessage: 'Issuers'
    },
    operation: {
        id: 'form.label.operation',
        defaultMessage: 'Operation'
    },
    organization: {
        id: 'form.label.organization',
        defaultMessage: 'Organization'
    },
    organization: {
        id: 'form.label.organization',
        defaultMessage: 'Organization'
    },
    searchIssuers: {
        id: 'form.label.searchIssuers',
        defaultMessage: 'Search Issuers'
    },
    searchOrganization: {
        id: 'form.label.searchOrganization',
        defaultMessage: 'Search for an Organization'
    },
    select: {
        id: 'dialog.action.select',
        defaultMessage: 'Select'
    },
    /** Comment messaging */
    addComment: {
        id: 'form.comment.addComment',
        defaultMessage: 'Add Comment'
    },
    commentHeader: {
        id: 'layout.comment.commentHeader',
        defaultMessage: 'Comments'
    },
    issuers: {
        id: 'form.label.issuers',
        defaultMessage: 'Issuers'
    },
    operation: {
        id: 'form.label.operation',
        defaultMessage: 'Operation'
    },
    organization: {
        id: 'form.label.organization',
        defaultMessage: 'Organization'
    },
    organization: {
        id: 'form.label.organization',
        defaultMessage: 'Organization'
    },
    searchRecipients: {
        id: 'form.label.searchRecipients',
        defaultMessage: 'Search Recipients'
    },
    searchIssuers: {
        id: 'form.label.searchIssuers',
        defaultMessage: 'Search Issuers'
    },
    searchOrganization: {
        id: 'form.label.searchOrganization',
        defaultMessage: 'Search for an Organization'
    },
    open: {
        id: 'button.label.open',
        defaultMessage: 'Browse'
    },
    requestDocument: {
        id: 'form.title.requestDocument',
        defaultMessage: 'Add a Document'
    },
    allStepsTitle: {
        id: 'form.title.allStepsTitle',
        defaultMessage: 'All steps to complete'
    },
    emptyDropFiles: {
        id: 'table.label.emptyDropFiles',
        defaultMessage: 'Drop files here'
    },
    emptyNoFiles: {
        id: 'table.label.emptyNoFiles',
        defaultMessage: 'Sorry, no matching records found'
    },
    filesSelected: {
        id: 'form.label.filesSelected',
        defaultMessage: "You've added {count} files"
    },
    addComment: {
        id: 'action.button.addComment',
        defaultMessage: 'Add Comment'
    },
    uploadNew: {
        id: 'action.button.uploadNew',
        defaultMessage: 'Upload new'
    },
    uploadNewVersion: {
        id: 'action.button.uploadNewVersion',
        defaultMessage: 'Upload new version'
    },
    uploadingNewVersionPending: {
        id: 'snackbar.message.uploadingNewVersionPending',
        defaultMessage: 'Uploading new version'
    },
    uploadingNewVersionSuccess: {
        id: 'snackbar.message.uploadingNewVersionSuccess',
        defaultMessage: 'New version uploaded'
    },
    cannotUploadLocation: {
        id: 'snackbar.error.cannotUploadLocation',
        defaultMessage: 'Cannot upload to this location'
    },
    copyPending: {
        id: 'snackbar.message.copyPending',
        defaultMessage: 'Copying File(s) and Folder(s)'
    },
    copySuccess: {
        id: 'snackbar.message.copySuccess',
        defaultMessage: 'Copy cpmpleted'
    },
    movePending: {
        id: 'snackbar.message.movePending',
        defaultMessage: 'Moving File(s) and Folder(s)'
    },
    moveSuccess: {
        id: 'snackbar.message.moveSuccess',
        defaultMessage: 'Move cpmpleted'
    },
    deletePending: {
        id: 'snackbar.message.deletePending',
        defaultMessage: 'Deleting File(s) and Folder(s)'
    },
    deleteSuccess: {
        id: 'snackbar.message.deleteSuccess',
        defaultMessage: 'Delete cpmpleted'
    },
    createPending: {
        id: 'snackbar.message.createPending',
        defaultMessage: 'Creating/updating folder'
    },
    createSuccess: {
        id: 'snackbar.message.createSuccess',
        defaultMessage: 'Sucess folder created/updated '
    },
    pageAccess: {
        id: 'form.label.pageaccess',
        defaultMessage: 'Page Access'
    },
    viewFile: {
        id: 'button.view.file',
        defaultMessage: 'View file'
    },
    comments: {
        id: 'button.comments',
        defaultMessage: 'comment(s)'
    },

    /** Popup message */
    viewProfile: {
        id: 'popup.link.viewProfile',
        defaultMessage: 'View Profile'
    },
    companyProfile: {
        id: 'popup.link.companyProfile',
        defaultMessage: 'Company Profile'
    },
    sendMessage: {
        id: 'popup.link.sendMessage',
        defaultMessage: 'Send Message'
    },
    sentBy: {
        id: 'popup.message.sentBy',
        defaultMessage: 'Sender {name}'
    },
    lastEdit: {
        id: 'popup.message.lastEdit',
        defaultMessage: 'Last edit'
    },
    documentProperties: {
        id: 'header.documentProperties',
        defaultMessage: 'Document properties'
    },
    documentActions: {
        id: 'header.documentActions',
        defaultMessage: 'Actions'
    },
    documentDetails: {
        id: 'header.documentDetails',
        defaultMessage: 'Document details'
    },
    creator: {
        id: 'label.title.creator',
        defaultMessage: 'Creator'
    },
    created: {
        id: 'label.title.created',
        defaultMessage: 'Created'
    },
    modifier: {
        id: 'label.title.modifier',
        defaultMessage: 'Modifier'
    },
    modified: {
        id: 'label.title.modified',
        defaultMessage: 'Modified'
    },
    business: {
        id: 'label.business',
        defaultMessage: 'Business'
    },
    personal: {
        id: 'label.personal',
        defaultMessage: 'Personal'
    },
    share: {
        id: 'label.share',
        defaultMessage: 'Share'
    },
    sharedFolder: {
        id: 'label.shared_folder',
        defaultMessage: 'Shared'
    },
    shared: {
        id: 'label.shared',
        defaultMessage: 'Shared with me'
    },
    sharedTooltip: {
        id: 'label.shared.tooltip',
        defaultMessage: 'Shared from external organizations'
    },
    modifier: {
        id: 'table.header.modifer',
        defaultMessage: 'Modifier'
    },
    modified: {
        id: 'table.header.modified',
        defaultMessage: 'Modified'
    },
    size: {
        id: 'table.header.size',
        defaultMessage: 'File Size'
    },
    assignedTo: {
        id: 'table.header.assignedTo',
        defaultMessage: 'Assigned To'
    },
    assignedBy: {
        id: 'table.header.assignedBy',
        defaultMessage: 'Sender'
    },
    assignee: {
        id: 'table.header.assignee',
        defaultMessage: 'Receiver'
    },
    progress: {
        id: 'table.header.label',
        defaultMessage: 'Progress'
    },
    submitted: {
        id: 'table.header.submitted',
        defaultMessage: 'Submitted'
    },
    deadline: {
        id: 'table.header.deadline',
        defaultMessage: 'Deadline'
    },
    title: {
        id: 'message.title',
        defaultMessage: 'Title'
    },
    dueDate: {
        id: 'table.header.dueDate',
        defaultMessage: 'Due date'
    },
    dueTime: {
        id: 'table.header.dueTime',
        defaultMessage: 'Due Time'
    },
    collaborators: {
        id: 'tabloe.header.collaborators',
        defaultMessage: 'Collaborators'
    },
    completion: {
        id: 'tabloe.header.completion',
        defaultMessage: 'Documents'
    },
    business: {
        id: 'label.business',
        defaultMessage: 'Business'
    },
    personal: {
        id: 'label.personal',
        defaultMessage: 'Personal'
    },
    specification: {
        id: 'feild.label.specification',
        defaultMessage: 'Specification'
    },
    documentType: {
        id: 'field.label.documentType',
        defaultMessage: 'Document Type'
    },
    optionSpecification: {
        id: 'selection.option.optionSpecification',
        defaultMessage: 'Specification'
    },
    noOptionsAvailable: {
        id: 'list.noOptionsAvailable',
        defaultMessage: 'No Options Available'
    },
    statusList: {
        id: 'field.label.statusList',
        defaultMessage: 'Status List'
    },
    sort: {
        id: 'field.label.sort',
        defaultMessage: 'Sort'
    },
    sortBy: {
        id: 'field.label.sortBy',
        defaultMessage: 'Sort By'
    },
    requiredDocument: {
        id: 'version.history.requiredDocument',
        defaultMessage: 'Please Add a Document'
    },
    historyTitle: {
        id: 'version.history.historyTitle',
        defaultMessage: 'History'
    },
    date: {
        id: 'label.date',
        defaultMessage: 'Date'
    },
    sentTo: {
        id: 'label.sentTo',
        defaultMessage: 'Receiver'
    },
    sentFrom: {
        id: 'label.sentFrom',
        defaultMessage: 'Sender'
    },
    dueDate: {
        id: 'label.due_date',
        defaultMessage: 'Due date'
    },
    dateRange: {
        id: 'label.date_range',
        defaultMessage: 'Date range'
    },
    notAllowed: {
        id: 'menu.label.noPermissions',
        defaultMessage: 'Not Allowed'
    },
    personalProfile: {
        id: 'menu.personal.profile',
        defaultMessage: 'Personal Profile'
    },
    changePassword: {
        id: 'menu.change.password',
        defaultMessage: 'Change Password'
    },
    myAddressBook: {
        id: 'menu.address.book',
        defaultMessage: 'My Address Book'
    },
    logout: {
        id: 'menu.logout',
        defaultMessage: 'Logout'
    },

    /** Workflow document viewer messaging */
    acknowledgeButton: {
        id: 'document.workflow.acknowledgeButton',
        defaultMessage: 'Yes, I am compliant'
    },
    acknowledgeConfirm: {
        id: 'document.workflow.acknowledgeConfirm',
        defaultMessage:
            'You are about to accept that you ARE compliant with the current document. Continue?'
    },
    askForRevision: {
        id: 'document.workflow.askForRevision',
        defaultMessage: 'Ask for a revision'
    },
    askForRevisionConfirm: {
        id: 'document.workflow.askForRevisionConfirm',
        defaultMessage:
            'You are about to request a revision of the current document. Continue?'
    },
    notCompliantConfirm: {
        id: 'document.workflow.notCompliantConfirm',
        defaultMessage:
            'You have answered that you are NOT compliant with the current document. Continue?'
    },
    noButton: {
        id: 'document.workflow.notCompliant',
        defaultMessage: 'No, I am not compliant'
    },
    notApplicable: {
        id: 'document.workflow.notApplicable',
        defaultMessage: 'Not Applicable'
    },
    notApplicableConfirm: {
        id: 'document.workflow.notApplicableConfirm',
        defaultMessage:
            'The other options are not applicable to the current document. Continue?'
    },
    taskDone: {
        id: 'document.workflow.taskDone',
        defaultMessage: 'Task done'
    },
    waitingForRevision: {
        id: 'document.workflow.waitingForRevision',
        defaultMessage: 'Waiting on revision'
    },
    nextDocument: {
        id: 'document.workflow.nextDocument',
        defaultMessage: 'Go to next document'
    },
    buttonOr: {
        id: 'document.workflow.buttonOr',
        defaultMessage: 'or'
    },
    workflowDetails: {
        id: 'document.workflow.workflowDetails',
        defaultMessage: 'Workflow details'
    },
    workflowDescription: {
        id: 'document.workflow.workflowDescription',
        defaultMessage: 'Description'
    },
    workflowAdditionalInfo: {
        id: 'document.workflow.workflowAdditionalInfo',
        defaultMessage: 'Additional Information'
    },
    workflowType: {
        id: 'document.workflow.workflowType',
        defaultMessage: 'Type'
    },
    workflowAssigned: {
        id: 'document.workflow.workflowAssigned',
        defaultMessage: 'Assigned'
    },
    workflowDue: {
        id: 'document.workflow.workflowDue',
        defaultMessage: 'Due'
    },
    workflowsComplete: {
        id: 'dialog.workflow.workflowsComplete',
        defaultMessage: 'Request Tasks Complete'
    },
    taskPackageComplete: {
        id: 'dialog.workflow.taskPackageComplete',
        defaultMessage: 'All the requests in this package have been completed.'
    },
    tasksCompleteClose: {
        id: 'dialog.workflow.tasksCompleteClose',
        defaultMessage: 'Close'
    },
    issuingDetails: {
        id: 'document.workflow.issuingDetails',
        defaultMessage: 'Issuing Organization'
    },
    lastEdit: {
        id: 'document.workflow.lastEdit',
        defaultMessage: 'Last edit was on {date} by {user}'
    },
    catDocAll: {
        id: 'document.category.all',
        defaultMessage: 'All Documents'
    },
    all: {
        id: 'document.permission.all',
        defaultMessage: 'All'
    },
    catDocFolder: {
        id: 'document.category.folder',
        defaultMessage: 'This folder'
    },
    placeholderSearchGroup: {
        id: 'placeholder.search.group',
        defaultMessage: 'Search for an organization or user group...'
    },
    placeholderSearchDocument: {
        id: 'placeholder.search.document',
        defaultMessage: 'Search documents by their filename...'
    },
    placeholderSearchTasks: {
        id: 'placeholder.search.tasks',
        defaultMessage: 'Search for a task in your list...'
    },
    placeholderSearchUser: {
        id: 'placeholder.search.user',
        defaultMessage: 'Search for a user...'
    },
    filterModifier: {
        id: 'filter.modifier',
        defaultMessage: 'Last modified by'
    },
    filterCreated: {
        id: 'filter.created',
        defaultMessage: 'Date'
    },
    companyTrustScore: {
        id: 'label.companyTrustScore',
        defaultMessage: 'Company trust score'
    },
    resetDate: {
        id: 'messages.button.resetDate',
        defaultMessage: 'Reset'
    },
    home: {
        id: 'links.home',
        defaultMessage: 'Home'
    },
    rowsPerPage: {
        id: 'table.label.rowsPerPage',
        defaultMessage: 'Rows per page: '
    },
    selectedRows: {
        id: 'table.label.selectedRows',
        defaultMessage: 'row(s) selected'
    },
    /** Requested tasks report messaging */
    requestsStatus: {
        id: 'table.title.requestDocuments',
        defaultMessage: 'Requests status report'
    },
    requestDocuments: {
        id: 'table.header.requestDocuments',
        defaultMessage: 'Request Documents'
    },
    taskTitle: {
        id: 'table.header.taskTitle',
        defaultMessage: 'Task Title'
    },
    initiator: {
        id: 'table.header.initiator',
        defaultMessage: 'Initiator'
    },
    receiver: {
        id: 'table.header.receiver',
        defaultMessage: 'Receiver'
    },
    requestStatus: {
        id: 'table.header.requestStatus',
        defaultMessage: 'Status'
    },
    pending: {
        id: 'task.status.pending',
        defaultMessage: 'Pending'
    },
    notCompliant: {
        id: 'task.status.notCompliant',
        defaultMessage: 'Not Compliant'
    },
    inprogress: {
        id: 'task.status.inprogress',
        defaultMessage: 'In Progress'
    },
    compliant: {
        id: 'task.status.compliant',
        defaultMessage: 'Compliant'
    },
    na: {
        id: 'task.status.na',
        defaultMessage: 'Not Applicable'
    },
    overdue: {
        id: 'task.status.overdue',
        defaultMessage: 'Overdue'
    },
    notStarted: {
        id: 'task.progress.notStarted',
        defaultMessage: 'Not Yet Started'
    },
    responded: {
        id: 'task.progress.responded',
        defaultMessage: 'Responded'
    },
    files: {
        id: 'treeview.label.files',
        defaultMessage: 'Files'
    },
    folders: {
        id: 'treeview.label.folders',
        defaultMessage: 'Folders'
    },
    statistics: {
        id: 'title.statistics',
        defaultMessage: 'Statistics'
    },
    errorFormMessage: {
        id: 'messages.error.form_message',
        defaultMessage: 'There was a problem with your form:'
    },
    issued: {
        id: 'chart.label',
        defaultMessage: 'Issued'
    },
    buyer: {
        id: 'label.org.buyer',
        defaultMessage: 'Buyer'
    },
    products: {
        id: 'label.orglproducts',
        defaultMessage: '{value} Product(s)'
    },
    na: {
        id: 'label.na',
        defaultMessage: 'N/A'
    },
    newVersion: {
        id: 'dialog.title.newVersion',
        defaultMessage: 'New Version'
    },
    modifyImage: {
        id: 'field.title.modifyImage',
        defaultMessage: 'Modify the image'
    },
    aaPlus: {
        id: 'label.class.aaPlus',
        defaultMessage: 'AA+'
    },
    peopleManager: {
        id: 'page.title.peopleManager',
        defaultMessage: 'People Manager'
    },
    groupAnModify: {
        id: 'message.groupAnModify',
        defaultMessage:
            'This section allows you to view and modify Users and Groups in the System'
    },
    export: {
        id: 'button.label.export',
        defaultMessage: 'Export'
    },
    pageOf: {
        id: 'table.footer.pageOf',
        defaultMessage: 'Page {index} of {total}'
    },
    welcomeBack: {
        id: 'page.title.welcomeBack',
        defaultMessage: 'Welcome back!'
    },
    signInBelow: {
        id: 'page.title.signInBelow',
        defaultMessage: 'Sign-in below to access the trust platform'
    },
    forgotPassword: {
        id: 'page.title.forgotPassword',
        defaultMessage: 'Did you forget your password?'
    },
    signIn: {
        id: 'page.signign.label.signIn',
        defaultMessage: 'Sign In'
    },
    ok: {
        id: 'label.ok',
        defaultMessage: 'OK'
    },
    uploading: {
        id: 'label.uploading',
        defaultMessage: 'Uploading'
    },
    lockedTitle: {
        id: 'error.locked_title',
        defaultMessage: 'Document is locked'
    },
    lockedMessage: {
        id: 'error.locked_message',
        defaultMessage:
            'Sorry, this document is locked for secure viewing only, please use the secure browser provided. If you do not have the secure browser click the link below to download it.'
    },
    downloadBrowserDMG: {
        id: 'button.download_browser_dmg',
        defaultMessage: 'Download Browser (dmg)'
    },
    downloadBrowserMSI: {
        id: 'button.download_browser_msi',
        defaultMessage: 'Download Browser (msi)'
    },

    /**
     * START PDF Viewer messages
     */
    pdfRequirePasswordToOpen: {
        id: 'message.pdf.requirePasswordToOpen',
        defaultMessage: 'This document requires a password to open'
    },
    pdfClickToDownload: {
        id: 'message.pdf.clickToDownload',
        defaultMessage: 'Click to download'
    },
    pdfNoAttachment: {
        id: 'message.pdf.noAttachment',
        defaultMessage: 'There is no attachment'
    },
    pdfNoBookmark: {
        id: 'message.pdf.noBookmark',
        defaultMessage: 'There is no bookmark'
    },
    pdfDragDropFile: {
        id: 'message.pdf.dragDropFile',
        defaultMessage: 'Drag and drop a PDF document here'
    },
    pdfDocumentProperties: {
        id: 'message.pdf.documentProperties',
        defaultMessage: 'Document Properties'
    },
    pdfGoToFirstPage: {
        id: 'messages.pdf.goToFirstPage',
        defaultMessage: 'Go to First Page'
    },
    pdfGoToLastPage: {
        id: 'message.pdf. goToLastPage',
        defaultMessage: 'Go to Last Page'
    },
    pdfHandTool: { id: 'message.pdf.handTool', defaultMessage: 'Hand Tool' },
    pdfHorizontalScrolling: {
        id: 'message.pdf.horizontalScrolling',
        defaultMessage: 'Horizontal Scrolling'
    },
    pdfRotateBackward: {
        id: 'message.pdf.rotateBackward',
        defaultMessage: 'Rotate Counterclockwise'
    },
    pdfRotateForward: {
        id: 'message.pdf.rotateForward',
        defaultMessage: 'Rotate Clockwise'
    },
    pdfTextSelectionTool: {
        id: 'message.pdf.textSelectionTool',
        defaultMessage: 'Text Selection Tool'
    },
    pdfVerticalScrolling: {
        id: 'message.pdf.verticalScrolling',
        defaultMessage: 'Vertical Scrolling'
    },
    pdfWrappedScrolling: {
        id: 'message.pdf.wrappedScrolling',
        defaultMessage: 'Wrapped Scrolling'
    },
    pdfAuthor: { id: 'message.pdf.author', defaultMessage: 'Author' },
    pdfClose: { id: 'message.pdf.close', defaultMessage: 'Close' },
    pdfCreationDate: {
        id: 'message.pdf.creationDate',
        defaultMessage: 'Creation Date'
    },
    pdfCreator: { id: 'message.pdf.creator', defaultMessage: 'Creator' },
    pdfFileName: { id: 'message.pdf.fileName', defaultMessage: 'File Name' },
    pdfFileSize: { id: 'message.pdf.fileSize', defaultMessage: 'File Size' },
    pdfKeywords: { id: 'message.pdf.keywords', defaultMessage: 'Keywords' },
    pdfModificationDate: {
        id: 'message.pdf.modificationDate',
        defaultMessage: 'Modification Date'
    },
    pdfPageCount: { id: 'message.pdf.pageCount', defaultMessage: 'Page Count' },
    pdfProducer: {
        id: 'message.pdf.pdfProducer',
        defaultMessage: 'PDF producer'
    },
    pdfVersion: { id: 'message.pdf.pdfVersion', defaultMessage: 'PDF Version' },
    pdfSubject: { id: 'message.pdf.subject', defaultMessage: 'Subject' },
    pdfTitle: { id: 'message.pdf.title', defaultMessage: 'Title' },
    pdfEnterToSearch: {
        id: 'message.pdf.enterToSearch',
        defaultMessage: 'Enter to search'
    },
    pdfMatchCase: { id: 'message.pdf.matchCase', defaultMessage: 'Match Case' },
    pdfNextMatch: { id: 'message.pdf.nextMatch', defaultMessage: 'Next Match' },
    pdfPreviousMatch: {
        id: 'message.pdf.previousMatch',
        defaultMessage: 'Previous Match'
    },
    pdfWholeWords: {
        id: 'message.pdf.wholeWords',
        defaultMessage: 'Whole words'
    },
    pdfAttachment: {
        id: 'message.pdf.attachment',
        defaultMessage: 'Attachment'
    },
    pdfBookmark: { id: 'message.pdf.bookmark', defaultMessage: 'Bookmark' },
    pdfThumbnail: { id: 'message.pdf.thumbnail', defaultMessage: 'Thumbnail' },
    pdfDownload: { id: 'message.pdf.download', defaultMessage: 'Download' },
    pdfFullscreen: {
        id: 'message.pdf.fullScreen',
        defaultMessage: 'Fullscreen'
    },
    pdfMoreActions: {
        id: 'message.pdf.moreActions',
        defaultMessage: 'More Actions'
    },
    pdfNextPage: { id: 'message.pdf.nextPage', defaultMessage: 'Next Page' },
    pdfOpenFile: { id: 'message.pdf.openFile', defaultMessage: 'Open file' },
    pdfPreviousPage: {
        id: 'message.pdf.previousPage',
        defaultMessage: 'Previous page'
    },
    pdfSearch: { id: 'message.pdf.search', defaultMessage: 'Search' },
    pdfToggleSidebar: {
        id: 'message.pdf.toggleSidebar',
        defaultMessage: 'Toggle sidebar'
    },
    pdfZoomIn: { id: 'message.pdf.zoomIn', defaultMessage: 'Zoom in' },
    pdfZoomOut: { id: 'message.pdf.zoomOut', defaultMessage: 'Zoom out' },
    pdfSubmit: { id: 'message.pdf.submit', defaultMessage: 'Submit' },
    pdfTryAgain: {
        id: 'message.pdf.tryAgain',
        defaultMessage: 'The password is wrong. Please try again'
    },
    pdfActualSize: {
        id: 'message.pdf.actualSize',
        defaultMessage: ' Actual size'
    },
    pdfPageFit: { id: 'message.pdf.pageFit', defaultMessage: 'Page fit' },
    pdfPageWidth: { id: 'message.pdf.pageWidth', defaultMessage: 'Page width' },
    /**
     * END PDF Viewer messages
     */
    errorTitle: {
        id: 'error.label.errorTitle',
        defaultMessage: 'Something went wrong!'
    },
    informError: {
        id: 'error.label.informError',
        defaultMessage:
            'A report has been sent to the developers detailing the error with the following:'
    },
    errorId: {
        id: 'error.label.errorId',
        defaultMessage: 'Error Id: '
    },
    clipboardCopy: {
        id: 'message.copy.clipboardSuccess',
        defaultMessage: 'Successfully copied to clipboard'
    },
    showHideColumns: {
        id: 'message.table.show_hide_columns',
        defaultMessage: 'Show/hide columns'
    },
    secureViewOnly: {
        id: 'tooltip.secure_view_only',
        defaultMessage: 'Secure viewing only'
    },
    print: {
        id: 'message.table.print',
        defaultMessage: 'Print'
    },
    intlAdmins: {
        id: 'internal.org.intladmins',
        defaultMessage: 'Administrators'
    },
    intlInternal: {
        id: 'internal.org.intlinternal',
        defaultMessage: 'Internal'
    },
    intlEmployees: {
        id: 'internal.org.intlemployees',
        defaultMessage: 'Employees'
    },
    intlOperations: {
        id: 'internal.org.intloperations',
        defaultMessage: 'Operations'
    },
    intlReviewers: {
        id: 'internal.org.intlreviewers',
        defaultMessage: 'Specification Reviewers'
    },
    intlMasterAuthenticators: {
        id: 'internal.org.intlMasterAuthenticators',
        defaultMessage: 'Master Authenticators'
    },
    intlSuppliers: {
        id: 'internal.org.intlsuppliers',
        defaultMessage: 'Suppliers'
    },
    intlEmployee: {
        id: 'internal.org.intlEmployee',
        defaultMessage: 'Employee'
    },
    internalSection: {
        id: 'form.label.internalSection',
        defaultMessage: 'Internal Section'
    },
    employeesSection: {
        id: 'form.label.employeesSection',
        defaultMessage: 'Employees Section'
    },
    onboardingTitle: {
        id: 'onboarding.label.title',
        defaultMessage: 'Create your account'
    },
    onboardingSubmit: {
        id: 'button.label.onboardingSubmit',
        defaultMessage: 'Accept & Finish'
    },
    onboardingAgreement: {
        id: 'form.label.onboardingAgreement',
        defaultMessage: 'By signing up, you agree to our'
    },
    termsOfService: {
        id: 'label.termsOfService',
        defaultMessage: 'Terms of Service'
    },
    termsOfServiceRequired: {
        id: 'onboarding.missing_terms_accept_error',
        defaultMessage:
            'You must accept the Terms of Service to create your account'
    },
    privacyPolicy: {
        id: 'label.privacyPolicy',
        defaultMessage: 'Privacy Policy'
    },
    privacyPolicyRequired: {
        id: 'onboarding.missing_privacy_accept_error',
        defaultMessage:
            'You must accept the Privacy Policy to create your account'
    },
    invtTitle: {
        id: 'invt.label.title',
        defaultMessage: 'Invite to connect'
    },
    invtLabelFrom: {
        id: 'invt.label.from',
        defaultMessage: 'Send the invitation from: *'
    },
    invtLabelRelationship: {
        id: 'invt.label.relationship',
        defaultMessage: 'Invitation is going to: *'
    },
    invtLabelRole: {
        id: 'invt.label.role',
        defaultMessage: 'Employee role should be: *'
    },
    invtLabelEmail: {
        id: 'invt.label.email',
        defaultMessage: 'Email Addresses *'
    },
    invtLabelMessage: {
        id: 'invt.label.message',
        defaultMessage: 'Custom message (optional)'
    },
    invtSubmit: {
        id: 'invt.button.label',
        defaultMessage: 'Send invitations'
    },
    invtSending: {
        id: 'snackbar.invt.sending',
        defaultMessage: 'Sending invitations'
    },
    invtSendSuccess: {
        id: 'snackbar.invt.success',
        defaultMessage: 'Invitations sent'
    },
    invtSendError: {
        id: 'snackbar.invt.error',
        defaultMessage: 'Error sending invitations'
    },
    placeholderSelect: {
        id: 'messages.placeholder.select',
        defaultMessage: 'Please select'
    },
    placeholderMessageHere: {
        id: 'messages.placeholder.messageHere',
        defaultMessage: 'Your message here'
    },
    placeholderEmail: {
        id: 'messages.placeholder.email',
        defaultMessage: 'example@domain.com'
    },
    linkExpired: {
        id: 'error.page.linkExpired',
        defaultMessage: 'Link has expired'
    },
    loggedIn: {
        id: 'error.page.loggedIn',
        defaultMessage: 'User logged in'
    },
    start: {
        id: 'button.label',
        defaultMessage: 'Start'
    },
    requestSpecification: {
        id: 'form.title.label',
        defaultMessage: 'Request a Specification'
    },
    sendFinal: {
        id: 'form.label.finalReview',
        defaultMessage: 'Send Request: Final review'
    },
    selectCertificateType: {
        id: 'form.title.selectCertificateType',
        defaultMessage:
            'Select the certificate you would like to request from the recipients:'
    },
    requestCertificateType: {
        id: 'form.label.requestCertificateType',
        defaultMessage: 'Type of Certificate'
    },
    type: {
        id: 'form.label.type',
        defaultMessage: 'Type'
    },
    issueRequest: {
        id: 'button.wizard.label',
        defaultMessage: 'Issue Request'
    },
    requestCertification: {
        id: 'form.label.requestCertification',
        defaultMessage: 'Request Certification'
    },
    requestAdditionalInformation: {
        id: 'form.label.requestAdditionalInformation',
        defaultMessage: 'Add additional information'
    },
    applicableFiles: {
        id: 'form.field.label.applicableFiles',
        defaultMessage:
            'If applicable, attach a file for recipients (instructions, guidance materials, etc)'
    },
    issuingEntity: {
        id: 'form.label.issuingEntity',
        defaultMessage: 'Issuing Entity'
    },
    pmaAuthenticateIntro: {
        id: 'task.pmaauthenticate.intro',
        defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nisi dolor, facilisis sed lectus sed,
        varius posuere leo. Nam purus dui, placerat egestas mattis sit amet, gravida sit amet metus.
        Pellentesque vel dignissim ligula. Nunc purus nisi, consequat a pretium eget, sodales quis augue.
        Praesent lacinia arcu quis tellus blandit aliquet.`
    },
    certIntakeAuthenticateIntro: {
        id: 'task.certintake.intro',
        defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nisi dolor, facilisis sed lectus sed,
        varius posuere leo. Nam purus dui, placerat egestas mattis sit amet, gravida sit amet metus.
        Pellentesque vel dignissim ligula. Nunc purus nisi, consequat a pretium eget, sodales quis augue.
        Praesent lacinia arcu quis tellus blandit aliquet.`
    },
    brcAuditOne: {
        id: 'certificate.type.brc',
        defaultMessage: 'BRC AuditOne Packaging Standard Certificate'
    },
    brcUploadAuditOne: {
        id: 'certificate.type.upload.brc',
        defaultMessage: 'Upload Certificate (1-AuditOne)'
    },
    customer: {
        id: 'label.customer',
        defaultMessage: 'Customer'
    },
    assignedTo: {
        id: 'label.assigned_to',
        defaultMessage: 'Assigned to'
    },
    certExpirationDate: {
        id: 'certificate.exp.date.brc',
        defaultMessage: 'Certificate expiration date'
    },
    requirement: {
        id: 'label.requirement',
        defaultMessage: 'Requirement:'
    },
    pmaAuthenticateExpire: {
        id: 'task.pmaauthenticate.expire',
        defaultMessage: 'Set expiration for authentication:'
    },
    certIntakeName: {
        id: 'task.certintake.name',
        defaultMessage: 'Name your certificate'
    },
    certIntakeYesNo: {
        id: 'task.certintake.yesno',
        defaultMessage:
            'Do you have a certificate or document issued in 2020 that evidences compliance with the above requirement?'
    },
    certIntakeYes: {
        id: 'task.certintake.yes',
        defaultMessage: 'Yes'
    },
    certIntakeNo: {
        id: 'task.certintake.no',
        defaultMessage: 'No'
    },
    certIntakeBack: {
        id: 'task.certintake.back',
        defaultMessage: 'Back'
    },
    certIntakeComplete: {
        id: 'task.certintake.complete',
        defaultMessage: 'Complete task'
    },
    certIntakeUploadReportCert: {
        id: 'task.certintake.upload.report',
        defaultMessage: 'Upload audit report and certificate'
    },
    certIntakePrivacyOptions: {
        id: 'task.certintake.privacy.options',
        defaultMessage: 'Privacy options'
    },
    certIntakePrivacyOptionsPrivate: {
        id: 'task.certintake.privacy.options.private',
        defaultMessage: 'Private'
    },
    certIntakePrivacyOptionsPublic: {
        id: 'task.certintake.privacy.options.public',
        defaultMessage: 'Public'
    },
    authenticateButton: {
        id: 'task.pmaauthenticate.button',
        defaultMessage: 'Authenticate'
    },
    expires: {
        id: 'label.expires',
        defaultMessage: 'Expires'
    },
    noAttachedDocuments: {
        id: 'label.no_documents',
        defaultMessage: 'No documents attached'
    },
    payNowButton: {
        id: 'button.pay_now',
        defaultMessage: 'Pay now'
    },
    newOrganization: {
        id: 'tooltip.add_organization',
        defaultMessage: 'New Organization'
    },
    newGroup: {
        id: 'tooltip.add_group',
        defaultMessage: 'New Group'
    },
    addExisting: {
        id: 'tooltip.add_existing_group',
        defaultMessage: 'Add Existing (user/group)'
    },
    completeTask: {
        id: 'button.completeTask',
        defaultMessage: 'Complete task'
    },
    sendQuote: {
        id: 'button.sendQuote',
        defaultMessage: 'Send quote'
    },
    readMore: {
        id: 'button.read_more',
        defaultMessage: 'Read more'
    },
    readLess: {
        id: 'button.read_less',
        defaultMessage: 'Read less'
    },
    authenticationFee: {
        id: 'label.pmaQuoteInformation',
        defaultMessage: 'Authentication fee'
    },
    fee: {
        id: 'label.fee',
        defaultMessage: 'Fee'
    },
    pmaQuoteInformation: {
        id: 'information.pmaQuoteInformation',
        defaultMessage:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nisi dolor, facilisis sed lectus sed, varius posuere leo. Nam purus dui, placerat egestas mattis sit amet, gravida sit amet metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nisi dolor, facilisis sed lectus sed, varius posuere leo. Nam purus dui, placerat egestas mattis sit amet, gravida sit amet metus.'
    },
    paymentReviewInformation: {
        id: 'information.paymentReviewInformation',
        defaultMessage:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nisi dolor, facilisis sed lectus sed, varius posuere leo. Nam purus dui, placerat egestas mattis sit amet, gravida sit amet metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nisi dolor, facilisis sed lectus sed, varius posuere leo. Nam purus dui, placerat egestas mattis sit amet, gravida sit amet metus.'
    },
    customer: {
        id: 'label.customer',
        defaultMessage: 'Customer'
    },
    assignedTo: {
        id: 'label.assignedTo',
        defaultMessage: 'Assigned to'
    },
    processOverview: {
        id: 'form.title.processOverview',
        defaultMessage: 'Process Overview'
    },
    haveACertificate: {
        id: 'track.label.title.haveACertificate',
        defaultMessage: 'Do you have a certificate?'
    },
    selected: {
        id: 'track.label.subtitle.yes',
        defaultMessage: 'Selected "{answer}"'
    },
    uploadCertificate: {
        id: 'track.label.title.uploadCertificate',
        defaultMessage: 'Upload audit report and certificate'
    },
    documentsAttached: {
        id: 'track.label.subtitle.documentsAttached',
        defaultMessage: '{count} Document(s) attached'
    },
    no: {
        id: 'button.label.no',
        defaultMessage: 'No'
    },
    yes: {
        id: 'button.label.yes',
        defaultMessage: 'Yes'
    },
    completedByThirdParty: {
        id: 'track.label.subtitle.completedByThirdParty',
        defaultMessage: 'Completed by third party'
    },
    paymentForServices: {
        id: 'track.label.title.paymentForServices',
        defaultMessage: 'Payment for services'
    },
    unverifiedExit: {
        id: 'error.unverified.exit',
        defaultMessage: 'Exit'
    },
    unverifiedMessage: {
        id: 'error.unverified.message',
        defaultMessage:
            "Oops, it appears that you haven't signed up yet. Please check your email to sign up."
    },
    unverifiedTitle: {
        id: 'error.unverified.title',
        defaultMessage: 'Page has been restricted!'
    },
    inviteExpired: {
        id: 'error.inviteExpired',
        defaultMessage:
            'Your invitation has expired. Please ask the member to send a new invitation'
    },
    brandOwner: {
        id: 'label.org.sublabel.brandOwner',
        defaultMessage: 'Brand owner'
    },
    nameOfCompany: {
        id: 'table.header.label.nameOfCompanyOperation',
        defaultMessage: 'Receiver'
    },
    recipientEqualsIssuer: {
        id: 'form.error.recpientEqualsIssuer',
        defaultMessage: 'Recipient and Issuer cannot be the same'
    },
    catDocuments: {
        id: 'search.category.documents',
        defaultMessage: 'Documents'
    },
    catPeople: {
        id: 'search.category.people',
        defaultMessage: 'People'
    },
    catOrganizations: {
        id: 'search.category.organizations',
        defaultMessage: 'Organizations'
    },
    catRequests: {
        id: 'search.category.requests',
        defaultMessage: 'Requests'
    },
    catEverything: {
        id: 'search.category.all',
        defaultMessage: 'Everything'
    },
    placeholderSearchDocument: {
        id: 'placeholder.search.category',
        defaultMessage:
            'Search for people, organizations, documents, or requests'
    },
    noResultsFound: {
        id: 'search.result.empty',
        defaultMessage: 'No results found'
    },
    openFolder: {
        id: 'action.label.openFolder',
        defaultMessage: 'Open'
    },
    couldNotFindDirectoryTitle: {
        id: 'error.title.couldNotFindDirectory',
        defaultMessage: 'Directory could not be found'
    },
    couldNotFindDirectory: {
        id: 'error.couldNotFindDirectory',
        defaultMessage:
            'The directory {param} could not be found. The folder may have moved or been deleted'
    },
    couldNotFindDocumentTitle: {
        id: 'error.title.couldNotFindDocument',
        defaultMessage: 'Document missing'
    },
    couldNotFindDocument: {
        id: 'error.couldNotFindDocument',
        defaultMessage:
            "That document could not be found. This could be because it has been moved, deleted, or you simply don't have access"
    },
    errorMissingTaskTitle: {
        id: 'error.title.errorMissingTask',
        defaultMessage: 'Task could not be found'
    },
    errorMissingTask: {
        id: 'error.errorMissingTask',
        defaultMessage:
            'That task could not be found. It may have already been completed or is not assigned to you'
    },
    errorRetrievingTasks: {
        id: 'error.errorRetrievingTasks',
        defaultMessage: 'Error retrieving tasks'
    },
    errorMissingUserTitle: {
        id: 'error.title.errorMissingUser',
        defaultMessage: 'Sorry, that user does not exist'
    },
    errorMissingUser: {
        id: 'error.errorMissingUser',
        defaultMessage:
            'The user {param} could not be found. The user may have moved or been deleted'
    },
    errorUnauthorizedFolder: {
        id: 'error.errorUnauthorized',
        defaultMessage: 'You do not have write access to this folder'
    },
    cancelled: {
        id: 'message.cancelled',
        defaultMessage: 'Cancelled'
    },
    addItemToGroupPending: {
        id: 'snack.add.itemPending',
        defaultMessage: 'Adding item to group'
    },
    addItemToGroupSuccess: {
        id: 'snack.add.itemSuccess',
        defaultMessage: 'Item added'
    },
    addItemToGroupFail: {
        id: 'snack.add.itemFail',
        defaultMessage: 'Cannot add duplicated'
    },
    deleteOrganization: {
        id: 'snack.delete.organization',
        defaultMessage: 'Deleting organization'
    },
    removeOrganization: {
        id: 'snack.remove.organization',
        defaultMessage: 'Removing organization'
    },
    deleteOrganizationSuccess: {
        id: 'snack.delete.organizationSuccess',
        defaultMessage: 'Organization deleted'
    },
    removeOrganizationSuccess: {
        id: 'snack.remove.organizationSuccess',
        defaultMessage: 'Organization removed'
    },
    deleteGroup: {
        id: 'snack.delete.group',
        defaultMessage: 'Deleting group'
    },
    removeGroup: {
        id: 'snack.remove.group',
        defaultMessage: 'Removing group'
    },
    deleteGroupSuccess: {
        id: 'snack.delete.groupSuccess',
        defaultMessage: 'Group deleted'
    },
    removeGroupSuccess: {
        id: 'snack.remove.groupSuccess',
        defaultMessage: 'Group removed'
    },
    removeUser: {
        id: 'snack.remove.user',
        defaultMessage: 'Removing user'
    },
    removeUserSuccess: {
        id: 'snack.remove.userSuccess',
        defaultMessage: 'User removed'
    },
    snackError: {
        id: 'snack.error',
        defaultMessage: 'Something went wrong'
    },
    assigningRequest: {
        id: 'snack.label.assigningRequest',
        defaultMessage: 'Assigning new request'
    },
    assigningRequestSuccess: {
        id: 'snack.label.assigningRequestSuccess',
        defaultMessage: 'New request assigned'
    },
    assigningCertificate: {
        id: 'snack.label.assigningCertificate',
        defaultMessage: 'Assigning new certificate request'
    },
    assigningCertificateSuccess: {
        id: 'snack.label.assigningCertificateSuccess',
        defaultMessage: 'New certificate request assigned'
    },
    assigningTask: {
        id: 'snack.label.assigningTask',
        defaultMessage: 'Assigning new task'
    },
    assigningTaskSuccess: {
        id: 'snack.label.assigningTaskSuccess',
        defaultMessage: 'New task assigned'
    },
    maxSizeUploadLimit: {
        id: 'error.max_size',
        defaultMessage: 'Max size is 200MB'
    },
    submitting: {
        id: 'message.label.submitting',
        defaultMessage: 'Submitting'
    },
    noPageAccessTitle: {
        id: 'error.access.pageTitle',
        defaultMessage: 'Page access'
    },
    noPageAccess: {
        id: 'error.access.pageMessage',
        defaultMessage:
            'It seems you do not have access to this page. Please check with your administrator if you require access'
    },
    noDocumentsFound: {
        id: 'error.access.noDocumentsMessage',
        defaultMessage:
            'It seems that the document does not exist. Please check with your administrator'
    },
    roles: {
        id: 'label.groups.roles',
        defaultMessage: 'roles'
    },
    whatToDoFirst: {
        id: 'dashboard.intro.what_to_do',
        defaultMessage: 'What do you want to do first?'
    },
    helloUser: {
        id: 'dashboard.intro.hello',
        defaultMessage: 'Hello {firstName}'
    },
    uploadFailed: {
        id: 'error.upload.failed',
        defaultMessage: 'Failed to upload: {filename}'
    },
    submittedComment: {
        id: 'snack.label.addingComment',
        defaultMessage: 'Comment submitted'
    },
    submittingComment: {
        id: 'snack.label.submittingComment',
        defaultMessage: 'Submitting comment'
    },
    noActionsAvailable: {
        id: 'menu.label.noActionsAvailable',
        defaultMessage: 'No actions available'
    },
    permissionsUpdating: {
        id: 'snackbar.message.permissionsUpdating',
        defaultMessage: 'Updating permissions'
    },
    permissionsUpdated: {
        id: 'snackbar.message.permissionsUpdated',
        defaultMessage: 'Permissions updated'
    },
    beforeCurrentTime: {
        id: 'error.message.beforeCurrentTime',
        defaultMessage: 'Date selected is before current date/time'
    },
    shareXItems: {
        id: 'dialog.title.shareXItems',
        defaultMessage: 'Share {value} items'
    },
    disclaimer: {
        id: 'messages.disclaimer',
        defaultMessage: 'By signing in, you are continuing to agree with our'
    },
    and: {
        id: 'messages.and',
        defaultMessage: 'and'
    },
    termsOfUse: {
        id: 'messages.terms_of_use',
        defaultMessage: 'terms of use'
    },
    privacyPolicy: {
        id: 'messages.privacy_policy',
        defaultMessage: 'privacy policy'
    },
    copyWrite: {
        id: 'messages.copy_write',
        defaultMessage: 'Greenfence 2020. All rights reserved.'
    },
    fileFolderNameExists: {
        id: 'label.server.error.fileFolderNameExists',
        defaultMessage: 'Folder already exists: {value}'
    },
    quickAccess: {
        id: 'messages.quickAccess',
        defaultMessage: 'Quick Access'
    },
    uploadingFiles: {
        id: 'snack.label.uploadingFiles',
        defaultMessage: 'Uploading Files'
    },
    term: {
        id: 'form.filter.term',
        defaultMessage: 'Term'
    },
    filterTaskTitle: {
        id: 'filter.task.title',
        defaultMessage: 'Title'
    },
    filterUser: {
        id: 'filter.user.term',
        defaultMessage: 'User details'
    },
    filterRepo: {
        id: 'filter.repo.term',
        defaultMessage: 'File/folder term'
    },
    filterRepoPlaceholder: {
        id: 'filter.repo.placeholder',
        defaultMessage: 'Name, description, or text...'
    },
    termLengthInvalid: {
        id: 'form.filter.validate.term',
        defaultMessage: 'Term has to be longer than 3 charaters'
    },
    filterUserDetailPlaceholder: {
        id: 'filter.user.placeholder',
        defaultMessage: 'Name, username, email...'
    },
    filterReportTitle: {
        id: 'filter.report.title',
        defaultMessage: 'Document name'
    },
    filterReportTitlePlaceholder: {
        id: 'filter.report.title.placeholder',
        defaultMessage: 'File name...'
    },
    orgProfilePage: {
        id: 'page.header.orgProfilePage',
        defaultMessage: 'Organization Profile'
    },
    about: {
        id: 'header.about',
        defaultMessage: 'About'
    },
    contact: {
        id: 'header.contact',
        defaultMessage: 'Contact'
    },
    social: {
        id: 'header.social',
        defaultMessage: 'Social'
    },
    tag: {
        id: 'input.label.tag',
        defaultMessage: 'Tag'
    },
    publicVisibility: {
        id: 'input.label.publicVisibility',
        defaultMessage: 'Public visibility'
    },
    messageProfileSucess: {
        id: 'form.message.messageProfileSucess',
        defaultMessage: 'Profile saved'
    },
    messageProfileError: {
        id: 'form.message.messageProfileError',
        defaultMessage: 'Error saving profile'
    },
    directPermissions: {
        id: 'title.direct_permissions',
        defaultMessage: 'Direct permissions'
    },
    orgProfilePage: {
        id: 'page.header.orgProfilePage',
        defaultMessage: 'Organization Profile'
    },
    about: {
        id: 'header.about',
        defaultMessage: 'About'
    },
    contact: {
        id: 'header.contact',
        defaultMessage: 'Contact'
    },
    social: {
        id: 'header.social',
        defaultMessage: 'Social'
    },
    tag: {
        id: 'input.label.tag',
        defaultMessage: 'Tag'
    },
    publicVisibility: {
        id: 'input.label.publicVisibility',
        defaultMessage: 'Public visibility'
    },
    messageProfileSucess: {
        id: 'form.message.messageProfileSucess',
        defaultMessage: 'Profile saved'
    },
    messageProfileError: {
        id: 'form.message.messageProfileError',
        defaultMessage: 'Error saving profile'
    },
    filterByName: {
        id: 'filter.by_name',
        defaultMessage: 'Filter by name'
    },
    inheritedRoles: {
        id: 'menu.roles.inhertited',
        defaultMessage: '{value} (Inherited)'
    },
    jobTitleAt: {
        id: 'label.header.jobOrgRelation',
        defaultMessage: '{jobTitle} at '
    },
    invalidFilename: {
        id: 'error.message.invalidFilename',
        defaultMessage: 'Cannot have special characters in name'
    },
    invalidFileEndChar: {
        id: 'error.messages.invalidFilenameEndChar',
        defaultMessage: "Cannot end with a '  .  ' character"
    },
    invalidUrl: {
        id: 'error.message.invalidURL',
        defaultMessage: 'Invalid URL'
    },
    organizationProfile: {
        id: 'title.org_profile',
        defaultMessage: 'Organization Profile'
    },
    invalidEmail: {
        id: 'errors.invalidEmail',
        defaultMessage: 'Invalid email'
    },
    errorTask: {
        id: 'label.error.errorTask',
        defaultMessage: 'Task Errors'
    },
    documentDoesNotExist: {
        id: 'label.documentDoesNotExist',
        defaultMessage: 'Document does not exist'
    }
});

export default messages;
