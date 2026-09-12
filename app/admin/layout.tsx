import type { ReactNode } from "react";
import PasskeySetup from "./PasskeySetup";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PasskeySetup />
    </>
  );
}
