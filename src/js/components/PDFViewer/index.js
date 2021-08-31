// @flow
import React, { Component } from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

import { withStyles } from '@material-ui/core/styles';
import { DEBOUNCE_DELAY } from 'constants/Config';
import localizations from './LocalizationMap';

type DefaultProps = {
    classes: Object
} & VersionProps;

type Props = {
    src: string
} & DefaultProps;

type State = {
    src: string,
    open: boolean,
    anchor: null | HTMLElement
};

const styles = {
    root: {},
    button: {},
    viewer: {
        textAlign: 'center',
        height: '750px'
    },
    toolbar: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    toolbarLeft: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start'
    },
    toolbarCenter: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    },
    toolbarRight: {
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-end'
    },
    toolbarItem: {
        padding: '0 2px'
    }
};

@withStyles(styles)
class PDFViewer extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            src: '',
            open: false,
            anchor: null
        };
    }

    componentDidMount() {
        this.resetPdf();
    }

    componentDidUpdate(prevProps: Object) {
        const { src } = this.props;
        if (prevProps.src !== src) {
            this.resetPdf();
        }
    }

    resetPdf = () => {
        const { src } = this.props;
        this.setState({ src: '' }, () => {
            setTimeout(() => {
                this.setState({ src });
            }, DEBOUNCE_DELAY);
        });
    };

    handleOpen = event => {
        this.setState({
            ...this.state,
            open: true,
            anchor: event.currentTarget
        });
    };

    handleClose = () => {
        this.setState({
            ...this.state,
            open: false,
            anchor: null
        });
    };

    render() {
        const { src, classes } = this.props;

        if (!src) return null;

        return (
            <React.Fragment>
                <Worker workerUrl="/js/third-party/viewer/pdf.worker.min.js">
                    <div className={classes.viewer}>
                        <Viewer
                            fileUrl={`${src}&c=${new Date().getTime()}`}
                            localization={localizations}
                        />
                    </div>
                </Worker>
            </React.Fragment>
        );
    }
}

export default PDFViewer;
