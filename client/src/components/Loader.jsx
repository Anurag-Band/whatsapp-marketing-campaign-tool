import loader from "../assets/loader.svg";

const Loader = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img role="loading" src={loader} alt="loader" className="w-24 h-24" />
    </div>
  );
};

export default Loader;

