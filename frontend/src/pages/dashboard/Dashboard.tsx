import PokeCard from "../../components/cards/PokeCard";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { useSearchParams } from "react-router-dom";

const sample = {
  name: "Pokemon Name",
  id: 1,
};

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState("hello");

  useEffect(() => {
    console.log("we here");
  }, [searchParams]);

  if (!data) return <h1>Loading...</h1>;

  return (
    <div className="flex flex-col items-center">
      <SearchBar className="sticky top-0 w-full" />
      <div
        className="grid grid-cols-2 gap-8 justify-center w-[min(calc(330px*4+32px*3+64px),100%)] p-8"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
        }}
      >
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
        <PokeCard pokemon={sample} />
      </div>
    </div>
  );
}
