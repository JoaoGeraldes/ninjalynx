import styled from 'styled-components';
import useAppState from '@/hooks/useAppState';
import SearchBar from './SearchBar';

import { Settings } from '@/types/types';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { LocalStorageManager } from '@/utils/LocalStorageManager';

interface HeaderProps {}

export default function Header(props: HeaderProps) {
  const { state, dispatch } = useAppState();
  const { settings } = state;

  function handleSetSettings(newSettings: Settings) {
    LocalStorageManager.storeAppSettings(newSettings);
    dispatch({
      type: 'set_settings',
      data: newSettings,
    });
  }

  return (
    <StyledHeader $show={settings.showHeader}>
      <SearchBar
        onSearchResults={(results) =>
          dispatch({
            type: 'set_database',
            data: results,
          })
        }
      />
      <div
        className="toggler-container"
        onClick={() =>
          handleSetSettings({
            ...settings,
            showHeader: !settings.showHeader,
          })
        }
      >
        <div className="toggler">
          {state.search && !state.settings.showHeader ? (
            <>
              <FaMagnifyingGlass /> &nbsp;{' '}
              <div className="search-text">{state.search}</div>
            </>
          ) : (
            <FaMagnifyingGlass />
          )}
        </div>
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.header<{ $show?: boolean }>`
  transform: ${({ $show }) => ($show ? 'translateY(0%)' : 'translateY(-100%)')};
  padding: 0.5rem;
  gap: 0.5rem;
  flex-direction: column;
  width: 100%;
  position: fixed;
  top: 0;
  background: #00000038;
  z-index: 1;
  transition: transform 0.3s;
  color: white;

  .toggler-container {
    width: 100%;
    height: 25px;
    position: absolute;
    bottom: -25px;
    left: 0;
    display: flex;
    justify-content: center;
    color: white;
    cursor: pointer;

    .toggler {
      padding: 0px 10px 0px 10px;
      border-radius: 0px 0px 10px 10px;
      background: ${({ theme }) => theme.color.i};
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      height: fit-content;
      min-height: 30px;

      .search-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 40vw;
      }
    }
  }
`;
