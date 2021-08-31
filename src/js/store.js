// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { ALFRESCO_AUTH_OPTS } from 'constants/Config';
import AlfrescoApi from 'alfresco-js-api';
import reducer from './reducers';

// Instance to Alfresco API
const repository = new AlfrescoApi(ALFRESCO_AUTH_OPTS);

const developmentMode = applyMiddleware(
    // reduxImmutableStateInvariant(),
    promise(),
    thunk.withExtraArgument(repository),
    createLogger()
);

const productionMode = applyMiddleware(
    promise(),
    thunk.withExtraArgument(repository)
);

const middleware =
    process.env.NODE_ENV === 'production' ? productionMode : developmentMode;

/**
 *  Create application store with
 *  redux promise and optional logging
 */
/* eslint-disable no-underscore-dangle */
export default createStore(
    reducer /* preloadedState, */,
    compose(
        middleware,
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);
/* eslint-enable */
