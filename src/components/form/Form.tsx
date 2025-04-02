import { ReactElement, useState } from "react";

export default function Form({ children }: { children: ReactElement[] }) {
  const [formData, useFormData] = useState();
  const [errors, useErrors] = useState();

  return (
    <form className="border-2 border-outline flex flex-col gap-2 box-border p-4 rounded-md">
      {children}
    </form>
  );
}
