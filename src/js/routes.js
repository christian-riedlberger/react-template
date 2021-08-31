// @flow
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';
import NoAccessPage from 'page/NoAccessPage';
import MissingPage from 'page/MissingPage';
import SignInPage from 'page/SignInPage';
import PlayPage from 'page/PlayPage';
import UserFormPage from 'page/UserFormPage';
import RequestsPage from 'page/RequestsPage';
import StylePage from 'page/StylePage';
import DocumentsPage from 'page/DocumentsPage';
import DocumentDetailsPage from 'page/DocumentDetailsPage';
import TaskDetailsPage from 'page/TaskDetailsPage';
import WorkflowDetailsPage from 'page/WorkflowDetailsPage';
import RequestsFormPage from 'page/RequestsFormPage';
import SelfOnboardingPage from 'page/SelfOnboardingPage';
import UnverifiedPage from 'page/UnverifiedPage';
import ErrorBoundary from 'error/ErrorBoundary';
import DashboardPage from 'page/DashboardPage';
import RequestSelectPage from 'page/RequestsSelectPage';
import UserPublicPage from 'page/UserPublicPage';
import OrganizationProfilePage from 'page/OrganizationProfilePage';
import OrganizationProfileEditPage from 'page/OrganizationProfileEditPage';
import PeoplePage from 'page/PeoplePage';

function errorHandling(Component, customProps) {
    return (props: Object) => {
        if (process.env.NODE_ENV === 'development') {
            return <Component {...props} {...customProps} />;
        }

        return (
            <ErrorBoundary>
                <Component {...props} {...customProps} />
            </ErrorBoundary>
        );
    };
}

/**
 *  Define URL > Component mapping
 *  See (components/page/<page>/<page>Index.js) for page components
 */
export default (
    <BrowserRouter>
        <Switch>
            <Route
                path="/self-onboarding"
                component={errorHandling(SelfOnboardingPage)}
            />

            <Route
                path="/unverified"
                component={errorHandling(UnverifiedPage)}
            />

            <Route path="/" component={SignInPage}>
                <IndexRedirect to="/dashboard" />

                <Route
                    path="/noaccess"
                    component={errorHandling(NoAccessPage)}
                />

                <Route
                    path="/dashboard"
                    component={errorHandling(DashboardPage)}
                />
                <Route
                    path="/documents"
                    component={errorHandling(DocumentsPage)}
                />
                <Route
                    path="/documents/details/:documentId"
                    component={errorHandling(DocumentDetailsPage)}
                />

                <Route
                    path="/task/details/:taskId"
                    component={errorHandling(TaskDetailsPage)}
                />

                <Route
                    path="/workflow/details/:workflowId"
                    component={errorHandling(WorkflowDetailsPage)}
                />
                <Route
                    path="/people/users"
                    component={errorHandling(PeoplePage, { startIndex: 0 })}
                />
                <Route
                    path="/people/users/:user"
                    component={errorHandling(UserPublicPage)}
                />
                <Route
                    path="/people/groups"
                    component={errorHandling(PeoplePage, { startIndex: 1 })}
                />
                <Route
                    path="/people/edit/:user"
                    component={errorHandling(UserFormPage)}
                />
                <Route
                    path="/people/new"
                    component={errorHandling(UserFormPage)}
                />
                <Route
                    path="/requests/received"
                    component={errorHandling(RequestsPage, { startIndex: 0 })}
                />
                <Route
                    path="/requests/issued"
                    component={errorHandling(RequestsPage, { startIndex: 1 })}
                />
                <Route
                    path="/requests/reports"
                    component={errorHandling(RequestsPage, { startIndex: 2 })}
                />
                <Route path="/play" component={errorHandling(PlayPage)} />
                <Route path="/styles" component={errorHandling(StylePage)} />
                <Route
                    path="/requests/drafts/start"
                    component={errorHandling(RequestSelectPage)}
                />
                <Route
                    path="/requests/drafts/edit"
                    component={errorHandling(RequestsFormPage)}
                />
                <Route
                    path="/self-onboarding"
                    component={errorHandling(SelfOnboardingPage)}
                />

                <Route
                    path="/organizations/profile/:orgId"
                    component={errorHandling(OrganizationProfilePage)}
                />
                <Route
                    path="/organizations/edit/:orgId"
                    component={errorHandling(OrganizationProfileEditPage)}
                />

                <Route path="*" component={MissingPage} />
            </Route>
        </Switch>
    </BrowserRouter>
);
