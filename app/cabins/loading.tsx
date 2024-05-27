import Spinner from "@/app/_components/Spinner";

const Loading = () => {
  return (
    <div className="grid justify-center items-center">
      <Spinner />
      <p className="text-xl text-primary-200">Loading cabin data...</p>
    </div>
  );
};

export default Loading;
