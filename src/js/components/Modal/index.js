// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

type Props = {
    isopen?: boolean,
    title?: string | null,
    className?: string,
    description?: string | null,
    children: Object,
    size?: string | null,
    top?: string | null,
    style?: Object | null,
    onOpen?: Function,
    onClose?: Function
};

type State = {
    open: boolean,
    top: string | number,
    contentHeight: number
};

/**
 * @container Global
 * @component Modal
 * @desc Global modal window
 * @param props
 * @return {JSX}
 */
export default class Modal extends Component<Props, State> {
    body: HTMLDivElement;

    timer: any;

    props: Props;

    el: Object;

    static defaultProps = {
        isopen: false,
        size: null,
        title: null,
        description: null,
        top: null,
        style: null,
        className: '',
        onOpen: () => {},
        onClose: () => {}
    };

    constructor(props: Props) {
        super(props);

        this.el = document.createElement('div');
        this.el.classList.add('portal-modal');

        this.state = {
            open: !!props.isopen,
            top: '150%',
            contentHeight: 0
        };
    }

    componentDidMount() {
        // $FlowFixMe
        document.getElementById('app').appendChild(this.el);
    }

    componentDidUpdate() {
        if (!this.state.open) {
            this.stopHeightMonitoring();
        }
    }

    componentWillUnmount() {
        // $FlowFixMe
        document.getElementById('app').removeChild(this.el);
    }

    /**
     *  Close modal
     */
    close = () => {
        if (this.props.onClose) this.props.onClose();
        this.setState({ open: false });
    };

    /**
     *  Open modal window
     *  @todo modal overflow viewport
     */
    open = () => {
        if (this.props.onOpen) this.props.onOpen();
        this.setState({ open: true });
        this.monitorHeight();
    };

    monitorHeight() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                this.checkContentHeight();
            }, 300);
        }
    }

    stopHeightMonitoring() {
        clearInterval(this.timer);
        this.timer = null;
    }

    checkContentHeight() {
        const { open, contentHeight } = this.state;

        if (!this.body) return;

        if (open && Math.abs(this.body.offsetHeight - contentHeight) > 1) {
            const top = this.calculateTop();
            this.setState({ top, contentHeight: this.body.offsetHeight });
        }
    }

    calculateTop() {
        return Math.ceil(window.innerHeight / 2 - this.body.offsetHeight / 2);
    }

    /**
     * Render component
     * @return {JSX}
     */
    renderModal = () => {
        const { title, description, size, top, style, className } = this.props;
        const { open } = this.state;

        const modalKlass = className || '';
        const sizeClass = size || '';
        const activeClass = open ? 'modal-active' : '';
        const animate = open ? 'animated bounceIn' : '';
        const contentElement =
            open && this.props.children
                ? React.cloneElement(this.props.children, {
                    onCancel: this.close
                })
                : null;

        return (
            <div className={activeClass}>
                <div role="presentation" className="overlay" onClick={this.close} />
                <div className={`modal ${modalKlass}`}>
                    <div
                        className={`modal-body ${animate} ${sizeClass}`}
                        style={{ top: top || this.state.top, ...style }}
                        ref={c => {
                            if (c) this.body = c;
                        }}
                    >
                        <a
                            role="presentation"
                            onClick={this.close}
                            className="modal-close"
                        >
                            x
                        </a>
                        {title && <h1>{title}</h1>}
                        {description && <p>{description}</p>}
                        {contentElement}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return ReactDOM.createPortal(this.renderModal(), this.el);
    }
}
