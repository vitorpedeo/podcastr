import { AppProps } from 'next/app';

import Header from '../components/Header';
import Player from '../components/Player';

import styles from '../styles/app.module.scss';

import '../styles/global.scss';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className={styles.wrapper}>
    <main>
      <Header />
      <Component {...pageProps} />
    </main>
    <Player />
  </div>
);

export default MyApp;
