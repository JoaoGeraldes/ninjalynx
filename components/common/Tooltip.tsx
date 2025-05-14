import styled from 'styled-components';

interface TooltipProps {
  children: React.ReactNode;
}

export default function Tooltip(props: TooltipProps) {
  const { children } = props;

  return (
    <TooltipWrapper>
      <div className="tooltip">
        {children}
        <div className="tip"></div>
      </div>
    </TooltipWrapper>
  );
}

const TooltipWrapper = styled.div`
  .tooltip {
    background: black;
    color: white;
    height: 50px;
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    .tip {
      width: 0;
      height: 0;
      border-left: 21px solid transparent;
      border-right: 0px solid transparent;
      border-top: 20px solid black;
      position: absolute;
      bottom: -20px;
      right: 0px;
    }
  }
`;
