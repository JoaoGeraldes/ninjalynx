import { ReactNode, useRef } from 'react';
import styled, { css } from 'styled-components';
import CloseButton from './CloseButton';
import { RGBBarLoader } from './RGBBarLoader';
import useAppState from '@/hooks/useAppState';

interface DrawerProps {
  children: ReactNode;
  open: boolean;
  title: string | ReactNode;
  setOpen: (state: boolean) => void;
  onClose?: () => void;
}

export default function Drawer(props: DrawerProps) {
  const { children, open, title, setOpen, onClose } = props;

  const { state } = useAppState();

  const drawerRef = useRef(null);

  function handleClose() {
    onClose && onClose();
    //@ts-ignore
    drawerRef.current.style.transform = '';
    setOpen(false);
  }

  return (
    <>
      {open && <Backdrop onClick={handleClose} />}

      <DrawerContainer ref={drawerRef} $open={open}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>

          <CloseButton
            onClick={() => {
              handleClose();
            }}
          />

          {state.loading && <RGBBarLoader $positioning="absoluteTop" />}
        </DrawerHeader>
        {children}
      </DrawerContainer>
    </>
  );
}

const Backdrop = styled.div`
  top: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  backdrop-filter: blur(3px);
`;

const hidingDrawer = css`
  animation: topDownAnimation 0.2s forwards;

  @keyframes topDownAnimation {
    to {
      transform: translateY(100%);
    }
  }
`;

const showingDrawer = css`
  animation: bottomUpAnimation 0.2s;

  @keyframes bottomUpAnimation {
    0% {
      transform: translateY(100%);
    }

    100% {
      transform: translateY(0%);
      height: fit-content;
    }
  }
`;

const DrawerTitle = styled.b`
  filter: drop-shadow(0px 1px 1px black);
  font-size: 1.2em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const DrawerHeader = styled.header`
  padding: 2em 1em 2em 1em;
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.b};
`;

const DrawerContainer = styled.div<{
  $open: boolean;
}>`
  z-index: 20;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: fit-content;
  overflow-y: auto;

  color: white;
  background: ${({ theme }) => theme.color.e};
  box-shadow: 0px 10px 20px 20px #00000087;
  border-top: 1px solid #ffffff1c;
  padding: 1rem;

  border-radius: 8px 8px 0px 0px;
  ${({ $open }) => ($open ? showingDrawer : hidingDrawer)}
`;
