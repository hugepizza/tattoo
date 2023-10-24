"use client";
import { createContext, useState } from "react";
import Input from "./Input";
import History from "./History";
import useSWR from "swr";
import Desk from "./Desk";
import { Toaster } from "react-hot-toast";
import { Imagine } from "../api/imagine/route";
import { EditingItem, WorkspaceContext } from "./context";

export default function Page() {
  const [editing, setEditing] = useState<EditingItem>(null);
  const [draftQuery, setDraftQuery] = useState(0);
  const [tattooQuery, setTattooQuery] = useState(0);
  const [inProgressImage, setInProgressImage] = useState("");

  const {
    data: drafts,
    error: draftsError,
    isLoading: draftsLoading,
    mutate: draftMutate,
  } = useSWR(["/api/imagine/draft"], ([url]) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.imagine as Imagine[])
  );
  const {
    data: tattoos,
    error: tattoosError,
    isLoading: tattoosLoading,
    mutate: tattooMutate,
  } = useSWR(["/api/imagine/tattoo"], ([url]) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.imagine as Imagine[])
  );

  return (
    <WorkspaceContext.Provider
      value={{
        editing,
        setEditing,
        inProgressImage,
        setInProgressImage,
        tattoos,
        drafts,
        tattooMutate,
        draftMutate,
        reloadHistory: () => {
          console.log(1);
        },
      }}
    >
      <div className="flex h-full w-full flex-row text-black overflow-y-hidden">
        <Toaster />
        <Input />
        <Desk />
        <History />
      </div>
    </WorkspaceContext.Provider>
  );
}
