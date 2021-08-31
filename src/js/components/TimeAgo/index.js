// @flow
import React from 'react';
import TimeAgo from 'react-timeago';
import { getLocale } from 'utils/locale';
import frString from 'react-timeago/lib/language-strings/fr';
import nlString from 'react-timeago/lib/language-strings/nl';
import enString from 'react-timeago/lib/language-strings/en';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

type Props = {
    date: Date
};

const Title = ({ date }: Props) => {
    let lang;
    const locale = getLocale();
    switch (locale) {
        case 'nl':
            lang = nlString;
            break;
        case 'fr':
            lang = frString;
            break;
        default:
            lang = enString;
    }

    const formatter = buildFormatter(lang);

    return <TimeAgo date={date} formatter={formatter} />;
};

export default Title;
