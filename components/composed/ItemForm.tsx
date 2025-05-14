import { DatabaseItem } from '@/types/types';
import Form from '../common/Form';
import { copyToClipboard, generatePassword } from '@/utils/utils';
import Button from '../common/Button';
import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import useAppState from '@/hooks/useAppState';
import {
  FaArrowsRotate,
  FaBurger,
  FaFileCirclePlus,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
import { IoIosSave } from 'react-icons/io';
import { createItem, updateItem } from '@/fetchers';
import { NinjaLynxCrypto } from '@/utils/NinjaLynxCrypto';
import { SessionStorageManager } from '@/utils/SessionStorageManager';
import { IoCopy } from 'react-icons/io5';
import { bubbleNow } from '../common/Bubble';
import { CiUser } from 'react-icons/ci';
import { PiKeyLight } from 'react-icons/pi';

interface CreateEntryFormProps {
  onAfterCreateItem: (item: DatabaseItem) => void;
  onAfterUpdateItem: (item: DatabaseItem) => void;
  /** An item to be updated. If itemBeingEdited, the Form is automatically set to editing mode */
  itemBeingEdited?: DatabaseItem | null;
}

export default function ItemForm(props: CreateEntryFormProps) {
  const { itemBeingEdited, onAfterCreateItem, onAfterUpdateItem } = props;
  const { dispatch, state } = useAppState();

  const { auth } = state;

  const [newItem, setNewItem] = useState<DatabaseItem>({
    description: '',
    password: '',
    username: '',
  });

  const [inputType, setInputType] = useState<'password' | 'text'>(
    state.settings.exposeAll ? 'text' : 'password'
  );

  const itemBeingEditedWithNoChanges = useRef<DatabaseItem | null>(null);

  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.settings.exposeAll) {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }, [state.settings.exposeAll]);

  useEffect(() => {
    async function processData() {
      if (itemBeingEdited && auth?.plaintext.masterKey) {
        const decryptedItem = {
          ...newItem,
          description: itemBeingEdited.description,
          password:
            itemBeingEdited.password &&
            (await NinjaLynxCrypto.decrypt(
              auth.plaintext.masterKey,
              itemBeingEdited.password
            )),
          username:
            itemBeingEdited.username &&
            (await NinjaLynxCrypto.decrypt(
              auth.plaintext.masterKey,
              itemBeingEdited.username
            )),
        };

        setNewItem(decryptedItem);
        setInputType('password');
        itemBeingEditedWithNoChanges.current = decryptedItem;
      } else {
        setInputType('text');
        setNewItem({
          description: '',
          password: '',
          username: '',
        });
      }
    }

    processData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemBeingEdited]);

  async function handleUpdateItem() {
    const requestPayload: DatabaseItem = {
      ...newItem,
    };

    dispatch({
      type: 'set_loading',
      data: true,
    });

    if (!auth?.plaintext.masterKey)
      throw new Error('Missing master key password.');

    if (newItem.username) {
      const encriptedUsername = await NinjaLynxCrypto.encrypt(
        auth.plaintext.masterKey,
        newItem.username
      );
      requestPayload.username =
        encriptedUsername.concatenatedIvAsHexPlusCipherTextAsHex;
    }

    const encriptedPassword = await NinjaLynxCrypto.encrypt(
      auth.plaintext.masterKey,
      newItem.password
    );

    requestPayload.password =
      encriptedPassword.concatenatedIvAsHexPlusCipherTextAsHex;

    requestPayload._id = itemBeingEdited?._id;

    const updatedItem = await updateItem(requestPayload);

    dispatch({
      type: 'set_loading',
      data: false,
    });

    if (updatedItem) {
      SessionStorageManager.storeDecryptedItem({
        ...requestPayload,
        username: newItem.username,
        password: newItem.password,
        description: newItem.description,
      });
      onAfterUpdateItem(updatedItem);
      setNewItem({
        password: '',
        username: '',
        description: '',
      });
    }
  }

  async function handleCreateItem() {
    if (newItem?.description?.length < 1 || newItem?.password?.length < 1) {
      console.log('Not enough data to add a new entry.');
      return;
    }

    dispatch({
      type: 'set_loading',
      data: true,
    });

    try {
      const requestPayload: DatabaseItem = {
        ...newItem,
      };

      if (!auth?.plaintext.masterKey)
        throw new Error("Missing master key. Can't update item.");

      if (newItem.username) {
        const encriptedUsername = await NinjaLynxCrypto.encrypt(
          auth?.plaintext.masterKey,
          newItem.username
        );
        requestPayload.username =
          encriptedUsername.concatenatedIvAsHexPlusCipherTextAsHex;
      }

      const encriptedPassword = await NinjaLynxCrypto.encrypt(
        auth?.plaintext.masterKey,
        newItem.password
      );

      requestPayload.password =
        encriptedPassword.concatenatedIvAsHexPlusCipherTextAsHex;

      const item = await createItem(requestPayload);

      if (item) {
        onAfterCreateItem(item);
        setNewItem({
          description: '',
          password: '',
          username: '',
        });
      }
    } catch (e) {
      console.log('Failed to create a new entry.', e);
    } finally {
      dispatch({
        type: 'set_loading',
        data: false,
      });
    }
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();

        itemBeingEdited ? handleUpdateItem() : handleCreateItem();
      }}
    >
      <FieldsContainer $itemBeingEdited={!!itemBeingEdited}>
        {itemBeingEdited?._id &&
          (inputType === 'text' ? (
            <Button type="button" onClick={() => setInputType('password')}>
              <FaRegEye size="1.5em" color="white" />
            </Button>
          ) : (
            <Button type="button" onClick={() => setInputType('text')}>
              <FaRegEyeSlash size="1.5em" color="white" />
            </Button>
          ))}

        {/* ************************** */}
        {/* ****** DESCRIPTION ******* */}
        {/* ************************** */}
        <div className="field">
          <label htmlFor="desc">Description *</label>
          <div className="input-container">
            <input
              autoComplete="off"
              required
              autoFocus
              id="desc"
              type="text"
              ref={descriptionInput}
              value={newItem?.description || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />

            <Button
              type="button"
              $asText
              onClick={() =>
                descriptionInput.current?.value &&
                copyToClipboard(descriptionInput.current?.value).then(() =>
                  bubbleNow({
                    message: 'Description copied.',
                    styles: {
                      textAlign: 'center',
                    },
                  })
                )
              }
            >
              <IoCopy />
            </Button>
          </div>
        </div>
        <div className="row">
          {/* *********************** */}
          {/* ****** PASSWORD ******* */}
          {/* *********************** */}
          <div className="field">
            <label htmlFor="pwd">
              <PiKeyLight /> Password *
            </label>

            <div className="input-container">
              <input
                autoComplete="off"
                id="pwd"
                required
                type={inputType}
                ref={passwordInput}
                value={newItem?.password || ''}
                onChange={(e) =>
                  setNewItem({ ...newItem, password: e.target.value })
                }
              />

              <Button
                type="button"
                $asText
                onClick={() =>
                  passwordInput.current?.value &&
                  copyToClipboard(passwordInput.current?.value).then(() =>
                    bubbleNow({
                      message: (
                        <>
                          <PiKeyLight /> Password copied.
                        </>
                      ),
                      styles: {
                        textAlign: 'center',
                      },
                    })
                  )
                }
              >
                <IoCopy />
              </Button>
            </div>

            {state.settings.allowEdit && (
              <Button
                tabIndex={-1}
                type="button"
                $color="#145deb"
                $asText
                onClick={() => {
                  setNewItem({
                    ...newItem,
                    password: generatePassword(),
                  });
                }}
              >
                <FaArrowsRotate />
                &nbsp;generate
              </Button>
            )}
          </div>
        </div>

        <div className="row">
          {/* ************************** */}
          {/* ****** E-MAIL/USER ******* */}
          {/* ************************** */}
          <div className="field">
            <label htmlFor="usr">
              <CiUser /> E-mail or user
            </label>

            <div className="input-container">
              <input
                autoComplete="off"
                id="usr"
                type={inputType}
                ref={usernameInput}
                value={newItem?.username || ''}
                onChange={(e) =>
                  setNewItem({ ...newItem, username: e.target.value })
                }
              />

              <Button
                type="button"
                $asText
                onClick={() =>
                  usernameInput.current?.value &&
                  copyToClipboard(usernameInput.current?.value).then(() =>
                    bubbleNow({
                      message: (
                        <>
                          <CiUser /> Username copied.
                        </>
                      ),
                      styles: {
                        textAlign: 'center',
                      },
                    })
                  )
                }
              >
                <IoCopy />
              </Button>
            </div>
          </div>
        </div>
        <div className="submit-button-container">
          {!itemBeingEdited && (
            <Button
              type="submit"
              disabled={
                state.loading || !newItem.description || !newItem.password
              }
            >
              <FaFileCirclePlus size={'1.5em'} />
              &nbsp;{state.loading ? 'Creating...' : 'Create new'}
            </Button>
          )}

          {itemBeingEdited && state.settings.allowEdit && (
            <Button
              type="submit"
              disabled={
                !!(
                  itemBeingEditedWithNoChanges.current &&
                  itemBeingEditedWithNoChanges.current.description ===
                    newItem.description &&
                  itemBeingEditedWithNoChanges.current.password ===
                    newItem.password &&
                  itemBeingEditedWithNoChanges.current.username ===
                    newItem.username
                ) || state.loading
              }
            >
              <IoIosSave size={'1.5em'} />
              &nbsp;{state.loading ? 'Saving...' : 'Save changes'}
            </Button>
          )}
        </div>

        {itemBeingEdited && !state.settings.allowEdit && (
          <small>
            <FaLock />
            To edit this item, enable <pre>Allow edit</pre> in the menu{' '}
            <pre>
              <FaBurger />
            </pre>
          </small>
        )}
      </FieldsContainer>
    </Form>
  );
}

const FieldsContainer = styled.div<{ $itemBeingEdited?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  gap: 1rem;
  max-width: 700px;
  width: 100%;

  small {
    gap: 1em;
    display: inline-flex;
    align-items: center;

    pre {
      padding: 4px;
      border-radius: 2px;
      backdrop-filter: contrast(0.8);
    }
  }

  .submit-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    font-size: 1.2rem;
  }

  .row {
    display: flex;
    flex-direction: row;
  }

  .field {
    display: flex;
    flex-direction: column;
    width: 100%;

    label {
      display: flex;
      align-items: center;
      gap: 0.3em;
      color: ${({ theme }) => theme.color.b};
    }

    .input-container {
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background: ${({ theme }) => theme.color.e};
      filter: contrast(0.8);

      button {
        height: 100%;
      }
    }

    input {
      border-radius: 4px;
      letter-spacing: 1px;
      color: white;
      background: unset;
    }

    ${({ $itemBeingEdited }) => $itemBeingEdited && css``}
  }

  @media only screen and (max-width: 430px) {
    font-size: 0.8rem;

    button[type='submit'],
    input[type='submit'] {
      width: 100%;
      min-height: 60px;
    }

    .field input {
      font-size: 1.1rem;
    }

    small {
      gap: 2px;
      flex-flow: wrap;
      display: inline-flex;
      flex-direction: row;
      align-content: stretch;
      align-items: center;
    }
  }
`;
