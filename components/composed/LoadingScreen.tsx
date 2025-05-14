import styled from 'styled-components';
import { LuLoader2 } from 'react-icons/lu';

interface LoadingScreenProps {
  show: boolean;
}

export default function LoadingScreen(props: LoadingScreenProps) {
  const { show } = props;

  return (
    show && (
      <AnimatedLoader>
        <LuLoader2 color="#ffffff" />
      </AnimatedLoader>
    )
  );
}

const AnimatedLoader = styled.span`
  position: fixed;
  animation: rotate 0.6s linear infinite;
  font-size: 2rem;
  bottom: 12px;
  left: 12px;
  z-index: 11;
  backdrop-filter: blur(1px) brightness(0.8);
  border-radius: 100%;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
