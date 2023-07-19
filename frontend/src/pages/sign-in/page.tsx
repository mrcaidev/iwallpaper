import { UnauthGuard } from "components/guards";
import { Form } from "./form";
import { Google } from "./google";

export function SignIn() {
  return (
    <UnauthGuard>
      <main className="min-h-screen grid place-items-center">
        <div className="w-full max-w-xs -translate-y-1/10">
          <img
            src="/favicon.svg"
            alt="iWallpaper Logo. Two hearts."
            width={80}
            height={80}
            className="mx-auto"
          />
          <h1 className="mt-3 mb-8 font-bold text-4xl text-center">Sign In</h1>
          <Google />
          <p className="my-4 text-sm text-center text-slate-600 dark:text-slate-400">
            OR
          </p>
          <Form />
        </div>
      </main>
    </UnauthGuard>
  );
}
