import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import useDebounce from '@/hooks/useDebounce';
import { getItems } from '@/fetchers';
import { DatabaseItem } from '@/types/types';
import { RGBBarLoader } from '../common/RGBBarLoader';
import useAppState from '@/hooks/useAppState';

const searchHistory = [];

interface SearchBarProps {
  onSearchResults: (results: DatabaseItem[] | null) => void;
}

function SearchBar(props: SearchBarProps) {
  const { onSearchResults } = props;

  const { dispatch, state } = useAppState();

  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('');

  const debouncedSearch = useDebounce({
    callback: async () => {
      setLoading(true);

      const results = await getItems({
        cursor: null,
        description: text || null,
      });

      const pagination = await getItems({
        lastCursor: true,
        description: text,
        cursor: null,
      });

      dispatch({
        type: 'set_pagination',
        data: { lastCursor: pagination?.cursor || null },
      });

      setLoading(false);

      dispatch({
        type: 'set_search',
        data: text,
      });

      onSearchResults(results);
    },
    delay: 1000,
  });

  useEffect(() => {
    if (searchHistory.length < 1) return;

    debouncedSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <section>
      <SearchBarForm
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="search-input-wrapper">
          <input
            value={text}
            onChange={(e) => {
              e.preventDefault();
              // This condition prevents debounce search to run in the first few renders
              if (searchHistory.length < 1) {
                searchHistory.push(e.target.value);
              }

              setText(e.target.value);
            }}
            type="text"
            placeholder="Type to search..."
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setText('');
            }}
          >
            <RiDeleteBack2Fill />
          </button>

          {loading && <RGBBarLoader $positioning="absoluteBottom" />}
        </div>
      </SearchBarForm>
    </section>
  );
}

export default memo(SearchBar);

const SearchBarForm = styled.form`
  display: flex;
  justify-content: center;

  .search-input-wrapper {
    display: flex;
    position: relative;
  }

  input {
    position: relative;
    background: ${(props) => props.theme.color.c};
    color: black;
    padding: 0.5em;
    border-radius: 0.3em 0em 0em 0.3em;
    outline: none;
  }

  button {
    background: ${(props) => props.theme.color.c};
    padding-right: 0.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    color: #00000057;
    border-radius: 0px 4px 4px 0px;

    &:hover {
      color: red;
    }
  }
`;
