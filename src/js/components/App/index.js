// @flow
import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Snackbar from 'components/Snackbar';
import muiTheme from 'constants/muiTheme';

type DefaultProps = {};

type Props = {
    children: any
} & DefaultProps;

const theme = createMuiTheme(muiTheme);

function App(props: Props) {
    const { children } = props;

    return (
        <div className="App">
            <Snackbar />
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </div>
    );
}

export default App;
