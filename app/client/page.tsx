'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/composed/LoadingScreen';
import { removeAuthCookie } from '@/utils/utils';
import { DatabaseItem, Settings } from '@/types/types';
import { getItems } from '@/fetchers';
import Drawer from '@/components/common/Drawer';
import { GoHourglass } from 'react-icons/go';
import AddNewItem from '@/components/composed/AddNewItem';
import Items from '@/components/composed/Items';
import ItemForm from '@/components/composed/ItemForm';
import { HiOutlineArrowSmallDown } from 'react-icons/hi2';
import MainMenu from '@/components/composed/MainMenu';
import Header from '@/components/composed/Header';
import Button from '@/components/common/Button';
import { LocalStorageManager } from '@/utils/LocalStorageManager';
import NoItems from '@/components/composed/NoItems';
import { BsBoxFill } from 'react-icons/bs';
import useAppState from '@/hooks/useAppState';
import { useRouter } from 'next/navigation';
import { bubbleNow } from '@/components/common/Bubble';
import styled, { useTheme } from 'styled-components';
import { PATHNAME } from '@/configurations/pathnames';
import { FaPenToSquare } from 'react-icons/fa6';

export default function App() {
  const { state, dispatch } = useAppState();
  const { database, loading, auth } = state;

  const router = useRouter();

  const [openDrawer, setOpenDrawer] = useState(false);

  const [itemBeingEdited, setItemBeingEdited] = useState<DatabaseItem | null>(
    null
  );

  const theme = useTheme();

  // Get settings from local storage
  useEffect(() => {
    const storedSettings = LocalStorageManager.getAppSettings();
    if (storedSettings) {
      handleSetSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    if (!!!state?.auth?.isAuthenticated) {
      router.push(PATHNAME.appSignIn);
      return;
    }

    async function firstFetch() {
      dispatch({
        type: 'set_loading',
        data: true,
      });

      const data = await getItems({ cursor: null, description: null });

      const pagination = await getItems({
        lastCursor: true,
        description: state.search,
        cursor: null,
      });

      dispatch({
        type: 'set_pagination',
        data: {
          lastCursor: pagination?.cursor || null,
        },
      });

      // @ts-ignore
      if (data?.error) {
        removeAuthCookie();
        // @ts-ignore
        bubbleNow({
          //@ts-ignore
          message: `${data?.error}`,
          styles: {
            background: theme.color.h,
            color: theme.color.c,
          },
        });

        dispatch({
          type: 'set_database',
          data: [],
        });

        dispatch({
          type: 'set_auth',
          data: null,
        });

        sessionStorage.removeItem('plainTextApiKey');
        sessionStorage.removeItem('plainTextMasterKey');

        return;
      }

      dispatch({
        type: 'set_database',
        data: data || [],
      });

      dispatch({
        type: 'set_loading',
        data: false,
      });
    }

    firstFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.auth]);

  function handleSetSettings(newSettings: Settings) {
    dispatch({
      type: 'set_settings',
      data: newSettings,
    });
  }

  const hasMoreItemsToLoad =
    database?.[database?.length - 1]?._id !== state?.pagination?.lastCursor &&
    state?.pagination?.lastCursor;

  if (!!!state?.auth?.isAuthenticated) {
    return <LoadingScreen show />;
  }

  return (
    <>
      <MainMenu />

      <LoadingScreen show={loading} />

      <Header />

      {!!!state?.database?.length && <NoItems />}

      <Items
        onClickEdit={(itemBeingEdited) => {
          setItemBeingEdited(itemBeingEdited);
          setOpenDrawer(true);
        }}
      />

      <Drawer
        title={
          itemBeingEdited ? (
            <>
              <FaPenToSquare size={'1.5em'} />
              {state.settings.allowEdit ? 'Editing an item' : 'Viewing an item'}
            </>
          ) : (
            <>
              <BsBoxFill size={'1.5em'} /> Creating new item
            </>
          )
        }
        setOpen={setOpenDrawer}
        open={openDrawer}
        onClose={() => {
          if (itemBeingEdited) {
            setItemBeingEdited(null);
          }
        }}
      >
        <ItemForm
          itemBeingEdited={itemBeingEdited}
          onAfterUpdateItem={(itemUpdated) => {
            if (!database) return;

            const cloneDatabase = database.map((item) => {
              if (item._id === itemUpdated._id) {
                return itemUpdated;
              }

              return item;
            });

            dispatch({
              type: 'set_database',
              data: cloneDatabase,
            });

            setOpenDrawer(false);
            setItemBeingEdited(null);
          }}
          onAfterCreateItem={(itemCreated) => {
            if (database?.length) {
              dispatch({
                type: 'set_database',
                data: [itemCreated, ...database],
              });
            } else {
              dispatch({
                type: 'set_database',
                data: [itemCreated],
              });
            }

            setOpenDrawer(false);
          }}
        />
      </Drawer>

      <br />

      {hasMoreItemsToLoad && (
        <LoadMoreButton
          disabled={state?.loading}
          onClick={async () => {
            dispatch({
              type: 'set_loading',
              data: true,
            });
            const moreItems = await getItems({
              cursor: database?.[database?.length - 1]?._id || null,
              description: state.search,
            });

            dispatch({
              type: 'set_database',
              data: moreItems && database && [...database, ...moreItems],
            });

            dispatch({
              type: 'set_loading',
              data: false,
            });
          }}
        >
          {state?.loading ? (
            <>
              <GoHourglass />
              &nbsp;Loading...
            </>
          ) : (
            <>
              <HiOutlineArrowSmallDown />
              &nbsp;Load more
            </>
          )}
        </LoadMoreButton>
      )}

      <AddNewItem onClick={() => setOpenDrawer(true)} />
    </>
  );
}

const LoadMoreButton = styled(Button)`
  font-size: 1.2em;
`;
