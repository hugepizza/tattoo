"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Input from "./Input";
import History from "./History";
import useSWR from "swr";
import Desk from "./Desk";
import { Toaster } from "react-hot-toast";
import { Draft } from "../api/draft/route";

export const WorkspaceContext = createContext({
  reloadHistory: () => {},
  editing: {} as Draft | null,
  setEditing: (item: Draft | null) => {},
  draftMutate: () => {},
});

export default function Page() {
  const [editing, setEditing] = useState<Draft | null>(null);
  const [draftQuery, setDraftQuery] = useState(0);
  const {
    data: drafts,
    error: draftsError,
    isLoading: draftsLoading,
    mutate: draftMutate,
  } = useSWR(["/api/draft", draftQuery], ([url, query]) =>
    fetch("/api/draft?page=" + query, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.drafts as Draft[])
  );

  return (
    <WorkspaceContext.Provider
      value={{
        draftMutate: draftMutate,
        editing: editing,
        setEditing: setEditing,
        reloadHistory: () => {
          console.log(1);
        },
      }}
    >
      <div className="flex h-full w-full flex-row text-black overflow-y-hidden">
        <Toaster />
        <Input />
        <Desk />
        <History drafts={drafts ?? []} />
      </div>
    </WorkspaceContext.Provider>
  );
}
