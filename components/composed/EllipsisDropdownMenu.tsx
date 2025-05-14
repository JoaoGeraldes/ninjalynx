import { FaEllipsisVertical } from 'react-icons/fa6';
import Button from '../common/Button';
import { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

interface EllipsisDropdownMenuProps {
  menuItems: ReactNode[];
}

let openedMenus: React.Dispatch<React.SetStateAction<boolean>>[] = [];

export default function EllipsisDropdownMenu({
  menuItems,
}: EllipsisDropdownMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      // Close any previously opened menus
      if (!!openedMenus.length && openedMenus[0] !== setMenuOpen) {
        openedMenus[0](false);
        openedMenus = [];
      }
      openedMenus.push(setMenuOpen);
    }
  }, [menuOpen]);

  return (
    <StyledDropdownContainer
      onClick={(e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
      }}
    >
      <StyledButton $asText $menuOpen={menuOpen}>
        <FaEllipsisVertical size="1.5em" />
      </StyledButton>

      {menuOpen && (
        <div className="dropdown">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </StyledDropdownContainer>
  );
}

const StyledDropdownContainer = styled.div`
  .dropdown {
    position: absolute;
    right: 0;
    height: auto;
    background-color: ${({ theme }) => theme.color.j};
    z-index: 10;
    padding: 0.2em;
    border-radius: 4px;
    cursor: pointer;

    li {
      min-width: 100px;
      width: fit-content;
    }
  }
`;

const StyledButton = styled(Button)<{ $menuOpen?: boolean }>`
  svg {
    animation: ${({ $menuOpen }) =>
        $menuOpen ? 'openAnimation' : 'closeAnimation'}
      0.2s forwards;
  }

  @keyframes openAnimation {
    to {
      transform: rotate(90deg);
    }
  }

  @keyframes closeAnimation {
    from {
      transform: rotate(90deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;
