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

function route(d,color,active=false){ return `${stroke(d,"#1e354b",17)}${stroke(d,active?color:"#7293a9",active?7:4,active?'':'stroke-opacity=".86"')}${active?stroke(d,color,2,'stroke-dasharray="4 13"'):""}`; }
function tab(x,y,name,role,color,active=false){
 return `<path d="M${x} ${y+5}l22 -12h248l26 26-20 22H${x+20}Z" fill="${active?"#263452":"#142332"}" stroke="${color}" stroke-width="${active?4:2}"/>
 ${stroke(`M${x-20} ${y+26}h31`,color,8)}${tag(x+23,y+14,role,color,12)}${text(x+23,y+37,20,700,name)}${stroke(`M${x+265} ${y+14}l14 10-14 10`,color,3)}`;
}
function mobileTab(x,y,name,role,color){
 return `<path d="M${x} ${y+4}l13 -6h145l19 17-13 21H${x+12}Z" fill="#142332" stroke="${color}" stroke-width="2"/>
 ${stroke(`M${x-12} ${y+18}h19`,color,6)}${tag(x+12,y+12,role,color,9)}${text(x+12,y+32,15,700,name)}${stroke(`M${x+153} ${y+12}l9 7-9 7`,color,2)}`;
}
function station(x,y,active,showLabel=true){
 return `<g transform="translate(${x} ${y})"><path d="M30 25 102 -5 183 16 210 74 184 154 103 187 27 152 0 86Z" fill="#101c2f" stroke="${C.lavender}" stroke-width="5"/>
 <path d="M30 25 102 -5 183 16 151 51 71 63Z" fill="#243252"/><path d="M8 83 73 65 70 142 26 152Z" fill="#3d4c76"/><path d="M184 16 210 74 184 154 143 139 151 51Z" fill="#1c2b4d"/>
 <path d="M66 68 150 51 143 139 71 145Z" fill="#070f1c" stroke="#cbbcff" stroke-width="3"/>${stroke("M79 104 98 121 132 82",active?C.mint:C.lavender,8)}
 ${stroke("M104 -20v-22M18 75h-24M206 81h24",C.lavender,7)}${stroke("M4 161 100 206 210 161","#586f9d",3)}${showLabel?tag(8,227,"SECUREAGENT / POLICY BOUNDARY",C.lavender,11):""}</g>`;
}

function desktop(selected){
 const paths=[ ["M342 615 449 615 504 336 840 336",C.mint], ["M342 615 482 615 566 479 871 479",C.amber], ["M342 615 524 615 618 673 907 673",C.lavender], ["M342 615 493 615 570 769 620 769",C.blue] ];
 const bg=`<path d="M0 316 361 260 461 288 328 754 0 802Z" fill="#102034"/>${stroke("M0 345 298 286 436 301","#27629b",3)}<path d="M1080 0 1440 0 1440 734 1328 797 1160 575Z" fill="#101b30"/>${stroke("M1190 0 1440 0 1440 626","#253b5c",3)}`;
 const head=`${tag(76,69,"BH / PORTFOLIO",C.blue,15)}${tag(1152,69,"ART STUDY 02 / STATIC",C.muted,13)}${stroke("M76 86H1364","#335270",2)}${text(72,173,72,760,"Brandon Hann",'letter-spacing="-5"')}${text(77,218,25,480,"Software engineering with a curious edge.")}${tag(79,258,"CYBERSECURITY  /  AI SYSTEMS  /  PLAYFUL EXPERIMENTS",C.muted,13)}`;
 const field=`<path d="M52 298 418 277 1390 293 1362 536 1404 787 1261 849 42 846Z" fill="${C.field}" stroke="#315174" stroke-width="3"/>${stroke("M52 298 418 277 1390 293",C.blue,6)}${stroke("M380 297 283 843M1064 292 1118 849","#28425b",2)}`;
 const source=`<path d="M80 547 310 529 352 559 332 692 95 713 61 681Z" fill="#1768b3" stroke="#a7d6ff" stroke-width="5"/><path d="M80 547 310 529 352 559 118 584Z" fill="#4ca9ff"/><path d="M118 584 352 559 332 692 95 713Z" fill="#122a48"/>${tag(109,616,"BH / 00",C.blue,13)}${text(106,661,44,800,"BUILD",'letter-spacing="2"')}${tag(109,691,"CURIOSITY → SYSTEMS",C.muted,10)}${use("relay",264,610,106,128)}`;
 const destinations=`${tab(840,305,"Mapetite","01 / DATA VALIDATION",C.mint)}${tab(871,448,"Rivet","02 / BACKEND TRUST",C.amber)}${tab(620,738,"ODDWORKS","04 / SERVER STATE",C.blue)}`;
 const focus=selected?`${use("packet",823,639,60,47)}${tag(574,646,"PROPOSED ACTION",C.lavender,12)}${tag(1130,603,"CHECK BEFORE EXECUTE",C.lavender,12)}${stroke("M1163 652 1258 652 1288 618",C.mint,4)}${stroke("M1163 678 1258 678 1288 713",C.amber,4)}${tag(1270,609,"ALLOW",C.mint,11)}${tag(1270,733,"DENY",C.amber,11)}${text(77,801,16,600,"A boundary you can inspect before an action runs.")}`:`${text(77,801,16,600,"Follow a route. Meet the decision behind the work.")}`;
 const foot=`${tag(76,882,"CONCEPTUAL MAP  ·  NOT A LIVE PIPELINE",C.muted,11)}${tag(1090,882,"PROJECTS ↗   RÉSUMÉ ↗",C.blue,12)}`;
 return svg(1440,900,selected?"Living Signal Workshop selected SecureAgent art study":"Living Signal Workshop idle art study",bg+head+field+paths.map(([d,c],i)=>route(d,c,selected&&i===2)).join("")+source+destinations+station(905,568,selected)+focus+foot);
}

function mobile(){
 const bg=`<path d="M0 233 390 192 390 780 0 816Z" fill="#101e31"/><path d="M22 242 350 210 378 230 370 771 18 792Z" fill="${C.field}" stroke="#315174" stroke-width="3"/>${stroke("M22 242 350 210 378 230",C.blue,5)}`;
 const head=`${tag(24,39,"BH / PORTFOLIO",C.blue,11)}${tag(250,39,"ART STUDY 02",C.muted,10)}${stroke("M24 52H366","#335270",1)}${text(22,108,44,760,"Brandon Hann",'letter-spacing="-3"')}${text(24,143,17,500,"Software engineering with a curious edge.")}${tag(24,173,"SECURITY / AI / EXPERIMENTS",C.muted,10)}${text(24,207,16,650,"Discover the decisions behind the work.")}`;
 const traces=route("M118 405 145 405 170 301 186 301",C.mint)+route("M118 405 153 405 171 385 186 385",C.amber)+route("M118 405 143 405 164 546 181 546",C.lavender)+route("M118 405 139 405 166 672 186 672",C.blue);
 const source=`<path d="M26 369 106 358 126 378 116 452 31 462 17 446Z" fill="#1768b3" stroke="#a7d6ff" stroke-width="3"/><path d="M31 388 125 379 116 452 31 462Z" fill="#142a46"/>${tag(35,410,"BH / 00",C.blue,9)}${text(35,438,21,800,"BUILD")}${use("relay",91,429,69,83)}`;
 const places=`${mobileTab(188,271,"Mapetite","01 / VALIDATE",C.mint)}${mobileTab(188,355,"Rivet","02 / AUTHORIZE",C.amber)}${mobileTab(188,641,"ODDWORKS","04 / STATE",C.blue)}`;
 const sec=`<g transform="translate(180 494) scale(.55)">${station(0,0,false,false)}</g>${tag(193,612,"03 / SECUREAGENT",C.lavender,9)}${text(191,633,13,700,"Policy before action")}`;
 return svg(390,844,"Living Signal Workshop mobile idle art study",bg+head+traces+source+places+sec+tag(24,760,"ILLUSTRATIVE / NOT A LIVE PIPELINE",C.muted,9)+tag(24,830,"PROJECTS ↗     RÉSUMÉ ↗",C.blue,11));
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

for (const [name,art] of Object.entries({"desktop-idle.svg":desktop(false),"desktop-secureagent.svg":desktop(true),"mobile-idle.svg":mobile(),"relay-character-sheet.svg":sheet()})) writeFileSync(new URL(name,import.meta.url),art);
