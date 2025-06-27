import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    card: string;
    text: string;
    accent: string;
    buttonBg: string;
    buttonText: string;
    inputBg: string;
    inputBorder: string;
  }
} 