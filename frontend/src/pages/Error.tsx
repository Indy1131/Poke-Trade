import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError() as { status: number };

  let message;

  if (error.status == 404) {
    message = "Page not found";
  } else {
    message = "Error";
  }

  return <h1>{message}</h1>;
}
