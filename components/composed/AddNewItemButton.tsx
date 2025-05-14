import styled, { css } from 'styled-components';
import Button from '../common/Button';
import useAppState from '@/hooks/useAppState';
import { BsBoxFill } from 'react-icons/bs';

interface AddNewItemButtonProps {
  onClick: () => void;
}

export default function AddNewItemButton({ onClick }: AddNewItemButtonProps) {
  const { state } = useAppState();

  const hasItems = !!state?.database?.length;

  return (
    <StyledButton
      $hasItems={hasItems}
      onClick={onClick}
      $rounded
      $width="54px"
      $height="54px"
    >
      <BsBoxFill size={'2em'} />
    </StyledButton>
  );
}

const StyledButton = styled(Button)<{ $hasItems?: boolean }>`
  position: fixed;
  bottom: 12px;
  right: 12px;

  ${({ $hasItems }) =>
    !$hasItems &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, #ffffff 5%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        animation: bubble-pulse 2s ease-out infinite;
        z-index: -1;
        pointer-events: none;
      }

      @keyframes bubble-pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.6;
        }
        70% {
          opacity: 0.2;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.6);
          opacity: 0;
        }
      }
    `}
`;
