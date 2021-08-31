import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#00C771'
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#0066ff',
            main: '#0044ff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00'
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2
    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: '0.8em'
            }
        },
        // Style sheet name ⚛️
        MuiButton: {},
        MuiTableRow: {
            root: {
                '&$selected': {
                    backgroundColor: '#e9fdf3!important',

                    '& td': {
                        backgroundColor: '#e9fdf3!important'
                    }
                }
            }
        },
        MUIDataTable: {
            paperResponsiveScrollFullHeightFullWidth: {
                position: 'inherit'
            }
        },
        MUIDataTableBodyRow: {
            hoverCursor: {
                cursor: 'default!important'
            }
        },
        /**
         * GF-435 - re-add table checkbox when selected @bvincent1
         */
        // MUIDataTableSelectCell: {
        //     root: {
        //         display: 'none'
        //     }
        // },
        MUIDataTableToolbarSelect: {
            title: {
                display: 'none'
            }
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Open Sans',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(',')
    }
});

export default theme;
