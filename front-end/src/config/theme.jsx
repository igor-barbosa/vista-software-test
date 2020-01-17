import {createMuiTheme} from "@material-ui/core";

export const MaterialUiDefaultTheme = createMuiTheme({
    props: {
        MuiTextField: {
            variant: "outlined",
            fullWidth: true,
            size: 'small'
        }
    },
    overrides: {
        MuiFormHelperText: {
            contained: {
                margin: '4px 2px 0px',
                position: 'absolute',
                bottom: '-15px'
            }
        }
    }
});