const Home = ({ episodes }) => {
  return (
    <>
      <h1>Home</h1>
      <p>{JSON.stringify(episodes)}</p>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const response = await fetch('http://localhost:5000/episodes')
  const data = await response.json();
  
  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
};