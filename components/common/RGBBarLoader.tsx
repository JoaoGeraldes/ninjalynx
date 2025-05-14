import styled, { css } from 'styled-components';

interface RGBBarLoaderProps {
  /** whether to place the rgb bar at the absolute top or bottom of the parent element - This assumes the parent element has relative position. */
  $positioning: 'absoluteTop' | 'absoluteBottom';
}

export const RGBBarLoader = styled.div<RGBBarLoaderProps>`
  ${({ $positioning }) => {
    switch ($positioning) {
      case 'absoluteBottom':
        return css`
          bottom: 0;
        `;

      case 'absoluteTop':
        return css`
          top: 0;
        `;

      default:
        return css`
          bottom: 0;
        `;
    }
  }}
  position: absolute;
  left: 0;
  height: 8px;
  width: 100%;
  z-index: 2;
  background: linear-gradient(90deg, red, blue, green);
  background-size: 300% 300%;
  animation: rgbAnimation 3s infinite linear, fadeIn 1s ease-out forwards;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);

  /* Fading edges */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    white 20%,
    white 80%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    white 20%,
    white 80%,
    transparent
  );

  @keyframes rgbAnimation {
    0% {
      background-position: 0% 50%;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    }
    50% {
      background-position: 100% 50%;
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }
    100% {
      background-position: 0% 50%;
      box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
    }
  }

  /* Fade-in Animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
