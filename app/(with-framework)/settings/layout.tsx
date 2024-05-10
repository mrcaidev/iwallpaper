import { PageTitle } from "components/ui/page-title";
import type { PropsWithChildren } from "react";
import { NavigationBar } from "./navigation-bar";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageTitle>Settings</PageTitle>
      <div className="flex flex-col md:flex-row gap-x-16 gap-y-8">
        <NavigationBar />
        <div className="grow">{children}</div>
      </div>
    </>
  );
}
