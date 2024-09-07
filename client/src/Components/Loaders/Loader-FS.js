import React from "react";
import styled, { keyframes } from "styled-components";

const loaderAnimation = keyframes`
    0%,
    100% {
        animation-timing-function: cubic-bezier(0.45, 0, 0.9, 0.55);
    }
    0% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(0, 128px);
        animation-timing-function: cubic-bezier(0, 0.45, 0.55, 0.9);
    }
    100% {
        transform: translate(0, 0);
    }
`;

const LoaderContainer = styled.div`
    width: 7rem;
    height: 2.5rem;
    display: inline-block;
    overflow: hidden;
    background: transparent;
`;

const LoaderDiv = styled.div`
    .loader-circle {
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #0073cd;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: ${loaderAnimation} 1s linear infinite;
    }
`;

export default function Loader() {
    return (
        <div
            className="flex flex-row justify-center items-center h-full w-full bg-[rgba(255,255,255,0.6)] backdrop-blur-[1px] absolute top-0 left-0"
            style={{ zIndex: 9999 }} // Establezca un zIndex más alto para colocar el cargador por encima de otro contenido
        >
            <LoaderContainer>
                <LoaderDiv>
                    <div className="loader-circle"></div>
                </LoaderDiv>
            </LoaderContainer>
        </div>
    );
}
