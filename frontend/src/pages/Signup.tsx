import { useState } from "react";
import Button from "../components/form/Button";
import Input from "../components/form/Input";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Data = { [key: string]: string[] | string | null };

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Data>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password == " " || formData.password != formData.confirm) {
      setErrors({ password: ["Passwords must match"] });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/create/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = (await response.json()) as Data;

      if (response.status != 201) {
        const newErrors = {} as Data;
        for (const key of Object.keys(json)) {
          newErrors[key] = json[key];
        }

        setErrors(newErrors);
        return;
      }

      console.log("navigating");
      navigate("/login");
    } catch {
      setErrors({
        detail: "There was an error requesting the server. Try again later.",
      });
    }
  }

  function handleFocus(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: "" });
    setErrors({ ...errors, [e.target.name]: null });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className=" w-full flex justify-center">
      <div className="w-[min(700px,calc(100%-20px))] my-10">
        <h1 className="text-3xl mb-4">Sign up</h1>
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
            onFocus={handleFocus}
            error={errors.username}
          />
          <Input
            type="email"
            name="email"
            label="Email"
            className="max-w-[500px]"
            value={formData.email}
            onChange={handleChange}
            onFocus={handleFocus}
            error={errors.email}
          />
          <Input
            type="password"
            name="password"
            label="Password"
            className="max-w-[500px]"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            error={errors.password}
          />
          <Input
            type="password"
            name="confirm"
            label="Confirm Password"
            className="max-w-[500px]"
            value={formData.confirm}
            onChange={handleChange}
            onFocus={handleFocus}
            error={errors.confirm}
          />
          <Button className="max-w-[400px]" text="Sign up" />
          <Link to="/login">Already registered? Log in</Link>
          <h1 className="text-secondary h-[1rem]">
            {errors.detail ? errors.detail : ""}
          </h1>
        </form>
      </div>
    </div>
  );
}
