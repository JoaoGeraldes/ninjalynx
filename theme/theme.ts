// import original module declarations
import { ThemeNames } from '@/types/types';
import 'styled-components';
import { css, RuleSet } from 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends DefaultThemeStructure {}
}

type DefaultThemeStructure = {
  mainBackgroundStyles: RuleSet<object>;
  color: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    h: string;
    i: string;
    j: string;
    k: string;
    l: string;
  };
} & typeof common;

// Common styles (equal to all themes)
const common = {
  padding: {
    a: '5px 15px',
  },
};

export const theme: Record<ThemeNames, DefaultThemeStructure> = {
  // A sleek, elegant theme with rich purple hues, inspired by the gemstone.
  amethyst: {
    ...common,
    color: {
      a: '#e1e1e1',
      b: '#9e95b2',
      c: '#ffffff',
      d: '#a694cb',
      e: '#0f0a19',
      f: '#4d49531c',
      g: '#000000',
      h: '#c43838',
      i: '#145deb',
      j: '#0b002c',
      k: '#ffaf00',
      l: '#ffffff1a',
    },
    mainBackgroundStyles: css`
      background-size: 100% 100%;
      background-position: 0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px;
      background-image: radial-gradient(
          49% 81% at 45% 47%,
          #1b3ac645 0%,
          #073aff00 100%
        ),
        radial-gradient(113% 91% at 17% -2%, #000000ff 1%, #ff000000 99%),
        radial-gradient(142% 91% at 83% 7%, #211054eb 1%, #ff000000 99%),
        radial-gradient(142% 91% at -6% 74%, #000000ff 1%, #00000000 99%),
        radial-gradient(142% 91% at 111% 84%, #3815aaf7 0%, #24115d 100%);
    `,
  },
  // A deep, dark theme with a sophisticated and modern feel, like volcanic glass.
  obsidian: {
    ...common,
    color: {
      a: 'black',
      b: 'black',
      c: '#ffffff',
      d: '#ffffff',
      e: '#ffffff',
      f: '#ffffff',
      g: '#ffffff',
      h: '#ffffff',
      i: '#ffffff',
      j: '#ffffff',
      k: '#ffffff',
      l: '#ffffff',
    },
    mainBackgroundStyles: css``,
  },
};
