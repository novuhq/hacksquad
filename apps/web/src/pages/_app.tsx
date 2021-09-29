import { createGlobalStyle, ThemeProvider } from 'styled-components';
import '../styles/wl-styles.less';
import { initAnalytics } from '../shared/analytics.service';

const GlobalStyle = createGlobalStyle`

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    background-color: #0a071b;
    color: white;
  }


  .ant-upload {
    color: rgb(249 249 249 / 65%)
  }
  .ant-form-item-label > label {
    color: #8c87a6;
  }
`;

const theme = {
  colors: {
    primary: '#0070f3',
  },
};

export default function App({ Component, pageProps }: any) {
  initAnalytics();
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
