"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function TopBar() {
  const session = useSession();

  return (
    <div className="navbar bg-white border-solid border-b-[1px] border-slate-100">
      <div className="flex-1">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="48px"
          height="48px"
          viewBox="0 0 510.000000 510.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,510.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path
              d="M2507 3802 c-22 -37 -183 -323 -360 -637 l-321 -570 343 -680 c188
-374 342 -684 341 -690 0 -5 -22 24 -48 65 -462 717 -980 1512 -995 1527 -15
14 -378 103 -370 90 7 -12 1256 -1573 1362 -1702 45 -55 85 -101 89 -103 7 -2
539 660 882 1098 63 80 213 269 333 420 121 151 223 280 228 285 4 6 -77 -11
-179 -36 l-187 -45 -228 -350 c-125 -192 -354 -547 -509 -789 -155 -242 -288
-447 -296 -455 -7 -8 142 296 332 677 l345 691 -357 636 c-196 350 -359 636
-362 636 -3 0 -22 -31 -43 -68z m310 -1561 c-75 -179 -164 -395 -199 -478 -56
-136 -78 -176 -78 -142 0 5 -68 173 -151 372 -84 199 -172 411 -196 470 l-43
108 186 337 c102 185 193 347 201 360 14 23 22 11 215 -338 l200 -363 -135
-326z"
            />
          </g>
        </svg>

        <Link
          className="btn btn-ghost normal-case text-xl text-black no-animation"
          href="/"
        >
          AI - TATTOO
        </Link>
      </div>
      <div className="flex-none">
        <label tabIndex={0} className="btn btn-ghost text-black">
          <Link href={"/workspace"}>Workspace</Link>
        </label>
        <label tabIndex={0} className="btn btn-ghost text-black">
          <Link href={"/pricing"}>Pricing</Link>
        </label>

        {session.data?.user?.image ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full">
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
                <a
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </a>
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
