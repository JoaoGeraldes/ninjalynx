import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

interface WarnProps {
  icon: ReactNode;
  title: string;
  message: string | ReactNode;
  color?: 'red' | 'orange' | 'blue' | 'green';
}

export default function Warn({ icon, title, message, color }: WarnProps) {
  return (
    <StyledDiv $color={color}>
      <header>
        {icon} <strong> {title}</strong>
      </header>

      <div className="message">{message}</div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div<{ $color?: WarnProps['color'] }>`
  ${({ $color, theme }) => {
    switch ($color) {
      case 'red':
        return css`
          background: ${theme.color.h};
          color: ${theme.color.c};
        `;

      case 'orange':
        return css`
          background: ${theme.color.k + '47'};
          color: ${theme.color.k};
        `;

      case 'blue':
        return css`
          background: ${theme.color.i + '47'};
          color: ${theme.color.i};
        `;

      case 'green':
        return css`
          background: #00ffca;
          color: #004335;
        `;

      default:
        return css``;
    }
  }};

  width: 100%;
  padding: 1em;
  border-radius: 0.5em;

  header {
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    gap: 0.3em;
  }

  .message {
    margin-top: 8px;
  }
`;
