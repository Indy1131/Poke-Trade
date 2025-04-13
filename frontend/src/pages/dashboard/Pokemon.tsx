import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Pokemon() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      id: 1,
      name: "Pokemon Name",
    });
  }, [id]);

  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Link to="/dashboard">Go back</Link>
      <h1>This is the specific page for this specific pokemon</h1>
      <form>
        <button>List/Unlist</button>
      </form>
    </>
  );
}
