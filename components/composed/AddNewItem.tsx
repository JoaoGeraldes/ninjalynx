import styled from 'styled-components';
import AddNewItemButton from './AddNewItemButton';

interface AddNewItemProps {
  onClick: () => void;
}

function AddNewItem({ onClick }: AddNewItemProps) {
  return (
    <>
      <AddNewItemButton onClick={onClick} />
    </>
  );
}

const TooltipWrapper = styled.div`
  position: fixed;
  bottom: 70px;
  right: 30px;
  animation: fadeOut 1s forwards;
  animation-delay: 3s;

  @keyframes fadeOut {
    to {
      opacity: 0;
    }
  }
`;

export default AddNewItem;
