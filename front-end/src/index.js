import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './pages/routes';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { MaterialUiDefaultTheme } from './config/theme';
import { SnackbarProvider } from 'notistack';



ReactDOM.render(
    <ThemeProvider theme={MaterialUiDefaultTheme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
            <Routes />
        </SnackbarProvider>
    </ThemeProvider>, 
    document.getElementById('root')
);