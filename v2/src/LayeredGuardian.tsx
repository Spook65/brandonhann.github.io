import { memo } from "react";
import guardianSheet from "./assets/guardian-organic-sheet.png";
import cavityArt from "./assets/mouth-cavity-organic.jpg";

type Props = {
  className: string;
  progress: number;
  alert: boolean;
  aperture?: number;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Registration-locked two-part art; final independent tooth and tissue paint is pending. */
export const LayeredGuardian = memo(function LayeredGuardian({
  className,
  progress,
  alert,
  aperture = 0,
}: Props) {
  const p = clamp(progress || (alert ? 0.045 : 0));
  const opening = clamp(aperture);
  const lift = 155 * (1 - p);
  const leftEnd = 1000 - lift;
  const rightEnd = 1012 - lift;
  const leftTissue = `M183 910Q133 931 149 ${leftEnd.toFixed(1)}Q174 ${(leftEnd + 55).toFixed(1)} 227 ${(leftEnd + 106).toFixed(1)}L246 ${(leftEnd + 96).toFixed(1)}Q196 ${(leftEnd + 31).toFixed(1)} 197 910Z`;
  const rightTissue = `M839 909Q892 940 874 ${rightEnd.toFixed(1)}Q849 ${(rightEnd + 56).toFixed(1)} 793 ${(rightEnd + 101).toFixed(1)}L775 ${(rightEnd + 90).toFixed(1)}Q829 ${(rightEnd + 22).toFixed(1)} 823 909Z`;
  const cheekDrop = 32 * p;
  const leftCheek = `M188 884Q225 ${931 + cheekDrop} 278 ${965 + cheekDrop * 0.5}Q250 ${1007 + cheekDrop} 218 ${1051 + cheekDrop}Q182 ${1001 + cheekDrop * 0.55} 188 884Z`;
  const rightCheek = `M838 884Q799 ${930 + cheekDrop} 746 ${968 + cheekDrop * 0.5}Q778 ${1008 + cheekDrop} 807 ${1052 + cheekDrop}Q844 ${1000 + cheekDrop * 0.55} 838 884Z`;

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1024 1536"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        data-jaw-progress={p.toFixed(3)}
      >
        <defs>
          <radialGradient id="guardian-back" cx="50%" cy="46%" r="58%">
            <stop stopColor="#42252a" />
            <stop offset=".7" stopColor="#190e14" />
            <stop offset="1" stopColor="#080a0d" />
          </radialGradient>
          <clipPath id="upper-art-clip">
            <path d="M0 0H1024V972Q889 962 807 940Q729 990 516 992Q298 990 219 937Q113 965 0 974Z" />
          </clipPath>
          <clipPath id="upper-teeth-clip">
            <path d="M225 888Q512 850 799 888L806 996Q512 1002 218 996Z" />
          </clipPath>
          <clipPath id="jaw-art-clip">
            <path d="M0 966Q106 961 175 964Q276 1017 330 1085Q520 1127 692 1080Q752 1011 851 968Q953 967 1024 965V1536H0Z" />
          </clipPath>
          <clipPath id="lower-teeth-clip">
            <path d="M220 1020Q512 997 803 1020L810 1165Q512 1190 214 1165Z" />
          </clipPath>
          <clipPath id="cavity-art-clip">
            <path d="M202 897Q515 835 822 898L846 1190Q688 1359 516 1368Q323 1353 181 1190Z" />
          </clipPath>
          <clipPath id="tissue-art-clip">
            <path d={leftTissue} />
            <path d={rightTissue} />
          </clipPath>
          <linearGradient id="cavity-edge" x2="0" y2="1">
            <stop stopColor="#10080d" stopOpacity=".9" />
            <stop offset=".5" stopColor="#6f3038" stopOpacity="0" />
            <stop offset="1" stopColor="#10080d" stopOpacity=".9" />
          </linearGradient>
          <radialGradient id="inner-light">
            <stop stopColor="#dda967" stopOpacity=".7" />
            <stop offset=".38" stopColor="#964d39" stopOpacity=".22" />
            <stop offset="1" stopColor="#31151b" stopOpacity="0" />
          </radialGradient>
          <mask id="guardian-background-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
            <rect width="1024" height="1536" fill="white" />
            <path d="M202 897Q515 835 822 898L846 1190Q688 1359 516 1368Q323 1353 181 1190Z" fill="black" opacity={opening} />
          </mask>
        </defs>
        <rect width="1024" height="1536" fill="url(#guardian-back)" mask="url(#guardian-background-mask)" />
        <g data-layer="mouth-cavity" opacity={1 - opening}>
          <path
            d="M202 897Q515 835 822 898L846 1190Q688 1359 516 1368Q323 1353 181 1190Z"
            fill="#16080c"
            stroke="#10080c"
            strokeWidth="26"
          />
          <image
            href={cavityArt}
            x="177"
            y="862"
            width="670"
            height="520"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#cavity-art-clip)"
          />
          <path
            d="M202 897Q515 835 822 898L846 1190Q688 1359 516 1368Q323 1353 181 1190Z"
            fill="url(#cavity-edge)"
            opacity={0.45 + 0.25 * p}
          />
          <ellipse cx="512" cy="1082" rx="195" ry="78" fill="url(#inner-light)" opacity={Math.max(0, (p - 0.2) * 0.8)} />
        </g>
        <g data-layer="side-tissue">
          <path d={leftTissue} fill="#3a1820" stroke="#130a0d" strokeWidth="16" />
          <path d={rightTissue} fill="#3a1820" stroke="#130a0d" strokeWidth="16" />
          <image
            href={cavityArt}
            x="0"
            y="390"
            width="1024"
            height="1000"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#tissue-art-clip)"
          />
          <g data-layer="left-rod">
            <path d={`M183 910Q153 948 163 ${leftEnd.toFixed(1)}Q183 ${(leftEnd + 48).toFixed(1)} 227 ${(leftEnd + 96).toFixed(1)}`} fill="none" stroke="#a87870" strokeOpacity=".55" strokeWidth="7" />
          </g>
          <g data-layer="right-rod">
            <path d={`M839 909Q868 946 858 ${rightEnd.toFixed(1)}Q830 ${(rightEnd + 52).toFixed(1)} 793 ${(rightEnd + 94).toFixed(1)}`} fill="none" stroke="#a87870" strokeOpacity=".55" strokeWidth="7" />
          </g>
        </g>
        <g data-layer="upper-face">
          <image href={guardianSheet} width="1024" height="1536" clipPath="url(#upper-art-clip)" />
          <g data-layer="upper-teeth">
            <image href={guardianSheet} width="1024" height="1536" clipPath="url(#upper-teeth-clip)" />
          </g>
          <path d="M236 911Q512 878 788 911" fill="none" stroke="#180b0e" strokeWidth="12" strokeOpacity={0.22 + 0.34 * p} />
        </g>
        <g data-layer="cheek-tension" opacity={0.32 + 0.5 * p}>
          <path d={leftCheek} fill="#34181e" stroke="#180b10" strokeWidth="13" />
          <path d={rightCheek} fill="#34181e" stroke="#180b10" strokeWidth="13" />
          <path d={`M214 917Q236 ${961 + cheekDrop} 251 ${1001 + cheekDrop}`} fill="none" stroke="#a36d66" strokeOpacity=".52" strokeWidth="5" />
          <path d={`M812 917Q786 ${962 + cheekDrop} 775 ${1002 + cheekDrop}`} fill="none" stroke="#a36d66" strokeOpacity=".52" strokeWidth="5" />
        </g>
        <g data-layer="lower-jaw" transform={`translate(0 ${(-lift).toFixed(1)}) translate(512 970) scale(1 ${(1 + 0.025 * p).toFixed(3)}) translate(-512 -970)`}>
          <image href={guardianSheet} width="1024" height="1536" clipPath="url(#jaw-art-clip)" />
          <g data-layer="lower-teeth">
            <image href={guardianSheet} width="1024" height="1536" clipPath="url(#lower-teeth-clip)" />
          </g>
          <path d="M242 1132Q512 1092 785 1132" fill="none" stroke="#1b0b0f" strokeWidth="13" strokeOpacity={0.18 + 0.25 * p} />
        </g>
      </svg>
    </div>
  );
});
