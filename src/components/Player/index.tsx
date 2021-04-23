import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayerContext } from '../../contexts/PlayerContext';
import convertDurationToTimeString from '../../utils/covertDurationToTimeString';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

const Player = () => {
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayerState,
    hasNext,
    hasPrevious,
  } = usePlayerContext();

  const audioRef = useRef<HTMLAudioElement>(null);

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgressListener = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(Math.floor(audioRef.current.currentTime));
        }
      });
    }
  };

  const handleSeek = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = amount;
      setProgress(amount);
    }
  };

  const handleEnd = () => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  };

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            objectFit="cover"
            src={episode.thumbnail}
            alt={episode.title}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            loop={isLooping}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEnd}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            className={isShuffling ? styles.isActive : ''}
            onClick={toggleShuffle}
            disabled={!episode || episodeList.length === 1}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            onClick={togglePlay}
            disabled={!episode}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Tocar Próxima" />
          </button>
          <button
            type="button"
            className={isLooping ? styles.isActive : ''}
            onClick={toggleLoop}
            disabled={!episode}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Player;
