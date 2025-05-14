import { FaWindowClose } from 'react-icons/fa';
import styled from 'styled-components';

interface CloseButtonProps {
  onClick: () => void;
}

export default function CloseButton(props: CloseButtonProps) {
  const { onClick } = props;

  const handleClick = () => onClick && onClick();

  return (
    <StyledCloseButton onClick={handleClick}>
      <FaWindowClose size={'1.2em'} />
    </StyledCloseButton>
  );
}

const StyledCloseButton = styled.button`
  filter: drop-shadow(4px 4px 3px black);
  color: ${({ theme }) => theme.color.b};
`;
