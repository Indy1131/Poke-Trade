import { useState } from "react";
import Button from "../components/form/Button";
import Input from "../components/form/Input";
import { useAuth } from "../hooks/useAuth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Data = { [key: string]: string[] | null };

export default function Login() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Data>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/api/user/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const json = (await response.json()) as Data;

    if (!json.refresh || !json.access) {
      const newErrors = {} as Data;
      for (const key of Object.keys(json)) {
        newErrors[key] = json[key];
      }

      setErrors(newErrors);
      return;
    }

    login(json);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  }

  return (
    <div className=" w-full flex justify-center">
      <div className="w-[min(700px,calc(100%-20px))] my-10">
        <form
          className="border-2 border-outline flex flex-col gap-2 box-border p-4 rounded-md"
          onSubmit={handleSubmit}
        >
          <Input
            name="username"
            label="Username"
            className="max-w-[500px]"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            // noLabel
          />
          <Input
            type="password"
            name="password"
            label="Password"
            className="max-w-[500px]"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            // noLabel
          />
          <Button className="max-w-[400px]" />
          <h1 className="text-secondary h-[1rem]">
            {errors.detail ? errors.detail : ""}
          </h1>
        </form>
      </div>
    </div>
  );
}
