import { Imagine } from "../api/imagine/route";
import { createContext, useState } from "react";

export type EditingItem = { type: string; id: number } | null;
export const WorkspaceContext = createContext({
  reloadHistory: () => {},
  editing: {} as EditingItem,
  setEditing: (item: EditingItem) => {},
  // draftMutate: () => {},
  // tattooMutate: () => {},
});
