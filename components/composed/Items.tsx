import { DatabaseItem, Settings } from '@/types/types';
import styled, { css } from 'styled-components';
import Item from './Item';
import useAppState from '@/hooks/useAppState';
import Button from '../common/Button';
import { MdViewList, MdViewModule } from 'react-icons/md';

interface ItemsProps {
  onClickEdit: (itemBeingEdited: DatabaseItem) => void;
}

export default function Items(props: ItemsProps) {
  const { onClickEdit } = props;

  const { state, dispatch } = useAppState();
  const { database, settings } = state;

  return (
    <ItemsSection $viewMode={settings.viewMode}>
      {!!database?.length && (
        <Button
          $asText
          onClick={() =>
            dispatch({
              type: 'set_settings',
              data: {
                viewMode:
                  state?.settings?.viewMode === 'grid' ? 'list' : 'grid',
              },
            })
          }
        >
          {state.settings.viewMode === 'list' ? (
            <MdViewList size="2em" />
          ) : (
            <MdViewModule size="2em" />
          )}
        </Button>
      )}

      <div className="items">
        {database &&
          database.map((item) => (
            <Item
              onClickEdit={() => onClickEdit(item)}
              key={item._id}
              entry={item}
            />
          ))}
      </div>
    </ItemsSection>
  );
}

const ItemsSection = styled.section<{ $viewMode: Settings['viewMode'] }>`
  padding-top: 4.5rem;
  width: 100%;
  max-width: 1000px;

  ${({ $viewMode }) =>
    $viewMode === 'list' &&
    css`
      section:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        box-shadow: 0px -1px 0px #ffffff24;
      }

      section:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        box-shadow: 0px 1px 0px #ffffff36;
      }
    `}

  .items {
    display: ${({ $viewMode }) => ($viewMode === 'list' ? 'block' : 'flex')};
    flex-direction: ${({ $viewMode }) =>
      $viewMode === 'grid' ? 'row' : 'column'};
    flex-wrap: wrap;
    justify-content: center;
    gap: ${({ $viewMode }) => ($viewMode === 'list' ? 'initial' : '4px')};
  }
`;
