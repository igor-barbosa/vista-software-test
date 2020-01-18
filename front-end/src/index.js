import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './pages/routes';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { Provider as ReduxProvider } from 'react-redux'
import { MaterialUiDefaultTheme } from './config/theme';
import { store } from './config/store';


ReactDOM.render(
    <ThemeProvider theme={MaterialUiDefaultTheme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
            <ReduxProvider store={store}>
                <Routes />
            </ReduxProvider>
        </SnackbarProvider>
    </ThemeProvider>, 
    document.getElementById('root')
);