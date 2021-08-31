/**
 *  Get locale from browser or local storage pref
 */
export function getLocale() {
    const language =
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;

    // Override if locale pref changed
    const lsLocale = localStorage.getItem('board:locale');
    const lsLang = localStorage.getItem('board:lang');

    if (!lsLocale || lsLocale !== language) {
        localStorage.setItem('board:lang', language);
        localStorage.setItem('board:locale', language);
    }

    return lsLang || language;
}

export function other() {}
