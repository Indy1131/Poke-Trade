import { ChangeEvent, FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  className?: string;
};

export default function SearchBar({ className }: Props) {
  const [, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const sanitized = search.trim().toLowerCase();

    if (sanitized == "") {
      setSearchParams({});
    } else {
      setSearchParams({ keyword: sanitized });
    }
  }

  return (
    <form
      className={`flex justify-center py-3 ${className}`}
      onSubmit={handleSubmit}
    >
      <input
        className="bg-white border-3 border-primary rounded-full px-3 py-2 box-border w-[calc(100%-60px)]"
        placeholder="Search"
        value={search}
        onChange={handleChange}
      />
    </form>
  );
}
