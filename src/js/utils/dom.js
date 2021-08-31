const mouseClickEvents = ['mousedown', 'click', 'mouseup'];

// eslint-disable-next-line import/prefer-default-export
export const globalCloseDrawer = () => {
    const element = document.querySelector('.MuiBackdrop-root');
    mouseClickEvents.forEach(mouseEventType =>
        element.dispatchEvent(
            new MouseEvent(mouseEventType, {
                view: window,
                bubbles: true,
                cancelable: true,
                buttons: 1
            })
        )
    );
};
