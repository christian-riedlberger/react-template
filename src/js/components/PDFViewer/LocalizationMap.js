// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';

const localizations = {
    askingPassword: {
        requirePasswordToOpen: (
            <FormattedMessage {...messages.pdfRequirePasswordToOpen} />
        ),
        submit: <FormattedMessage {...messages.pdfSubmit} />
    },
    attachment: {
        clickToDownload: <FormattedMessage {...messages.pdfClickToDownload} />,
        noAttachment: <FormattedMessage {...messages.pdfNoAttachment} />
    },
    bookmark: {
        noBookmark: <FormattedMessage {...messages.pdfNoBookmark} />
    },
    main: {
        dragDropFile: <FormattedMessage {...messages.pdfDragDropFile} />
    },
    goToFirstPage: <FormattedMessage {...messages.pdfGoToFirstPage} />,
    goToLastPage: <FormattedMessage {...messages.pdfGoToLastPage} />,
    handTool: <FormattedMessage {...messages.pdfHandTool} />,
    horizontalScrolling: (
        <FormattedMessage {...messages.pdfHorizontalScrolling} />
    ),
    rotateBackward: <FormattedMessage {...messages.pdfRotateBackward} />,
    rotateForward: <FormattedMessage {...messages.pdfRotateForward} />,
    textSelectionTool: (
        <FormattedMessage {...messages.pdfTextSelectionTool} />
    ),
    verticalScrolling: (
        <FormattedMessage {...messages.pdfVerticalScrolling} />
    ),
    wrappedScrolling: <FormattedMessage {...messages.pdfWrappedScrolling} />,
    search: {
        close: <FormattedMessage {...messages.pdfClose} />,
        enterToSearch: '', // <FormattedMessage {...messages.pdfEnterToSearch} />, Broken -> displays [Object] Object
        matchCase: <FormattedMessage {...messages.pdfMatchCase} />,
        nextMatch: <FormattedMessage {...messages.pdfNextMatch} />,
        previousMatch: <FormattedMessage {...messages.pdfPreviousMatch} />,
        wholeWords: <FormattedMessage {...messages.pdfWholeWords} />
    },
    sidebar: {
        attachment: <FormattedMessage {...messages.pdfAttachment} />,
        bookmark: <FormattedMessage {...messages.pdfBookmark} />,
        thumbnail: <FormattedMessage {...messages.pdfThumbnail} />
    },
    toolbar: {
        download: <FormattedMessage {...messages.pdfDownload} />,
        fullScreen: <FormattedMessage {...messages.pdfFullscreen} />,
        moreActions: <FormattedMessage {...messages.pdfMoreActions} />,
        nextPage: <FormattedMessage {...messages.pdfNextPage} />,
        openFile: <FormattedMessage {...messages.pdfOpenFile} />,
        previousPage: <FormattedMessage {...messages.pdfPreviousPage} />,
        search: <FormattedMessage {...messages.pdfSearch} />,
        toggleSidebar: <FormattedMessage {...messages.pdfToggleSidebar} />,
        zoomIn: <FormattedMessage {...messages.pdfZoomIn} />,
        zoomOut: <FormattedMessage {...messages.pdfZoomOut} />,
        // Start of what should be in moreActions
        documentProperties: (
            <FormattedMessage {...messages.pdfDocumentProperties} />
        ),
        goToFirstPage: <FormattedMessage {...messages.pdfGoToFirstPage} />,
        goToLastPage: <FormattedMessage {...messages.pdfGoToLastPage} />,
        handTool: <FormattedMessage {...messages.pdfHandTool} />,
        horizontalScrolling: (
            <FormattedMessage {...messages.pdfHorizontalScrolling} />
        ),
        rotateBackward: <FormattedMessage {...messages.pdfRotateBackward} />,
        rotateForward: <FormattedMessage {...messages.pdfRotateForward} />,
        textSelectionTool: (
            <FormattedMessage {...messages.pdfTextSelectionTool} />
        ),
        verticalScrolling: (
            <FormattedMessage {...messages.pdfVerticalScrolling} />
        ),
        wrappedScrolling: <FormattedMessage {...messages.pdfWrappedScrolling} />
    },
    wrongPassword: {
        submit: <FormattedMessage {...messages.pdfSubmit} />,
        tryAgain: <FormattedMessage {...messages.pdfTryAgain} />
    },
    zoom: {
        actualSize: <FormattedMessage {...messages.pdfActualSize} />,
        pageFit: <FormattedMessage {...messages.pdfPageFit} />,
        pageWidth: <FormattedMessage {...messages.pdfPageWidth} />
    }
};

export default localizations;
