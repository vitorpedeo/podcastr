import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import api from '../../services/api';
import convertDurationToTimeString from '../../utils/covertDurationToTimeString';
import { Episode as EpisodeType } from '../../types/episode.types';

import styles from '../episode.module.scss';

interface FormatedEpisode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

interface EpisodeProps {
  episode: FormatedEpisode;
}

const Episode: React.FC<EpisodeProps> = ({ episode }) => {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          objectFit="cover"
          src={episode.thumbnail}
          alt={episode.title}
        />

        <button type="button">
          <img src="/play.svg" alt="Reproduzir" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Pegando apenas os dois últimos podcasts lançados
  const { data } = await api.get<EpisodeType[]>(`/episodes`, {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params ? context.params.slug : '';
  const { data } = await api.get<EpisodeType>(`/episodes/${slug}`);

  const episode: FormatedEpisode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Episode;
