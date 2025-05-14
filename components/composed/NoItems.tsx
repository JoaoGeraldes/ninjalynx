import styled from 'styled-components';
import SVG from './SVG';
import useAppState from '@/hooks/useAppState';
import { LiaHourglassStartSolid } from 'react-icons/lia';
import { FaCircleExclamation } from 'react-icons/fa6';

export default function NoItems() {
  const { state, dispatch } = useAppState();

  return (
    <StyledDiv>
      {!state.loading ? (
        <>
          <SVG.EmptyBox />
          <strong>No items in your database</strong>

          <p>
            {!!state.search?.length && (
              <>
                <small>
                  <FaCircleExclamation />
                  With query:&nbsp;
                </small>

                <strong>{state.search}</strong>
              </>
            )}
          </p>
        </>
      ) : (
        <>
          <p>
            <LiaHourglassStartSolid />
          </p>
          <strong>Loading</strong>
        </>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: ${({ theme }) => theme.color.d};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  border-radius: 8px;

  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;

  small {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
    margin-top: 1em;
  }

  p {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
