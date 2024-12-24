// import '../css/app.css';
// import './bootstrap';
/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import emotionReset from "emotion-reset";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';



const global = css`
    @import url('https://fonts.googleapis.com/css2?family=Aldrich&family=Noto+Sans+JP:wght@100..900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    ${emotionReset}

    *,h1, h2, h3, h4, h5, h6, p, a, li, span, div, input, textarea {
        font-family: "Noto Sans JP";
    }
    button{
        transition: all 0.3s;
        :hover {
            opacity: 0.8;
        }
    }

`;


createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
            <Global styles={global} />
            <App {...props} />
            </>
    );
    },
    progress: {
        color: '#4B5563',
    },
});
