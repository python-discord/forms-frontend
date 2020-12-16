import { css } from "@emotion/react";

import colors from "./colors";

export default css`
@import url('https://fonts.googleapis.com/css2?family=Hind:wght@700&display=swap');

@font-face {
    font-family: 'Uni Sans';
    src: url(/fonts/unisans.otf) format('opentype');
}

body {
    background-color: ${colors.notQuiteBlack};
    color: white;
    font-family: "Hind", "Helvetica", "Arial", sans-serif;
    margin: 0;
}

.fade-enter,
.fade-exit {
    position: absolute;
    top: 0;
    left: 0;
    transition: 300ms ease-in-out opacity, 300ms ease-in-out transform;
    width: 100%;
}

.fade-enter,
.fade-exit-active {
    opacity: 0;
    transform: scale(0.98);
}

.fade-enter-active {
    opacity: 1;
    z-index: 1;
    transform: scale(1);
}
`;
