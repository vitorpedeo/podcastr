interface Episode {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
}

interface HomeProps {
  episodes: Episode[];
}

const Home: React.FC<HomeProps> = ({ episodes }) => (
  <>
    <h1>Home</h1>
    <p>{JSON.stringify(episodes)}</p>
  </>
);

export default Home;

export const getStaticProps = async () => {
  const response = await fetch('http://localhost:5000/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
};
