// Static art studies only. Not imported by the portfolio or its Vite build.
import { writeFileSync } from "node:fs";

const C = { bg: "#080e18", field: "#0d1a2b", ink: "#eef4f8", blue: "#54a8ff", mint: "#9be8cf", amber: "#ffc779", lavender: "#c3adff", muted: "#a9b8c8" };
const text = (x,y,size,weight,value,attrs="") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" ${attrs}>${value}</text>`;
const tag = (x,y,value,color=C.muted,size=12) => text(x,y,size,500,value,`class="mono" fill="${color}" style="fill:${color}"`);
const stroke = (d,color,width=4,attrs="") => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="square" stroke-linejoin="bevel" ${attrs}/>`;
const use = (id,x,y,w,h,attrs="") => `<use href="#${id}" x="${x}" y="${y}" width="${w}" height="${h}" ${attrs}/>`;
const defs = `<defs><style><![CDATA[
@font-face{font-family:Sora;src:url('../../public/fonts/sora-latin-wght-normal.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:Plex;src:url('../../public/fonts/ibm-plex-mono-latin-500-normal.woff2') format('woff2');font-weight:500}
text{font-family:Sora,Arial,sans-serif;fill:${C.ink}}.mono{font-family:Plex,monospace;letter-spacing:1.1px}
]]></style><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9 9 0" stroke="#fff" stroke-opacity=".027"/></pattern>
<symbol id="relay" viewBox="0 0 120 144">
 <path d="M27 38 54 10 86 21 103 54 97 105 79 128 34 127 14 89Z" fill="#081522" stroke="#d8ecf5" stroke-width="5" stroke-linejoin="round"/>
 <path d="M30 38 54 11 86 21 75 51 37 57Z" fill="${C.blue}"/><path d="M86 21 103 54 92 91 75 51Z" fill="#286bb7"/>
 <path d="M37 57 76 51 91 70 74 91 35 83Z" fill="#f4e8d1"/><path d="M34 64 76 54 85 64 67 73 33 76Z" fill="#0a1929"/>
 <path d="M44 64 57 61M70 58l4-1" stroke="${C.mint}" stroke-width="5" stroke-linecap="round"/>
 <path d="M22 82 34 77 72 89 89 77 100 91 91 111 73 127 37 126 17 103Z" fill="#3c82cf"/>
 <path d="M17 103 37 126 57 125 37 87Z" fill="#27649f"/><path d="M72 89 91 78 102 91 91 111 73 127 58 125Z" fill="#16517c"/>
 <path d="M32 85 84 102" stroke="${C.amber}" stroke-width="6"/>
 <path d="M70 98 101 92 106 115 78 122Z" fill="#f5af5e" stroke="#0b1a28" stroke-width="4"/>
 <path d="M79 100 101 96M82 108 103 104" stroke="#533a36" stroke-width="2"/>
 <path d="M35 126 29 139 51 139 56 127M67 126 68 139 91 139 79 126" fill="#dfeaf0" stroke="#081522" stroke-width="4" stroke-linejoin="round"/>
 <path d="M58 10 67 0 79 8" fill="none" stroke="${C.mint}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="relay-side" viewBox="0 0 120 144">
 <path d="M18 40 46 14 82 17 110 50 99 91 81 128 34 125 10 89Z" fill="#081522" stroke="#d8ecf5" stroke-width="5" stroke-linejoin="round"/>
 <path d="M19 40 46 14 82 17 106 50 58 60 29 56Z" fill="${C.blue}"/><path d="M82 17 106 50 98 72 61 58Z" fill="#286bb7"/>
 <path d="M58 61 104 51 108 70 83 90 45 80Z" fill="#f4e8d1"/><path d="M63 64 105 56 109 66 75 75 56 74Z" fill="#0a1929"/>
 <path d="M80 63 97 61" stroke="${C.mint}" stroke-width="5" stroke-linecap="round"/>
 <path d="M17 79 44 80 84 91 97 83 108 94 86 125 32 123 12 102Z" fill="#3c82cf"/><path d="M12 102 32 123 52 123 38 86Z" fill="#27649f"/>
 <path d="M23 84 93 105" stroke="${C.amber}" stroke-width="6"/><path d="M68 100 98 94 104 117 76 123Z" fill="#f5af5e" stroke="#0b1a28" stroke-width="4"/>
 <path d="M42 123 23 139 48 139 60 126M70 124 89 140 109 139 82 122" fill="#dfeaf0" stroke="#081522" stroke-width="4" stroke-linejoin="round"/>
 <path d="M50 13 58 2 72 10" fill="none" stroke="${C.mint}" stroke-width="5" stroke-linecap="round"/>
</symbol>
<symbol id="relay-denied" viewBox="0 0 120 144">
 <path d="M24 42 52 12 83 24 102 61 93 105 74 128 34 126 15 92Z" fill="#081522" stroke="#d8ecf5" stroke-width="5" stroke-linejoin="round"/>
 <path d="M24 42 52 12 83 24 75 55 36 60Z" fill="${C.blue}"/><path d="M83 24 102 61 93 91 74 55Z" fill="#286bb7"/>
 <path d="M36 59 75 55 91 75 72 92 34 83Z" fill="#f4e8d1"/><path d="M35 66 75 58 87 70 69 78 34 78Z" fill="#0a1929"/>
 <path d="M43 68 55 71M70 68 77 72" stroke="${C.amber}" stroke-width="5" stroke-linecap="round"/>
 <path d="M20 83 34 79 72 91 87 79 100 92 90 111 75 127 35 125 17 104Z" fill="#3c82cf"/>
 <path d="M19 85 2 67 8 57 29 70" fill="none" stroke="#d8ecf5" stroke-width="9" stroke-linecap="round"/>
 <path d="M30 88 83 105" stroke="${C.amber}" stroke-width="6"/><path d="M68 100 100 94 104 117 76 123Z" fill="#f5af5e" stroke="#0b1a28" stroke-width="4"/>
 <path d="M35 126 28 139 50 139 56 127M68 126 67 139 90 139 79 126" fill="#dfeaf0" stroke="#081522" stroke-width="4" stroke-linejoin="round"/>
 <path d="M56 12 66 1 79 10" fill="none" stroke="${C.mint}" stroke-width="5" stroke-linecap="round"/>
</symbol>
<symbol id="packet" viewBox="0 0 72 54"><path d="M6 13 36 2 66 13 66 42 36 53 6 42Z" fill="${C.amber}" stroke="#091724" stroke-width="5" stroke-linejoin="round"/><path d="M6 13 36 25 66 13M36 25V53" fill="none" stroke="#754f32" stroke-width="3"/></symbol>
</defs>`;
const svg = (w,h,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${defs}<rect width="${w}" height="${h}" fill="${C.bg}"/><rect width="${w}" height="${h}" fill="url(#hatch)"/>${body}</svg>`;

function neutralRoute(d,id){ return `${stroke(d,"#1e354b",17,`data-route="${id}" data-layer="route-bed"`)}${stroke(d,"#7293a9",4,`stroke-opacity=".86" data-route="${id}" data-layer="neutral-route"`)}`; }
function selectedRoute(d,id){ return `${stroke(d,C.lavender,9,`data-route="${id}" data-layer="selected-route"`)}${stroke(d,"#f4edff",2,`stroke-dasharray="4 13" data-route="${id}" data-layer="selected-detail"`)}`; }
function tab(x,y,name,role,color,active=false){
 return `<path d="M${x} ${y+5}l22 -12h248l26 26-20 22H${x+20}Z" fill="${active?"#263452":"#142332"}" stroke="${color}" stroke-width="${active?4:2}"/>
 ${stroke(`M${x-20} ${y+26}h31`,color,8)}${tag(x+23,y+14,role,color,12)}${text(x+23,y+37,20,700,name)}${stroke(`M${x+265} ${y+14}l14 10-14 10`,color,3)}`;
}
function station(x,y,decision=null,scale=1){
 const symbol = decision === "allow"
  ? `${stroke("M62 70v58M151 57v82",C.mint,7)}${stroke("M76 102h48m-13-12 13 12-13 12",C.mint,7)}`
  : decision === "deny"
  ? `${stroke("M69 67v66M143 61v75",C.amber,8)}${stroke("M75 71 136 129M136 71 75 129",C.amber,7)}`
  : `${stroke("M77 66v70M137 60v78",C.lavender,6)}${text(94,111,33,700,"?",`style="fill:${C.lavender}"`)}`;
 return `<g data-station="secureagent" transform="translate(${x} ${y}) scale(${scale})">
 <path d="M30 25 102 -5 183 16 210 74 184 154 103 187 27 152 0 86Z" fill="#101c2f" stroke="${C.lavender}" stroke-width="5"/>
 <path d="M30 25 102 -5 183 16 151 51 71 63Z" fill="#243252"/><path d="M8 83 73 65 70 142 26 152Z" fill="#3d4c76"/><path d="M184 16 210 74 184 154 143 139 151 51Z" fill="#1c2b4d"/>
 <path d="M66 68 150 51 143 139 71 145Z" fill="#070f1c" stroke="#cbbcff" stroke-width="3"/>${symbol}
 ${stroke("M104 -20v-22M18 75h-24M206 81h24",C.lavender,7)}${stroke("M4 161 100 206 210 161","#586f9d",3)}</g>`;
}

const desktopPaths = [
 ["mapetite","M342 615 449 615 504 336 840 336"],
 ["rivet","M342 615 482 615 566 479 871 479"],
 ["secureagent","M342 615 524 615 618 673 935 673"],
 ["oddworks","M342 615 493 615 570 769 620 769"],
];
function desktop(state="idle"){
 const chosen=state!=="idle";
 const example=state==="result";
 const bg=`<path d="M0 316 361 260 461 288 328 754 0 802Z" fill="#102034"/>${stroke("M0 345 298 286 436 301","#27629b",3)}<path d="M1080 0 1440 0 1440 734 1328 797 1160 575Z" fill="#101b30"/>${stroke("M1190 0 1440 0 1440 626","#253b5c",3)}`;
 const head=`${tag(76,69,"BH / PORTFOLIO",C.blue,15)}${tag(1145,69,"STATIC ART REVIEW",C.muted,13)}${stroke("M76 86H1364","#335270",2)}${text(72,173,72,760,"Brandon Hann",'letter-spacing="-5"')}${text(77,218,25,480,"Software engineering with a curious edge.")}${text(79,255,17,450,"Choose a project. Its example runs only when you ask to try it.")}`;
 const field=`<path d="M52 298 418 277 1390 293 1362 536 1404 787 1261 849 42 846Z" fill="${C.field}" stroke="#315174" stroke-width="3"/>${stroke("M52 298 418 277 1390 293",C.blue,6)}${stroke("M380 297 283 843M1064 292 1118 849","#28425b",2)}`;
 const source=`<path d="M80 547 310 529 352 559 332 692 95 713 61 681Z" fill="#1768b3" stroke="#a7d6ff" stroke-width="5"/><path d="M80 547 310 529 352 559 118 584Z" fill="#4ca9ff"/><path d="M118 584 352 559 332 692 95 713Z" fill="#122a48"/>${tag(109,611,"BRANDON'S PROJECTS",C.blue,12)}${text(106,661,44,800,"BUILD",'letter-spacing="2"')}${tag(109,691,"CHOOSE A ROUTE",C.muted,12)}`;
 const destinations=`${tab(840,305,"Mapetite","01 / DATA VALIDATION",C.mint)}${tab(871,448,"Rivet","02 / BACKEND TRUST",C.amber)}${tab(620,738,"ODDWORKS","04 / SERVER STATE",C.blue)}`;
 const network=desktopPaths.map(([id,path])=>neutralRoute(path,id)).join("");
 const selected=chosen?selectedRoute(desktopPaths[2][1],"secureagent"):"";
 const stationaryCourier=use("relay",275,607,100,120);
 const idle=`${stationaryCourier}${tag(928,542,"SECUREAGENT LAB",C.lavender,13)}${tag(1120,630,"POLICY BOUNDARY",C.lavender,13)}${text(77,801,16,600,"Hover or focus for a quick insight. Select to explore a project.")}`;
 const selectedPanel=`${stationaryCourier}${tag(924,542,"SECUREAGENT LAB / SELECTED",C.lavender,13)}${text(615,570,17,620,"Policy before simulated tool use.")}
 <path d="M1180 614h185l16 17-16 40h-185Z" fill="${C.blue}"/>${text(1195,650,16,740,"Try an example →",'style="fill:#081522"')}
 ${text(1184,718,15,600,"Read case study ↗",`style="fill:${C.blue}"`)}${text(77,801,16,600,"Selected project. The courier waits until you try an example.")}`;
 const result=`${use("relay-side",716,536,100,120)}${use("packet",790,651,58,44,`data-packet="secureagent"`)}${tag(688,522,"REQUEST COURIER",C.muted,12)}${tag(924,542,"SECUREAGENT LAB / EXAMPLE",C.lavender,13)}
 ${stroke("M1167 659h61",C.amber,5)}${stroke("M1228 635v48",C.amber,8)}<path d="M1251 623h111l18 17v65h-129Z" fill="#402e2c" stroke="${C.amber}" stroke-width="3"/>${text(1264,663,25,760,"DENY",`style="fill:${C.amber}"`)}${tag(1265,687,"NO TOOL STEP",C.ink,10)}
 ${tag(1117,589,"ILLUSTRATIVE REQUEST",C.amber,11)}${text(77,801,16,600,"Example request denied before simulated execution. Reset or read the case study.")}`;
 const scene=state==="idle"?idle:state==="selected"?selectedPanel:result;
 const foot=`${tag(76,882,"FOUR INDEPENDENT PROJECTS · NOT A LIVE PIPELINE",C.muted,11)}${tag(1050,882,chosen?"SECUREAGENT CASE STUDY ↗":"CHOOSE A PROJECT ↗",C.blue,12)}`;
 return svg(1440,900,`Living Signal desktop ${state} art study`,bg+head+field+network+selected+source+destinations+station(905,568,example?"deny":null)+scene+foot);
}

function mobileSelector(decision){
 const items=[[24,249,"Mapetite","01",C.mint],[202,249,"Rivet","02",C.amber],[24,313,"SecureAgent Lab","03",C.lavender],[202,313,"ODDWORKS","04",C.blue]];
 return items.map(([x,y,name,num,color])=>{
  const active=decision && name==="SecureAgent Lab";
  return `<path d="M${x} ${y+5}l14 -5h139l11 12v44h-164Z" fill="${active?"#273553":"#152538"}" stroke="${color}" stroke-width="${active?3:2}"/>
  ${tag(x+12,y+23,num,color,14)}${text(x+12,y+45,16.5,700,name)}${active?stroke(`M${x+143} ${y+19}l9 8-9 8`,color,3):""}`;
 }).join("");
}
function mobile(state="idle"){
 const chosen=state!=="idle";
 const example=state==="result";
 const height=example?844:chosen?800:760;
 const bottom=example?783:chosen?716:684;
 const bg=`<path d="M0 388 350 377 390 405 372 ${bottom} 18 ${bottom-9}Z" fill="#102039" stroke="#315174" stroke-width="3"/>${stroke("M0 388 350 377 390 405",C.blue,5)}`;
 const head=`${tag(24,35,"BH / PORTFOLIO",C.blue,13)}${stroke("M24 48H366","#335270",1)}${text(22,95,40,760,"Brandon Hann",'letter-spacing="-3"')}${text(24,125,17,500,"Curious about software engineering.")}
 <path d="M24 151h134l15 17-15 37H24Z" fill="${C.blue}"/>${text(39,184,17,700,"Projects ↗",'style="fill:#061522"')}
 ${text(24,230,18,650,example?"Example request: blocked by policy.":chosen?"SecureAgent Lab selected.":"Choose a project to inspect.")}${mobileSelector(chosen)}`;
 const source=`<path d="M28 423 117 410 139 431 128 494 31 503 19 486Z" fill="#1768b3" stroke="#a7d6ff" stroke-width="3"/><path d="M31 444 138 432 128 494 31 503Z" fill="#142a46"/>${text(38,467,22,800,"BUILD")}${tag(39,487,"PROJECTS",C.blue,12)}`;
 const foot=example?`${tag(24,797,"ILLUSTRATIVE · OFFLINE EXAMPLE",C.muted,13)}${text(24,830,17,650,"Read SecureAgent Lab case study ↗",`style="fill:${C.blue}"`)}`:
  chosen?`${tag(24,750,"ILLUSTRATIVE · NO LIVE PIPELINE",C.muted,13)}${text(24,785,17,650,"Read SecureAgent Lab case study ↗",`style="fill:${C.blue}"`)}`:
  `${tag(24,712,"ILLUSTRATIVE · NO LIVE PIPELINE",C.muted,13)}${text(24,748,17,650,"Open actual project case studies ↗",`style="fill:${C.blue}"`)}`;
 if(state==="idle"){
  const scene=`${source}${use("relay",205,455,118,142)}${text(31,620,19,670,"Choose one of Brandon's projects.")}${text(31,651,16,450,"The courier waits for an example request.")}`;
  return svg(390,height,"Living Signal mobile idle art study",bg+head+scene+foot);
 }
 if(state==="selected"){
  const scene=`${tag(32,423,"SECUREAGENT LAB / SELECTED",C.lavender,14)}${use("relay",56,449,102,122)}${tag(55,585,"COURIER WAITING",C.muted,13)}${station(201,439,null,.56)}
  ${text(29,617,17,620,"Policy before simulated tool use.")}
  <path d="M24 632h325l17 15-17 52H24Z" fill="${C.blue}"/>${text(40,672,18,740,"Try an illustrative request →",'style="fill:#081522"')}`;
  return svg(390,height,"Living Signal mobile selected art study",bg+head+scene+foot);
 }
 const path="M128 453 H153 V594 H207";
 const route=selectedRoute(path,"secureagent");
 const result=`<path d="M192 710h173l13 14-13 50H192Z" fill="#402e2c" stroke="${C.amber}" stroke-width="3"/>${stroke("M215 724v25",C.amber,6)}${text(233,738,20,750,"DENY",`style="fill:${C.amber}"`)}${text(207,760,15,550,"Tool step blocked")}`;
 const scene=`${route}${source}${tag(30,410,"1 / EXAMPLE REQUEST",C.blue,15)}${use("relay-side",29,509,98,118)}${tag(29,648,"2 / COURIER",C.muted,16)}${use("packet",129,511,48,36,`data-packet="secureagent"`)}${tag(190,543,"3 / POLICY CHECK",C.lavender,16)}${station(188,560,"deny",.60)}${tag(192,701,"4 / DECISION",C.amber,16)}${result}`;
 return svg(390,height,"Living Signal mobile result art study",bg+head+scene+foot);
}

function sheet(){
 const poses=[
  [75,"01 / THREE-QUARTER","Readable face + courier bag",use("relay",120,170,190,228)],
  [400,"02 / TRAVEL","Side profile + stride",`${use("relay-side",488,175,180,216)}${stroke("M440 386h70M564 386h80",C.blue,4)}`],
  [725,"03 / DELIVERY","Packet held forward",`${use("relay",778,170,188,225)}${use("packet",940,273,73,55)}${stroke("M943 312 910 319",C.amber,8)}`],
  [1050,"04 / POLICY RESPONSE","Denied: stop + turn back",`${use("relay-denied",1108,170,187,226)}${stroke("M1275 230v88",C.lavender,12)}${stroke("M1260 237 1275 220 1290 237",C.lavender,7)}`],
 ];
 const body=`${tag(74,72,"LIVING SIGNAL / RELAY CHARACTER STUDY",C.blue,16)}${text(73,145,44,750,"A courier for the boundary",'letter-spacing="-2"')}${text(76,183,18,460,"One silhouette: split cap, messenger strap, clear face direction, carried packet.")}${poses.map(([x,l,d,p])=>`<path d="M${x} 222h287l13 17v272h-300Z" fill="#132238" stroke="#2c506e" stroke-width="2"/>${p}${tag(x+18,451,l,C.blue,12)}${text(x+18,483,15,500,d)}`).join("")}${tag(76,579,"ACTUAL-SIZE CHECK / 64 PIXELS",C.mint,13)}${use("relay",88,606,64,77)}${use("relay",190,606,64,77)}${use("relay",292,606,64,77)}${tag(383,646,"Packet bag and blue cap remain identifiable at scene scale.",C.muted,14)}${stroke("M76 725H1360","#355675",2)}${tag(76,760,"CHARACTER RULES",C.blue,12)}${text(76,799,17,500,"Asymmetric blue cap  ·  warm packet bag  ·  mint eye line  ·  weighted boots")}${text(76,837,15,450,"Static review poses. Final motion and expressions require separate approval.")}`;
 return svg(1440,900,"Original relay character pose and silhouette sheet",body);
}

for (const [name,art] of Object.entries({
 "desktop-idle.svg":desktop(),
 "desktop-selected.svg":desktop("selected"),
 "desktop-result.svg":desktop("result"),
 "mobile-idle.svg":mobile(),
 "mobile-selected.svg":mobile("selected"),
 "mobile-result.svg":mobile("result"),
 "relay-character-sheet.svg":sheet(),
})) writeFileSync(new URL(name,import.meta.url),art);
