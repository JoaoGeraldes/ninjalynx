import {
  Authentication,
  DatabaseItem,
  Settings,
  ThemeNames,
} from '@/types/types';
import { LocalStorageManager } from '@/utils/LocalStorageManager';

import { createContext, Dispatch, useContext, useReducer } from 'react';

// ------------------------------- //
// ------------ TYPES ------------ //
// ------------------------------- //

export interface AppState {
  database: DatabaseItem[] | null;
  pagination: { lastCursor: string | null };
  auth: Authentication | null;
  loading: boolean;
  settings: Settings;
  theme: ThemeNames;
  search: string | null;
}

export type Action<ACTION_TYPE, ACTION_DATA> = {
  type: ACTION_TYPE;
  data: ACTION_DATA;
};

// --------------------------------------- //
// ------------ INITIAL STATE ------------ //
// --------------------------------------- //
export const initialState: AppState = {
  search: null,
  theme: 'amethyst',
  database: null,
  pagination: { lastCursor: null },
  loading: false,
  auth: null,
  settings: {
    allowRemoval: false,
    exposeAll: false,
    showHeader: false,
    allowEdit: false,
    viewMode: 'grid',
  },
};

type PrefixedSetters<APP_STATE_INTERFACE> = `set_${keyof APP_STATE_INTERFACE &
  string}`;
type AppStateSetters = PrefixedSetters<AppState>;

// --------------------------------- //
// ------------ REDUCER ------------ //
// --------------------------------- //
export function reducer(
  state = initialState,
  action: Action<AppStateSetters, any>
) {
  switch (action.type) {
    case 'set_database': {
      return {
        ...state,
        database: action.data,
      };
    }

    case 'set_pagination': {
      return {
        ...state,
        pagination: action.data,
      };
    }

    case 'set_auth': {
      return {
        ...state,
        auth: action.data,
      };
    }

    case 'set_loading': {
      return {
        ...state,
        loading: action.data,
      };
    }

    case 'set_settings': {
      LocalStorageManager.storeAppSettings({
        ...state.settings,
        ...action.data,
      });
      return {
        ...state,
        settings: { ...state.settings, ...action.data },
      };
    }

    case 'set_theme': {
      return {
        ...state,
        theme: action.data,
      };
    }

    case 'set_search': {
      return {
        ...state,
        search: action.data,
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

// --------------------------------- //
// ------------ CONTEXT ------------ //
// --------------------------------- //
export const AppStateContext = createContext<{
  state?: AppState;
  dispatch: <K extends keyof AppState>(action: {
    type: `set_${K & string}`;
    data: AppState[K];
  }) => void;
} | null>(null);

// ------------------------------ //
// ------------ HOOK ------------ //
// ------------------------------ //
export default function useAppState() {
  const context = useContext(AppStateContext)!;

  return { state: context.state!, dispatch: context.dispatch };
}
