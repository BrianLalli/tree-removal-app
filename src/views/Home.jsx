import { useAppContext } from "../context/appContext";

const Home = () => {
  const { user } = useAppContext();

  return <div>You are logged in and your email address is {user.email}</div>;
};

export default Home;
