import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar";

export default function Transactions() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("keyword");

  return (
    <>
      <div className="fixed bg-gradient-to-b from-secondary to-primary w-full pointer-events-none h-[calc(100%-8rem)] z-[-1]">
        <div className="absolute bg-gradient-to-b from-white to-transparent w-full h-[200px] top-0 z-0" />
        <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-[200px] bottom-0 z-0" />
      </div>
      <div className=" w-full flex justify-center flex-1 relative">
        <div className="w-[calc(100%-60px)] mt-10 bg-white rounded-t-3xl z-2 pt-10 flex flex-col items-center">
          <div className="w-full">
            <h1 className="text-4xl font-medium py-2 mb-4 bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent inline-block px-10">
              <img
                src="/pokeicon.png"
                className="h-[4rem] w-[4rem] inline mr-3 pb-1 px-1"
              />
              My Transactions
            </h1>
            <h1 className="px-10">
              Want to check see your Pokemon?{" "}
              <Link
                to="/dashboard"
                className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent"
              >
                Go to your collection
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
