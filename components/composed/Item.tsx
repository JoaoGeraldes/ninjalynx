import { DatabaseItem, Settings } from '@/types/types';
import { copyToClipboard } from '@/utils/utils';
import { useEffect, useRef, useState } from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';

import styled, { css, useTheme } from 'styled-components';
import Button from '../common/Button';
import useAppState from '@/hooks/useAppState';
import { RGBBarLoader } from '../common/RGBBarLoader';
import { deleteItem, getItems } from '@/fetchers';
import { Redacted_Script } from 'next/font/google';
import { CiUser } from 'react-icons/ci';
import { PiKeyLight } from 'react-icons/pi';
import { NinjaLynxCrypto } from '@/utils/NinjaLynxCrypto';
import { SessionStorageManager } from '@/utils/SessionStorageManager';
import Warn from '../common/Warn';
import { BiError } from 'react-icons/bi';
import { FaPenToSquare, FaLockOpen, FaLock, FaTrash } from 'react-icons/fa6';
import EllipsisDropdownMenu from './EllipsisDropdownMenu';

interface EntryProps {
  entry: DatabaseItem;
  onClickEdit: () => void;
}

const touchData = new WeakMap();

const ITEM_REMOVAL_DELAY_IN_MILISECONDS = 500;

const redactedScriptFont = Redacted_Script({
  weight: '400',
  display: 'swap',
  subsets: ['latin'],
});

export default function Item(props: EntryProps) {
  const { entry, onClickEdit } = props;

  const [visible, setVisible] = useState(false);
  const [decrypted, setDecrypted] = useState<Pick<
    DatabaseItem,
    'username' | 'password'
  > | null>(null);

  const theme = useTheme();

  const [expanded, setExpanded] = useState(false);

  const { state, dispatch } = useAppState();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const { settings, auth } = state;

  const { exposeAll, allowRemoval } = settings;

  const removeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (exposeAll) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [exposeAll]);

  useEffect(() => {
    async function handleItemDecryptionAndCache() {
      if (!auth?.plaintext.masterKey)
        throw new Error("Missing master key. Can't decrypt item.");

      try {
        const decryptedUsername =
          (entry.username &&
            (await NinjaLynxCrypto.decrypt(
              auth?.plaintext.masterKey,
              entry.username!
            ))) ||
          entry.username;

        const decryptedPassword = await NinjaLynxCrypto.decrypt(
          auth?.plaintext.masterKey,
          entry.password!
        );

        setDecrypted({
          username: decryptedUsername,
          password: decryptedPassword,
        });

        SessionStorageManager.storeDecryptedItem({
          ...entry,
          password: decryptedPassword,
          username: decryptedUsername,
        });

        setError(false);
      } catch {
        setError(true);
      }
    }

    if (visible) {
      const cachedItem = SessionStorageManager.getDecryptedItem(entry?._id);

      if (cachedItem) {
        const parsed = JSON.parse(cachedItem);

        setDecrypted({
          username: parsed.username,
          password: parsed.password,
        });
        return;
      }

      handleItemDecryptionAndCache();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, entry]);

  async function handleOnInputClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    inputToDecrypt?: string
  ) {
    if (!auth?.plaintext.masterKey) throw new Error('Missing master key.');

    const element = e?.currentTarget as HTMLElement;

    if (!inputToDecrypt) return;

    const decryptedUsername = await NinjaLynxCrypto.decrypt(
      auth?.plaintext.masterKey,
      inputToDecrypt
    );

    const hasCopied = await copyToClipboard(decryptedUsername);

    if (hasCopied) {
      // do something if copied to clipboard --
      element?.classList?.add('input-click-animation');
    }
  }

  function handleOnRemoveStart(buttonElement: HTMLButtonElement) {
    touchData.set(buttonElement, {
      touchStartTime: Date.now(),
      defaultInnerHTML: buttonElement.innerHTML,
    });
    buttonElement.innerHTML = 'Hold to remove&nbsp;(move to cancel)';
    buttonElement.classList.add('removal-animation');
  }

  function handleOnRemoveMove(buttonElement: HTMLButtonElement) {
    const data = touchData.get(buttonElement);

    if (data) {
      buttonElement.innerHTML = data.defaultInnerHTML;
      touchData.delete(buttonElement);
      buttonElement.classList.remove('removal-animation');
    }
  }

  async function handleOnRemoveEnd(buttonElement: HTMLButtonElement) {
    const data = touchData.get(buttonElement);
    if (data) {
      buttonElement.innerHTML = data.defaultInnerHTML;
      buttonElement.classList.remove('removal-animation');

      touchData.delete(buttonElement);

      if (
        Date.now() - data.touchStartTime >=
        ITEM_REMOVAL_DELAY_IN_MILISECONDS
      ) {
        setLoading(true);

        const deleted = await deleteItem({ itemId: entry._id });

        if (deleted?.itemId) {
          dispatch({
            type: 'set_loading',
            data: true,
          });

          const pagination = await getItems({
            lastCursor: true,
            description: state.search,
            cursor: null,
          });

          let databaseWithoutDeletedItem: DatabaseItem[] = [];
          state.database?.forEach((item) =>
            item._id === deleted?.itemId
              ? null
              : databaseWithoutDeletedItem.push(item)
          );

          dispatch({
            type: 'set_pagination',
            data: { lastCursor: pagination?.cursor || null },
          });

          dispatch({
            type: 'set_database',
            data: databaseWithoutDeletedItem,
          });

          dispatch({
            type: 'set_loading',
            data: false,
          });

          return;
        }

        alert('Failed to delete item.');
      }
    }
  }

  async function handleAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
    const element = e?.currentTarget as HTMLElement;

    element?.classList?.remove('input-click-animation');
  }

  async function handleDelete() {
    setLoading(true);

    const deleted = await deleteItem({ itemId: entry._id });

    if (deleted?.itemId) {
      dispatch({
        type: 'set_loading',
        data: true,
      });

      const pagination = await getItems({
        lastCursor: true,
        description: state.search,
        cursor: null,
      });

      let databaseWithoutDeletedItem: DatabaseItem[] = [];
      state.database?.forEach((item) =>
        item._id === deleted?.itemId
          ? null
          : databaseWithoutDeletedItem.push(item)
      );

      dispatch({
        type: 'set_pagination',
        data: { lastCursor: pagination?.cursor || null },
      });

      dispatch({
        type: 'set_database',
        data: databaseWithoutDeletedItem,
      });

      dispatch({
        type: 'set_loading',
        data: false,
      });

      return;
    }
  }

  const deleteButton = (
    <Button
      $asText
      $color={theme.color.h}
      onClick={async () => {
        setLoading(true);

        const deleted = await deleteItem({ itemId: entry._id });

        if (deleted?.itemId) {
          dispatch({
            type: 'set_loading',
            data: true,
          });

          const pagination = await getItems({
            lastCursor: true,
            description: state.search,
            cursor: null,
          });

          let databaseWithoutDeletedItem: DatabaseItem[] = [];
          state.database?.forEach((item) =>
            item._id === deleted?.itemId
              ? null
              : databaseWithoutDeletedItem.push(item)
          );

          dispatch({
            type: 'set_pagination',
            data: { lastCursor: pagination?.cursor || null },
          });

          dispatch({
            type: 'set_database',
            data: databaseWithoutDeletedItem,
          });

          dispatch({
            type: 'set_loading',
            data: false,
          });

          return;
        }
      }}
    >
      <FaTrash />
    </Button>
  );

  const interactiveDeleteButton = (
    <div className="remove-btn-container">
      <button
        disabled={loading}
        ref={removeButtonRef}
        className="removal-button"
        onMouseDown={(e) => {
          handleOnRemoveStart(e.target as HTMLButtonElement);
        }}
        onTouchStart={(e) => handleOnRemoveStart(e.target as HTMLButtonElement)}
        onTouchMove={(e) => handleOnRemoveMove(e.target as HTMLButtonElement)}
        onMouseOut={(e) => handleOnRemoveMove(e.target as HTMLButtonElement)}
        onMouseUp={(e) => handleOnRemoveEnd(e.target as HTMLButtonElement)}
        onTouchEnd={(e) => handleOnRemoveEnd(e.target as HTMLButtonElement)}
      >
        <RiDeleteBin7Fill pointerEvents="none" />
        &nbsp;Press to remove
        {loading && <RGBBarLoader $positioning="absoluteBottom" />}
      </button>
    </div>
  );

  return (
    <EntrySection
      onClick={state.settings.viewMode === 'list' ? onClickEdit : () => null}
      $hidden={!visible}
      $loading={loading || state.loading}
      $expanded={expanded}
      $viewMode={settings.viewMode}
    >
      {state.settings.viewMode === 'grid' && (
        <div className="visibility-section">
          <Button
            $asText
            onClick={(e) => {
              if (exposeAll) return;
              setVisible(!visible);
            }}
          >
            {exposeAll || visible ? (
              <FaLockOpen color={theme.color.h} size={'1.5em'} />
            ) : (
              <FaLock color={theme.color.i} size={'1.5em'} />
            )}
          </Button>
        </div>
      )}

      <div className="description">
        <span>{entry?.description && entry?.description}</span>
      </div>

      <div className="encrypted-fields-container">
        <div className="encrypted-fields">
          {/* -------------------- */}
          {/* ----- USERNAME ----- */}
          {/* -------------------- */}
          {entry.username && (
            <div
              className="hidden-section"
              onAnimationEnd={(e) => handleAnimationEnd(e)}
              onClick={(e) => handleOnInputClick(e, entry.username)}
            >
              <label>
                <CiUser />
                {settings.viewMode === 'grid' && <span>username</span>}
              </label>
              {entry?.username && (
                <input
                  className={
                    !exposeAll && !visible ? redactedScriptFont.className : ''
                  }
                  type={exposeAll || visible ? 'text' : 'text'}
                  value={
                    ((exposeAll || visible) && decrypted?.username) ||
                    entry?.username
                  }
                  readOnly
                />
              )}
            </div>
          )}

          {!entry.username && (
            <div className="hidden-section">
              <input type="text" value=" " readOnly />
            </div>
          )}

          {/* -------------------- */}
          {/* ----- PASSWORD ----- */}
          {/* -------------------- */}
          <div
            className="hidden-section"
            onAnimationEnd={(e) => handleAnimationEnd(e)}
            onClick={(e) => handleOnInputClick(e, entry.password)}
            onTouchEnd={(e) => handleOnInputClick(e as any, entry.password)}
          >
            <label>
              <PiKeyLight />
              {settings.viewMode === 'grid' && <span>password</span>}
            </label>

            <input
              className={
                !exposeAll && !visible ? redactedScriptFont.className : ''
              }
              type={exposeAll || visible ? 'text' : 'text'}
              value={
                ((exposeAll || visible) && decrypted?.password) ||
                entry?.password
              }
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="edit">
        {!error && (
          <Button $asText onClick={onClickEdit} $color={theme.color.i}>
            <FaPenToSquare size="1.5em" />
          </Button>
        )}

        {/* {!expanded && (
          <Button $color="blue" $asText onClick={() => setExpanded(true)}>
            <RiPushpinFill />
          </Button>
        )}

        {expanded && (
          <Button $color="blue" $asText onClick={() => setExpanded(false)}>
            <RiUnpinFill />
          </Button>
        )} */}
      </div>

      {allowRemoval &&
        (state.settings.viewMode === 'grid' ? (
          interactiveDeleteButton
        ) : (
          <EllipsisDropdownMenu
            menuItems={[
              <Button
                $color={theme.color.h}
                $asText
                key="delete"
                onClick={handleDelete}
              >
                <FaTrash />
                &nbsp;Delete
              </Button>,
            ]}
          />
        ))}

      {error && (
        <Warn
          color="red"
          icon={<BiError />}
          title="Error"
          message="An error occurred while trying to decrypt."
        />
      )}
    </EntrySection>
  );
}

const EntrySection = styled.section<{
  $hidden: boolean;
  $loading: boolean;
  $expanded?: boolean;
  $viewMode?: Settings['viewMode'];
}>`
  position: relative;
  display: flex;
  flex-direction: ${({ $viewMode }) =>
    $viewMode === 'grid' ? 'column' : 'row'};
  margin: 1px;
  padding: ${({ $viewMode }) => ($viewMode === 'list' ? '0.5em' : '0.6em')};
  background: ${({ theme, $viewMode }) =>
    $viewMode === 'list' ? theme.color.l : theme.color.l};
  border-radius: ${({ $viewMode }) => ($viewMode === 'list' ? '2px' : '12px')};
  flex: ${({ $viewMode }) => ($viewMode === 'grid' ? '1 1 200px' : 'initial')};
  box-shadow: ${({ $viewMode }) => ($viewMode === 'grid' ? 'none' : 'none')};
  opacity: ${({ $loading }) => ($loading ? '0.3' : '1')};
  transition: opacity 0.3s;
  justify-content: space-between;
  width: 100%;
  color: ${({ $viewMode }) => ($viewMode === 'grid' ? 'white' : 'white')};
  border: ${({ $viewMode }) =>
    $viewMode === 'grid' ? '1px solid #ffffff12' : 'none'};
  min-height: 50px;
  align-items: flex-start;
  transition: background 0.3s;

  .encrypted-fields-container {
    ${({ $viewMode }) =>
      $viewMode === 'list' &&
      css`
        display: flex;
        justify-content: space-between;
        align-items: center;
      `}
  }

  .encrypted-fields {
    display: ${({ $viewMode }) => ($viewMode === 'list' ? 'none' : 'flex')};
    gap: 1em;
    flex-direction: ${({ $viewMode }) =>
      $viewMode === 'grid' ? 'column' : 'row'};
  }

  .description {
    padding: 1em;
    font-weight: 200;
    align-items: center;
    display: flex;
    min-height: ${({ $viewMode }) =>
      $viewMode === 'grid' ? '64px' : 'initial'};
    margin: ${({ $viewMode }) =>
      $viewMode === 'grid' ? ' 10px 0 20px 0' : '0'};
    position: relative;

    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 85%,
      rgba(0, 0, 0, 0)
    );

    span {
      height: 100%;
    }

    ${({ $viewMode }) =>
      $viewMode === 'list'
        ? css`
            width: calc(100% - 60px);
            span {
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          `
        : css`
            max-height: 100px;
            overflow-y: auto;
          `}
  }

  .edit {
    display: ${({ $viewMode }) => ($viewMode === 'grid' ? 'flex' : 'none')};
    margin-top: 1em;
    color: blue;
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  .visibility-section {
  }

  .remove-btn-container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    margin-top: 1em;
  }

  .removal-button {
    border-radius: 4px;
    outline: 2px solid ${({ theme }) => theme.color.h};
    width: 100%;
    height: 3rem;
    display: flex;
    color: ${({ theme }) => theme.color.h};
    align-content: center;
    align-items: center;
    justify-content: center;

    background: linear-gradient(
      to right,
      ${({ theme }) => theme.color.h} 100%,
      transparent 100%
    );
    background-repeat: no-repeat;
    background-size: 0% 100%;
  }

  .removal-animation {
    animation: removalAnimation 0.5s forwards;

    @keyframes removalAnimation {
      from {
        background-size: 0% 100%;
      }
      to {
        color: white;
        background-size: 100% 100%;
      }
    }
  }

  .hidden-section {
    display: flex;
    flex-direction: column;
    width: ${({ $viewMode }) => ($viewMode === 'grid' ? '100%' : 'initial')};
    justify-content: space-between;
    position: relative;
    /* margin-top: 13px; */
    cursor: pointer;

    label {
      cursor: ${({ $viewMode }) =>
        $viewMode === 'list' ? 'pointer' : 'initial'};
      width: fit-content;
      gap: 4px;
      display: flex;
      align-items: center;
      font-variant-caps: small-caps;
      letter-spacing: 2px;
      /* position: absolute; */
      top: -25px;
      font-size: 14px;
      border-radius: 4px;
      padding: 0.1em 0.5em 0.1em 0.5em;
      border: 1px solid ${({ theme }) => theme.color.f};
    }

    input {
      display: ${({ $viewMode }) => ($viewMode === 'grid' ? 'block' : 'none')};
      margin-top: 4px;
      margin-left: 4px;
      background: inherit;
      color: ${({ theme, $hidden }) =>
        $hidden ? theme.color.c : theme.color.c};
      outline: unset;
      width: 50%;
      min-width: 200px;
      cursor: pointer;
      font-size: 1.1rem;
    }
  }

  .input-click-animation {
    animation: animate 0.3s;

    &::after {
      content: 'Copied ✔';
      color: ${({ theme }) => theme.color.i};
      font-size: 0.7em;
      position: absolute;
      top: -15px;
    }

    @keyframes animate {
      0% {
        opacity: 1;
        transform: translateY(0px);
      }
      50% {
        opacity: 0.5;
        transform: translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0px);
      }
    }
  }

  &:hover {
    outline: 1px solid #ffffff7a;
    cursor: pointer;
    background: #ffffff26;
  }

  ${({ $expanded }) =>
    $expanded &&
    css`
      width: 90vw;
      height: 70vh;
      position: fixed;
      z-index: 20;
      box-shadow: 1px 1px 20px 7px #0000008a;
    `}
`;
