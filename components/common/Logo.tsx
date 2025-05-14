import Image from 'next/image';
import logoLettering from '../../assets/image/logo_lettering.svg';
import logoSymbol from '../../assets/image/logo_symbol_v2.svg';

interface LogoProps {
  width?: number | `${number}`;
  height?: number | `${number}`;
}

function Lettering({ width, height }: LogoProps) {
  return (
    <Image
      src={logoLettering}
      width={width || 150}
      height={height || 150}
      alt="Ninjalynx logo lettering"
    />
  );
}

function Symbol({ width, height }: LogoProps) {
  return (
    <Image
      src={logoSymbol}
      width={width || 150}
      height={height || 150}
      alt="Ninjalynx logo symbol"
    />
  );
}

export const Logo = {
  Lettering,
  Symbol,
};
