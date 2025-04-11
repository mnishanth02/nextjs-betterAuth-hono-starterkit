"use client";

import { useMounted } from "../hooks/common/use-mounted";

export const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;

  return null;
};
