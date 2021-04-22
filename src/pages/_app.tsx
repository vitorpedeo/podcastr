import { AppProps } from 'next/app';

import PlayerProvider from '../contexts/PlayerContext';

import Header from '../components/Header';
import Player from '../components/Player';

import styles from '../styles/app.module.scss';

import '../styles/global.scss';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <PlayerProvider>
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  </PlayerProvider>
);

export default MyApp;
