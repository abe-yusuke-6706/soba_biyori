import "../css/app.css";
import "./bootstrap";

import { ChakraProvider } from "@chakra-ui/react";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
const appName = import.meta.env.VITE_APP_NAME || "Laravel";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme();

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider theme={theme}>
                <ChakraProvider>
                    <App {...props} />
                </ChakraProvider>
            </ThemeProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
