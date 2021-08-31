import messages from 'constants/Messages';

/**
 *  Replace default group names with intl
 */
export function getReservedOrgName(message, intl) {
    const reg = /intl:([^\s]+)/;
    const intlProp = reg.exec(message);

    if (!intlProp) return message;
    const property = camelize(intlProp[0].replace(':', ' '));

    return message.replace(intlProp[0], intl.formatMessage(messages[property]));
}

/**
 * String Utilities
 * @type {{camelize: string.camelize}}
 */
export function camelize(string) {
    // Remove non file name chars
    const str = string.replace(/[|&;'$%@"<>()+,]/g, '');

    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

export function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

export function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fileExtension(filename: string) {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(filename)[1];
}

/**
 * Get alpahet letter at given index
 *
 * @param {number} index
 * @author ben.vincent
 */
export function letterAt(index) {
    return String.fromCharCode(index + 65);
}

export function copyToClipboard(str: string) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

export const nameRegex = /[/\\?%*:|“<>]/;
