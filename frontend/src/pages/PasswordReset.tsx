import { useEffect, useState } from "react";
import Button from "../components/form/Button";
import Input from "../components/form/Input";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Data = { [key: string]: string[] | string | null };

export default function PasswordReset() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<Data>({});

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password == " " || formData.password != formData.confirm) {
      setErrors({ password: ["Passwords must match"] });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/password_reset/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: formData.password }),
      });
      const json = (await response.json()) as Data;

      console.log(json);

      if (response.status != 200) {
        const newErrors = {} as Data;
        for (const key of Object.keys(json)) {
          newErrors[key] = json[key];
        }

        setErrors(newErrors);
        return;
      }

      console.log("redirecting");
      navigate("/login", { replace: true });
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
    <div className=" w-full flex justify-center bg-gradient-to-t from-primary to-secondary h-full relative">
      <div className="absolute bg-gradient-to-b from-white to-transparent w-full h-[200px] top-0 z-0" />
      <div className="absolute bg-gradient-to-t from-white to-transparent w-full h-[200px] bottom-0 z-0" />
      <div className="w-[calc(100%-60px)] mt-10 bg-white rounded-t-3xl z-2 p-10 flex justify-center">
        <form
          className="bg-white border-0 border-outline flex flex-col gap-2 box-border p-4 rounded-md w-[500px]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h1 className="text-4xl font-medium py-2 mb-4 bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent inline-block">
              Reset Password
            </h1>
          </div>
          <Input
            type="password"
            name="password"
            label="Password"
            className="max-w-[500px]"
            value={formData.password}
            onChange={handleChange}
            onFocus={handleFocus}
            error={errors.password}
            noLabel
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
            noLabel
          />
          <Button className="w-full self-center" text="Reset Password" />
          <h1 className="text-primary h-[1rem] w-full text-center">
            {errors.detail ? errors.detail : ""}
          </h1>
        </form>
      </div>
    </div>
  );
}
