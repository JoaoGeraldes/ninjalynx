import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled, { CSSProperties } from 'styled-components';
import Button from './Button';
import { PiBroomDuotone } from 'react-icons/pi';

interface BubbleSettings {
  id: BubbleID;
  styles?: CSSProperties;
  message: string | ReactNode;
  previousBubbleId: number | null;
  nextBubbleId: number | null;
  onClick: (data: { bubbleRef: React.RefObject<HTMLDivElement> }) => void;
  /** It is destroyed when the animation ends or when user clicks on the bubble */
  onDestroy: (data: {
    id: number;
    bubbleRef: React.RefObject<HTMLDivElement>;
    previousBubbleId: number | null;
    nextBubbleId: number | null;
  }) => void;
  onCreate?: (data: {
    previousBubbleId: number | null;
    id: number;
    bubbleRef: React.RefObject<HTMLDivElement>;
  }) => void;
}

type BubbleID = number;

function* idGenerator(start = 1) {
  let id = start;
  while (true) {
    yield id++;
  }
}
const getId = idGenerator();

export let bubbleNow: (
  settings: Pick<BubbleSettings, 'message' | 'styles'>
) => void;

function Bubble(props: BubbleSettings) {
  const {
    id,
    styles,
    message,
    nextBubbleId,
    previousBubbleId,
    onClick,
    onCreate,
    onDestroy,
  } = props;

  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onCreate) {
      onCreate({ id, bubbleRef, previousBubbleId });
    }
  }, [bubbleRef, id, onCreate, previousBubbleId]);

  return (
    <div
      ref={bubbleRef}
      style={styles}
      className="bubble"
      onClick={() => onClick && onClick({ bubbleRef })}
      onAnimationEnd={(animation) => {
        if (animation.animationName === 'bubbleDestroyAnimation') {
          onDestroy({ id, bubbleRef, nextBubbleId, previousBubbleId });
        }
      }}
    >
      <div className="message">{message}</div>
    </div>
  );
}

/**
 *
 * # How to use?
 *
 * **Step 1** - Include `<BubbleStack />` **just once**, near the root of your app, such as:
 *
 *```tsx
 * function App(){
    return (
      <div>
        ...
        <BubbleStack />
      </div>
    );
  }
 *```
 * 
 *
 * **Step 2** - whenever you want to trigger a bubble, invoke `bubbleNow`, such as:
 *
 * ```tsx
 * <button onClick={() => bubbleNow({ message: 'My bubble message' })}>
 *    open a bubble
 * </button>
 * ```
 *
 *
 */
export default function BubbleStack() {
  const [bubbleStack, setBubbleStack] = useState<Record<
    number,
    {
      component: any;
      previous: number | null;
      next: number | null;
    }
  > | null>({});

  let bubbleOnTop: {
    id: null | number;
    ref: React.RefObject<HTMLDivElement> | null;
  } = {
    id: null,
    ref: null,
  };

  bubbleNow = (bubbleSettings) => {
    const uniqueId = getId.next().value || 0;

    const newBubble = (
      <Bubble
        nextBubbleId={null}
        previousBubbleId={bubbleOnTop.id}
        id={uniqueId}
        styles={bubbleSettings.styles}
        message={bubbleSettings.message}
        onClick={async ({ bubbleRef }) => {
          if (bubbleRef.current) {
            bubbleRef.current?.classList.add('bubble-destroy-animation');
            bubbleRef.current.innerHTML = '';
          }
        }}
        onDestroy={({ id, bubbleRef, nextBubbleId, previousBubbleId }) => {
          setBubbleStack((prev) => {
            const prevClone = { ...prev };
            delete prevClone[id];

            return prevClone;
          });
        }}
        onCreate={({ id, bubbleRef }) => {
          bubbleOnTop.id = id;
          bubbleOnTop.ref = bubbleRef;
        }}
      />
    );

    const newState = { ...bubbleStack };

    newState[uniqueId] = {
      next: null,
      component: newBubble,
      previous: bubbleOnTop.id,
    };

    setBubbleStack(newState);
  };

  if (!bubbleStack) return null;

  return (
    <StyledDiv>
      {Object.entries(bubbleStack).map(([id, data]) => (
        <React.Fragment key={id}>{data.component}</React.Fragment>
      ))}

      <div className="clear-all-container">
        {Object.keys(bubbleStack)?.length > 2 && (
          <Button onClick={() => setBubbleStack({})}>
            <PiBroomDuotone />
            &nbsp;Clear all&nbsp;
          </Button>
        )}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 300px;
  height: fit-content;
  position: fixed;
  z-index: 1234567890;
  bottom: 0;
  left: calc(50% - 150px);
  padding: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;

  .clear-all-container {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .bubble {
    height: 40px;
    z-index: 1234567891;
    width: 100%;
    margin: 3px;
    padding: 0.5em;
    color: white;
    cursor: pointer;
    max-width: 500px;
    border-radius: 8px;
    height: fit-content;
    background: #fff354;
    color: black;
    animation: bubbleCreateAnimation 0.2s forwards;

    .message {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      gap: 0.3em;
    }
  }

  @keyframes bubbleCreateAnimation {
    from {
      transform: translateY(50%);
    }
    to {
      transform: translateY(0%);
    }
  }

  @keyframes bubbleDestroyAnimation {
    from {
      height: 40px;
      padding: 0;
    }
    to {
      opacity: 0;
      height: 0px;
      transform: translateY(100%);
      z-index: 1234567890;
    }
  }

  .bubble-destroy-animation {
    animation: bubbleDestroyAnimation 0.3s ease forwards;
  }
`;
