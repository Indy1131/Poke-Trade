import { useEffect } from "react";
import Button from "../components/form/Button";
import Form from "../components/form/Form";
import Input from "../components/form/Input";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Login() {
  useEffect(() => {
    async function getData() {
      console.log(`${BASE_URL}pokemon`);
      const response = await fetch(`${BASE_URL}/api/user/2/`);
      const json = await response.json();
      console.log(json);
    }

    getData();
  }, []);

  return (
    <div className=" w-full flex justify-center">
      <div className="w-[min(700px,calc(100%-20px))] my-10">
        <Form>
          <Input
            name="username"
            label="Username"
            className="max-w-[500px]"
            noLabel
          />
          <Input
            name="password"
            label="Password"
            className="max-w-[500px]"
            noLabel
          />
          <Button className="max-w-[400px]" />
        </Form>
      </div>
    </div>
  );
}
