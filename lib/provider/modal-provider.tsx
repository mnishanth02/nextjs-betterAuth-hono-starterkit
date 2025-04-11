"use client";

import TeamModal from "@/components/modals/team-modal";
import { useMounted } from "@/hooks/general/use-mounted";

export const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <>
      <TeamModal />
    </>
  );
};
