/* eslint-disable import/extensions */
import 'babel-polyfill';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { SnackbarProvider } from 'notistack';

import en from 'react-intl/locale-data/en';
import nl from 'react-intl/locale-data/nl';
import pt from 'react-intl/locale-data/pt';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';
import ar from 'react-intl/locale-data/ar';
import zh from 'react-intl/locale-data/zh';
import ko from 'react-intl/locale-data/ko';
import ja from 'react-intl/locale-data/ja';

import { Provider } from 'react-redux';
import { ENABLE_WHY_DID_YOURENDER } from 'constants/Config';

import { Router, browserHistory } from 'react-router';
import whyDidYouRender from '@welldone-software/why-did-you-render';

// Importing styles, so webpack can see them
// eslint-disable-next-line no-unused-vars
import { animateCss } from 'animate.css/animate.css';
// $FlowFixMe
import { siteStyles } from '../css/base.scss'; // eslint-disable-line no-unused-vars
import routes from './routes';
import store from './store';
import rollbarConfig from '../config/rollbar.json';

import enTranslations from './localizations/en.json';
import nlTranslations from './localizations/nl.json';
import ptTranslations from './localizations/pt.json';
import esTranslations from './localizations/es.json';
import frTranslations from './localizations/fr.json';
import deTranslations from './localizations/de.json';
import itTranslations from './localizations/it.json';
import arTranslations from './localizations/ar.json';
import zhTranslations from './localizations/zh.json';
import koTranslations from './localizations/ko.json';
import jaTranslations from './localizations/ja.json';

addLocaleData([
    ...en,
    ...nl,
    ...pt,
    ...es,
    ...fr,
    ...de,
    ...it,
    ...ar,
    ...zh,
    ...ko,
    ...ja
]);
const language =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;
let detectedLocale = language.toLowerCase().split(/[_-]+/)[0];
const messages = {};
let translations;
switch (detectedLocale) {
    case 'en':
        translations = enTranslations;
        break;
    case 'nl':
        translations = nlTranslations;
        break;
    case 'pt':
        translations = ptTranslations;
        break;
    case 'es':
        translations = esTranslations;
        break;
    case 'fr':
        translations = frTranslations;
        break;
    case 'de':
        translations = deTranslations;
        break;
    case 'it':
        translations = itTranslations;
        break;
    case 'ar':
        translations = arTranslations;
        break;
    case 'zh':
        translations = zhTranslations;
        break;
    case 'ko':
        translations = koTranslations;
        break;
    case 'js':
        translations = jaTranslations;
        break;

    default:
        detectedLocale = 'en';
        translations = enTranslations;
        break;
}

_.forOwn(translations, (value, key) => {
    messages[key] = value.text;
});

if (process.env.NODE_ENV !== 'development') {
    // eslint-disable-next-line
    window._rollbarConfig = {
        accessToken: rollbarConfig.ROLLBAR_CLIENT,
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: {
            environment: window.location.host.split('.')[0],
            client: {
                javascript: {
                    code_version: process.env.CI_COMMIT_SHA || 'development',
                    guess_uncaught_frames: true
                }
            }
        }
    };
    // eslint-disable-next-line
    require('./third-party/rollbar/lib.min');
}

if (ENABLE_WHY_DID_YOURENDER && process.env.NODE_ENV === 'development') {
    whyDidYouRender(React, {
        trackAllPureComponents: true,
        exclude: [/^AccountCircleIcon/, /^GroupIcon/]
    });
}

/**
 *   Initialize application
 *   and URL routing options
 */
ReactDOM.render(
    <IntlProvider locale={detectedLocale} messages={messages}>
        <Provider store={store}>
            <SnackbarProvider maxSnack={1}>
                <Router history={browserHistory} routes={routes} />
            </SnackbarProvider>
        </Provider>
    </IntlProvider>,
    document.getElementById('app')
);
