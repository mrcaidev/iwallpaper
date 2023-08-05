import { UnauthGuard } from "auth/guards";
import { Form } from "./form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
};

export default function Page() {
  return (
    <UnauthGuard>
      <div className="grid place-items-center h-screen">
        <Form />
      </div>
    </UnauthGuard>
  );
}
