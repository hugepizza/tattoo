"use client";
export default function page() {
  return (
    <div className="flex grow w-full h-full justify-center items-center">
      <div className="card shadow-lg p-7 space-y-4 items-center">
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="128px"
          height="128px"
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
        <h1>{"Come back soon! We'll be here."}</h1>
        <button className="btn btn-neutral">Sign out</button>
      </div>
    </div>
  );
}
