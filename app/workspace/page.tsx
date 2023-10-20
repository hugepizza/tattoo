"use client";
import { createContext, useState } from "react";
import Input from "./Input";
import History from "./History";
import useSWR from "swr";
import Desk from "./Desk";
import { Toaster } from "react-hot-toast";
import { Draft } from "../api/draft/route";
import { WorkspaceContext } from "./context";
import { Tattoo } from "../api/tattoo/route";

export default function Page() {
  const [editing, setEditing] = useState<Draft | null>(null);
  const [draftQuery, setDraftQuery] = useState(0);
  const [tattooQuery, setTattooQuery] = useState(0);
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

  const {
    data: tattoos,
    error: tattoosError,
    isLoading: tattoosLoading,
    mutate: tattooMutate,
  } = useSWR(["/api/tattoo", tattooQuery], ([url, query]) =>
    fetch("/api/tattoo?page=" + query, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.tattoos as Tattoo[])
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
        <History {...{ drafts, tattoos }} />
      </div>
    </WorkspaceContext.Provider>
  );
}
