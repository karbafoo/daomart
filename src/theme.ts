import {createTheme} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
    palette: {
        text: {
            primary: '#232826',
        },
        primary: {
            main: '#556cd6',
            dark: '#232323',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});

export default theme;
