import styled, { DefaultTheme } from 'styled-components';

interface ButtonProps {
  $asText?: boolean;
  $color?: string | (({ theme }: { theme: DefaultTheme }) => string);
  $padding?: string;
  /** Whether the button is fully rounded (border-radius at 100%) or default  */
  $rounded?: boolean;
  $height?: string;
  $width?: string;
}

const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${({ theme, $asText }) => ($asText ? 'unset' : theme.color.i)};
  border-radius: ${({ $rounded }) => ($rounded ? '100%' : '4px')};
  color: ${({ $color, theme }) =>
    $color ? (typeof $color === 'string' ? $color : $color) : theme.color.c};

  width: ${({ $width }) => ($width ? $width : 'fit-content')};
  height: ${({ $height }) => ($height ? $height : 'fit-content')};
  padding: ${({ theme, $padding }) => ($padding ? $padding : theme.padding.a)};
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  justify-content: center;
  filter: ${(props) => (props.disabled ? 'saturate(0.3)' : 'initial')};
  box-shadow: ${({ $asText }) =>
    $asText
      ? 'none'
      : 'inset #ffffff57 0px 1px 0px 0px, 1px 1px 0px 0px #0000004f;'};

  &:hover {
    filter: ${({ $asText, disabled }) =>
      !$asText && !disabled && 'brightness(1.2)'};
    text-decoration: ${(props) => (props.$asText ? 'underline' : 'unset')};
    background: ${({ $asText, disabled }) => $asText && '#00000008'};
  }

  &:active {
    box-shadow: ${({ $asText }) =>
      $asText
        ? 'inset 1px 1px 0px 0px #00000017'
        : 'inset 1px 1px 0px 0px #141414cf'};
    backdrop-filter: contrast(0.9);
  }
`;

export default Button;
