import styled from 'styled-components';
import Button from '../common/Button';
import useAppState from '@/hooks/useAppState';
import { downloadDatabase } from '@/fetchers';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';
import Link from 'next/link';
import { PATHNAME } from '@/configurations/pathnames';
import {
  FaFileImport,
  FaFileExport,
  FaPowerOff,
  FaCloudSun,
  FaBurger,
} from 'react-icons/fa6';

export default function MainMenu() {
  const { state, dispatch } = useAppState();
  const [openMainMenu, setOpenMainMenu] = useState(false);

  return (
    <NavContainer $showingHeader={state?.settings?.showHeader}>
      {openMainMenu && (
        <div
          className="clickable-close-area"
          onClick={() => setOpenMainMenu(false)}
        ></div>
      )}

      <div className="menu-button">
        <Button onClick={() => setOpenMainMenu(!openMainMenu)}>
          {/* <GiHamburgerMenu size="1.5em" /> */}
          <FaBurger size="1.5em" />
        </Button>
      </div>

      <MenuButton />

      {openMainMenu && (
        <StyledNav>
          <ul>
            <li
              onClick={() =>
                dispatch({
                  type: 'set_settings',
                  data: {
                    exposeAll: !state.settings.exposeAll,
                  },
                })
              }
            >
              <div>
                <input
                  readOnly
                  checked={state.settings.exposeAll}
                  id="expose-all"
                  type="checkbox"
                  name="Expose all"
                />
                <label>Expose all</label>
              </div>

              <div>
                <small>
                  Decrypt and expose all the encrypted and hidden fields in the
                  UI.
                </small>
              </div>
            </li>

            <li
              onClick={(e) => {
                dispatch({
                  type: 'set_settings',
                  data: {
                    allowRemoval: !state.settings.allowRemoval,
                  },
                });
              }}
            >
              <div>
                <input
                  readOnly
                  checked={state.settings.allowRemoval}
                  id="allow-removal"
                  type="checkbox"
                  name="Allow removal"
                />
                <label>Allow removal</label>
              </div>

              <div>
                <small>Allow the items to be deleted.</small>
              </div>
            </li>

            <li
              onClick={(e) => {
                dispatch({
                  type: 'set_settings',
                  data: {
                    ...state.settings,
                    allowEdit: !state.settings.allowEdit,
                  },
                });
              }}
            >
              <div>
                <input
                  readOnly
                  checked={state.settings.allowEdit}
                  id="allow-edit"
                  type="checkbox"
                  name="Allow edit"
                />
                <label>Allow edit</label>
              </div>

              <div>
                <small>Allow the items to be edited.</small>
              </div>
            </li>

            <li
              onClick={() => {
                if (state.theme === 'amethyst') {
                  dispatch({
                    type: 'set_theme',
                    data: 'obsidian',
                  });
                } else {
                  dispatch({
                    type: 'set_theme',
                    data: 'amethyst',
                  });
                }
              }}
            >
              <div>
                <FaCloudSun /> Change theme
              </div>
            </li>

            <li
              onClick={async () => {
                if (state.loading) return;

                dispatch({ type: 'set_loading', data: true });
                await downloadDatabase();
                dispatch({ type: 'set_loading', data: false });
              }}
            >
              <div>
                <FaFileExport /> Export database
              </div>

              <div>
                <small>
                  {state.loading ? (
                    <i>downloading...</i>
                  ) : (
                    'Export your database to a .json file'
                  )}
                </small>
              </div>
            </li>

            <li
              onClick={() =>
                dispatch({
                  type: 'set_settings',
                  data: {
                    ...state.settings,
                    exposeAll: !state.settings.exposeAll,
                  },
                })
              }
            >
              <Link href={PATHNAME.appImport}>
                <div>
                  <FaFileImport />
                  Import database
                </div>

                <div>
                  <small>Import your database from a .json file</small>
                </div>
              </Link>
            </li>

            <li
              onClick={() => {
                sessionStorage.clear();
                dispatch({
                  type: 'set_auth',
                  data: null,
                });
              }}
            >
              <div>
                <FaPowerOff />
                Log out
              </div>
            </li>
          </ul>
        </StyledNav>
      )}
    </NavContainer>
  );
}

const NavContainer = styled.div<{ $showingHeader?: boolean }>`
  position: fixed;
  top: ${({ $showingHeader }) => ($showingHeader ? '64px' : '12px')};
  right: 12px;
  display: flex;
  justify-content: flex-end;
  z-index: 30;
  transition: all 0.5s;

  small {
    opacity: 0.7;
  }

  .menu-button {
    z-index: 30;
  }

  .clickable-close-area {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    position: fixed;
    animation: backdropfx 0.5s forwards;

    @keyframes backdropfx {
      to {
        backdrop-filter: brightness(0.5) blur(1px);
      }
    }
  }

  nav {
    box-shadow: 0px 0px 20px 4px #000000c4;
    position: absolute;
    right: 0;
    top: 40px;
    width: 280px;
    height: fit-content;
    z-index: 20;
    border-radius: 6px 6px 6px 6px;
    background: linear-gradient(4deg, #6900ff 10%, #135deab3 90%);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(3px);
    animation: fadeIn 0.3s forwards;
    padding: 0.5em;

    input[type='checkbox'] {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid white;
      border-radius: 4px;
      display: inline-block;
      position: relative;

      &:checked::after {
        content: '✔';
        font-size: 24px;
        position: absolute;
        top: -12px;
        left: 0px;
        color: white;
      }
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }

    li {
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      border-radius: 8px;
      padding: 8px;

      &:hover {
        background: #00000029;
        transition: background 0.5s;
      }

      div {
        display: flex;
        align-items: center;
        gap: 0.4em;
      }

      * {
        cursor: pointer;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StyledNav = styled.nav``;

const MenuButton = styled.div`
  top: 60px;
  z-index: 20;
  right: 12px;
  position: fixed;
  transition: all 0.3s;
  transition-delay: 0.1s;
`;
