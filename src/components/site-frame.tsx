import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteFrame({
  announcement,
  children,
}: {
  announcement?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {announcement}
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
