import { Link, useLocation } from "react-router-dom";

export default function Pokemon() {
  //   const location = useLocation();
  //   const path = location.pathname;

  //   console.log(path);

  //   const previous = path.startsWith("/dashboard/pokemon")
  //     ? "/dashboard"
  //     : "/market";

  return (
    <>
      <Link to="/dashboard">Go back</Link>
      <h1>This is the specific page for this specific pokemon</h1>
    </>
  );
}
