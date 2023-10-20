"use client";
import { useSession } from "next-auth/react";

export default function TopBar() {
  const session = useSession();
  return (
    <div className="navbar bg-white border-solid border-b-[1px] border-b-slate-300">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-black no-animation">
          AI - TATTOO
        </a>
      </div>
      <div className="flex-none">
        <label tabIndex={0} className="btn btn-ghost text-black">
          <a>Pricing</a>
        </label>

        {session.data?.user?.image ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={session.data?.user?.image} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Account
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a href="/api/auth/signout">Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <a className="btn btn-neutral" href="/api/auth/signin">
            Signin
          </a>
        )}
      </div>
    </div>
  );
}
