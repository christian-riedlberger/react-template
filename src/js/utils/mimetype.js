// @flow
import _ from 'lodash';

export const MIMETYPE_SUPPORT = [
    {
        mimetype: 'application/eps',
        extension: 'eps',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'application/illustrator',
        extension: 'ai',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/msword',
        extension: 'doc',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/pdf',
        extension: 'pdf',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/rtf',
        extension: 'rtf',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.apple.keynote',
        extension: 'key',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.apple.numbers',
        extension: 'numbers',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.apple.pages',
        extension: 'pages',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-excel',
        extension: 'xls',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-excel.addin.macroenabled.12',
        extension: 'xlam',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
        extension: 'xlsb',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-excel.sheet.macroenabled.12',
        extension: 'xlsm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-excel.template.macroenabled.12',
        extension: 'xltm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-outlook',
        extension: 'msg',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-powerpoint',
        extension: 'ppt',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-powerpoint.addin.macroenabled.12',
        extension: 'ppam',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-powerpoint.presentation.macroenabled.12',
        extension: 'pptm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-powerpoint.slide.macroenabled.12',
        extension: 'sldm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
        extension: 'ppsm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-powerpoint.template.macroenabled.12',
        extension: 'potm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-word.document.macroenabled.12',
        extension: 'docm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.ms-word.template.macroenabled.12',
        extension: 'dotm',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.oasis.opendocument.presentation',
        extension: 'odp',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.oasis.opendocument.presentation-template',
        extension: 'otp',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.oasis.opendocument.spreadsheet',
        extension: 'ods',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.oasis.opendocument.spreadsheet-template',
        extension: 'ots',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.oasis.opendocument.text',
        extension: 'odt',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.oasis.opendocument.text-template',
        extension: 'ott',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        extension: 'pptx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.presentationml.slide',
        extension: 'sldx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        extension: 'ppsx',
        preview: false,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.presentationml.template',
        extension: 'potx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        extension: 'xltx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: 'docx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        extension: 'dotx',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.sun.xml.calc',
        extension: 'sxc',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.sun.xml.calc.template',
        extension: 'stc',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.sun.xml.impress',
        extension: 'sxi',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.sun.xml.impress.template',
        extension: 'sti',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.sun.xml.writer',
        extension: 'sxw',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.sun.xml.writer.template',
        extension: 'stw',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/vnd.visio',
        extension: 'vsd',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/wordperfect',
        extension: 'wpd',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'application/x-cpio',
        extension: 'cpio',
        preview: true,
        thumbnail: false
    },
    {
        mimetype: 'application/x-tar',
        extension: 'tar',
        preview: true,
        thumbnail: false
    },
    {
        mimetype: 'application/zip',
        extension: 'zip',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'image/bmp',
        extension: 'bmp',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/cgm',
        extension: 'cgm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/gif',
        extension: 'gif',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/ief',
        extension: 'ief',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/jp2',
        extension: 'jp2',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/jpeg',
        extension: 'jpg',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/png',
        extension: 'png',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/tiff',
        extension: 'tiff',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'image/vnd.adobe.photoshop',
        extension: 'psd',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/vnd.adobe.premiere',
        extension: 'ppj',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-cmu-raster',
        extension: 'ras',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-dwt',
        extension: 'dwt',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-portable-anymap',
        extension: 'pnm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-portable-bitmap',
        extension: 'pbm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-portable-graymap',
        extension: 'pgm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-portable-pixmap',
        extension: 'ppm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-adobe',
        extension: 'dng',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-canon',
        extension: 'cr2',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-fuji',
        extension: 'raf',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-hasselblad',
        extension: '3fr',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-kodak',
        extension: 'k25',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-leica',
        extension: 'rwl',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-minolta',
        extension: 'mrw',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-nikon',
        extension: 'nef',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-olympus',
        extension: 'orf',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-panasonic',
        extension: 'rw2',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-pentax',
        extension: 'pef',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-red',
        extension: 'r3d',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-sigma',
        extension: 'x3f',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-raw-sony',
        extension: 'arw',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-xbitmap',
        extension: 'xbm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-xpixmap',
        extension: 'xpm',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'image/x-xwindowdump',
        extension: 'xwd',
        preview: false,
        thumbnail: true
    },
    {
        mimetype: 'text/csv',
        extension: 'csv',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'text/html',
        extension: 'html',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'text/plain',
        extension: 'txt',
        preview: true,
        thumbnail: true
    },
    {
        mimetype: 'text/xml',
        extension: 'xml',
        preview: true,
        thumbnail: true
    }
];

/**
 * Get alpahet letter at given index
 *
 * @param {number} index
 * @author ben.vincent
 */
export function isPreviewable(mimetype: string) {
    // DOCUMENT_PREVIEW_API
    return !_.isEmpty(_.find(MIMETYPE_SUPPORT, { mimetype, preview: true }));
}

/**
 * Has got a thumbnail
 *
 * @param {number} index
 * @author ben.vincent
 */
export function hasThumbnail(mimetype: string) {
    return !_.isEmpty(_.find(MIMETYPE_SUPPORT, { mimetype, thumbnail: true }));
}
