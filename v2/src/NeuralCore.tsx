import { memo, useId } from "react";
import type { DestinationId } from "./data/domain";

const routes: Record<DestinationId, string> = {
  quest: "M720 635 C850 555 940 430 1120 286 S1260 180 1390 138",
  archives: "M720 635 C560 555 465 425 295 286 S160 180 50 132",
  arsenal: "M720 635 C570 670 395 645 150 555 L20 530",
  chronicles: "M720 635 C875 680 1050 645 1270 555 L1420 515",
  profile: "M720 635 C645 475 600 295 675 115 L700 0",
  signal: "M720 635 C800 465 840 290 775 115 L745 0",
};

export const NeuralCore = memo(function NeuralCore({
  className,
  selected,
}: {
  className?: string;
  selected?: DestinationId;
}) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      data-testid="neural-core-art"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="58%" r="75%">
          <stop stopColor="#4c292a" />
          <stop offset=".42" stopColor="#211b22" />
          <stop offset="1" stopColor="#070d11" />
        </radialGradient>
        <linearGradient id={`${id}-rib`} x2="1" y2="1">
          <stop stopColor="#526267" />
          <stop offset=".52" stopColor="#1a282e" />
          <stop offset="1" stopColor="#0a1319" />
        </linearGradient>
        <radialGradient id={`${id}-signal`}>
          <stop stopColor="#e5a95d" stopOpacity=".35" />
          <stop offset="1" stopColor="#e5a95d" stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-hatch`} width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(29)">
          <path d="M0 0v13" stroke="#9da7a0" strokeOpacity=".07" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="1440" height="900" fill={`url(#${id}-bg)`} />
      <rect width="1440" height="900" fill={`url(#${id}-hatch)`} />

      {/* Ribbed inner hull and control conduits share the Guardian's slate, amber, and cyan. */}
      <path d="M0 0h1440v205q-220 70-372 30-170-46-348-118-178 72-348 118Q220 275 0 205z" fill="#10191e" stroke="#5e6462" strokeWidth="10" />
      <path d="M0 900V120q130 30 220 130l96 650zM1440 900V120q-130 30-220 130l-96 650z" fill={`url(#${id}-rib)`} stroke="#788076" strokeWidth="10" />
      <path d="M80 900V220q105 12 181 91l61 589M1360 900V220q-105 12-181 91l-61 589" fill="none" stroke="#78b9bd" strokeOpacity=".46" strokeWidth="6" />
      <g fill="none" stroke="#6f7470" strokeWidth="16" opacity=".7">
        <path d="M0 160Q355 275 720 108q365 167 720 52" />
        <path d="M0 290Q355 392 720 213q365 179 720 77" />
        <path d="M0 440Q355 500 720 332q365 168 720 108" />
        <path d="M0 615Q355 620 720 468q365 152 720 147" />
      </g>
      <g fill="none" stroke="#2b4349" strokeWidth="5">
        <path d="M0 170Q355 282 720 116q365 166 720 54" />
        <path d="M0 300Q355 405 720 222q365 183 720 78" />
        <path d="M0 450Q355 515 720 345q365 170 720 105" />
        <path d="M0 625Q355 640 720 485q365 155 720 140" />
      </g>
      <path d="M0 850q360-125 720-90 360-35 720 90v50H0z" fill="#0b1419" stroke="#637171" strokeWidth="9" />
      <path d="M360 900q140-170 360-170t360 170" fill="#172329" stroke="#806c5b" strokeWidth="8" />
      <path d="M490 900q90-100 230-100t230 100" fill="#0a141a" stroke="#75bdc5" strokeOpacity=".55" strokeWidth="5" />

      {/* Branches physically originate behind the seated operator. */}
      <g fill="none" strokeLinecap="round">
        {Object.entries(routes).map(([route, d]) => (
          <g key={route} data-route={route}>
            <path d={d} stroke="#060b0e" strokeWidth="20" />
            <path d={d} stroke={selected === route ? "#e5a95d" : "#56848a"} strokeOpacity={selected === route ? ".95" : ".48"} strokeWidth={selected === route ? "6" : "4"} />
          </g>
        ))}
      </g>
      <g fill="#0a171b" stroke="#7a8b87" strokeWidth="5">
        <path d="M1080 232l55-29 55 29v62l-55 29-55-29zM250 232l55-29 55 29v62l-55 29-55-29z" />
        <path d="M108 513l42-22 42 22v52l-42 22-42-22zM1248 513l42-22 42 22v52l-42 22-42-22z" />
        <path d="M655 70l45-22 45 22v55l-45 22-45-22zM695 70l45-22 45 22v55l-45 22-45-22z" />
      </g>
      <g fill="#e5a95d" opacity=".88">
        <circle cx="1135" cy="262" r="9" /><circle cx="305" cy="262" r="9" />
        <circle cx="150" cy="539" r="8" /><circle cx="1290" cy="539" r="8" />
        <circle cx="700" cy="98" r="7" /><circle cx="740" cy="98" r="7" />
      </g>

      {/* Temporary back-view human operator; the control chair is part of the same hull. */}
      <ellipse cx="720" cy="739" rx="250" ry="155" fill={`url(#${id}-signal)`} />
      <path d="M622 610q98-50 196 0l40 157-30 93H612l-30-93z" fill="#10181d" stroke="#84918d" strokeWidth="8" />
      <path d="M630 645q90-40 180 0l-22 136H652z" fill="#2a3b40" stroke="#75bdc5" strokeOpacity=".75" strokeWidth="5" />
      <path d="M647 597q73-38 146 0l29 93-31 13-34-63-37 88-37-88-34 63-31-13z" fill="#28343a" stroke="#9c9888" strokeWidth="6" />
      <path d="M642 612q-38 26-74 98l-46 13M798 612q38 26 74 98l46 13" fill="none" stroke="#36454a" strokeWidth="35" strokeLinecap="round" />
      <path d="M642 612q-38 26-74 98l-46 13M798 612q38 26 74 98l46 13" fill="none" stroke="#aa9c83" strokeOpacity=".72" strokeWidth="5" strokeLinecap="round" />
      <path d="M682 587q-14-24-11-63 6-55 49-57 43 2 49 57 3 39-11 63z" fill="#a48568" stroke="#121b1f" strokeWidth="7" />
      <path d="M668 523q3-73 52-67 52-6 52 67-20-27-52-25-32-2-52 25z" fill="#0d151a" stroke="#63716e" strokeWidth="5" />
      <path d="M687 599q33 21 66 0" fill="none" stroke="#e5a95d" strokeOpacity=".7" strokeWidth="4" />
      <path d="M520 716q200-57 400 0l68 92q-260 98-536 0z" fill="#15242a" stroke="#847964" strokeWidth="7" />
      <path d="M550 723q170-36 340 0" fill="none" stroke="#75bdc5" strokeWidth="5" strokeOpacity=".7" />
    </svg>
  );
});
