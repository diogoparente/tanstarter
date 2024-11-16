import { Header } from "./header";
import { Body } from "./body";
import { Footer } from "./footer";

import type { PropsWithChildren } from "react";

type PageProps = {
  withHeader?: boolean;
  withFooter?: boolean;
};

function Page({
  children,
  withHeader = true,
  withFooter = true,
}: PropsWithChildren<PageProps>) {
  return (
    <div className="flex min-h-screen min-w-full flex-col transition-all duration-700">
      {withHeader ? <Header /> : null}
      <Body>{children}</Body>
      {withFooter ? <Footer /> : null}
    </div>
  );
}

export { Page };
