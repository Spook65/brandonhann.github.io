"""Render-only SVG artboards for W.5. No application code or invented imagery."""
from base64 import b64encode
from html import escape
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
PHOTO = ROOT / 'public' / 'brandon-about.jpg'
INTER = ROOT / 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
MONO = ROOT / 'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'

portrait = Image.open(PHOTO).convert('RGB')
small = ImageOps.grayscale(portrait).resize((142, 190), Image.Resampling.LANCZOS)
dither = small.convert('1', dither=Image.Dither.FLOYDSTEINBERG).resize(portrait.size, Image.Resampling.NEAREST)
buffer = BytesIO()
dither.save(buffer, format='PNG', optimize=True)
mono_photo = ImageOps.grayscale(portrait)
mono_buffer = BytesIO()
mono_photo.save(mono_buffer, format='JPEG', quality=88)

def uri(data: bytes, mime: str) -> str:
    return f'data:{mime};base64,{b64encode(data).decode()}'

photo_uri = uri(PHOTO.read_bytes(), 'image/webp')
dither_uri = uri(buffer.getvalue(), 'image/png')
mono_uri = uri(mono_buffer.getvalue(), 'image/jpeg')
font_css = f"""
@font-face {{font-family:InterStudy;src:url('{uri(INTER.read_bytes(), 'font/woff2')}') format('woff2');font-weight:100 900;}}
@font-face {{font-family:MonoStudy;src:url('{uri(MONO.read_bytes(), 'font/woff2')}') format('woff2');font-weight:100 900;}}
text {{font-family:InterStudy,Arial,sans-serif;dominant-baseline:alphabetic;}}
.mono {{font-family:MonoStudy,monospace;}}
"""

def T(x, y, content, size=20, color='#121212', weight=400, cls='', extra=''):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}" class="{cls}" {extra}>{escape(content)}</text>'

def L(x1,y1,x2,y2,color='#111',width=1,extra=''):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" {extra}/>'

def R(x,y,w,h,fill,rx=0,extra=''):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" {extra}/>'

def I(x,y,w,h,src,extra=''):
    return f'<image x="{x}" y="{y}" width="{w}" height="{h}" href="{src}" preserveAspectRatio="xMidYMid slice" {extra}/>'

def svg(w,h,body,defs=''):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><style>{font_css}</style>{defs}</defs>{body}</svg>'''

def a_desktop(active):
    w,h=1440,900
    blue='#4058ff'; black='#111217'; pale='#f7f7f4'
    pieces=[R(0,0,w,h,pale), R(0,0,18,h,blue),L(72,93,1368,93,'#d4d6d5')]
    pieces += [T(72,58,'BH /',24,black,800),T(158,57,'BRANDON HANN',13,black,670,'mono'),
               T(1070,57,'PROJECTS',13,black,650,'mono'),T(1191,57,'ABOUT',13,black,650,'mono'),T(1283,57,'RÉSUMÉ ↗',13,black,650,'mono')]
    pieces += [T(73,175,'HELLO, I’M',16,blue,720,'mono'),
               T(62,320,'BRANDON',151,black,850,extra='letter-spacing="-11"'),
               T(62,465,'HANN.',151,black,850,extra='letter-spacing="-11"')]
    # An authored crop of the approved photograph, treated as image material.
    crop='M 878 128 C 1065 90 1298 147 1353 300 L 1353 686 C 1281 758 1127 786 932 750 C 841 696 797 581 811 410 C 820 280 824 179 878 128 Z'
    defs=f'<clipPath id="aCrop"><path d="{crop}"/></clipPath>'
    pieces += [f'<path d="{crop}" fill="{blue}" opacity=".14" transform="translate(13 18)"/>',
               f'<g clip-path="url(#aCrop)">{R(790,98,580,690,blue)}{I(818,110,536,676,dither_uri)}</g>']
    if active:
        reveal='M 1035 180 C 1230 103 1409 323 1350 565 C 1323 717 1118 777 954 695 C 808 613 847 398 930 290 C 973 232 1001 204 1035 180 Z'
        defs += f'<clipPath id="aReveal"><path d="{reveal}"/></clipPath>'
        pieces += [f'<g clip-path="url(#aReveal)">{I(818,110,536,676,photo_uri)}</g>',
                   f'<path d="{reveal}" fill="none" stroke="{blue}" stroke-width="7" opacity=".9"/>',
                   f'<circle cx="1321" cy="585" r="30" fill="{blue}"/>',T(1307,595,'↗',31,'white',700)]
    else:
        pieces += [f'<path d="{crop}" fill="none" stroke="{blue}" stroke-width="4"/>',
                   f'<circle cx="1255" cy="710" r="55" fill="{blue}"/>',T(1218,721,'MOVE',16,'white',760,'mono')]
    pieces += [T(76,555,'Computer Science student at the University of the Pacific.',24,black,540),
               T(76,592,'I build things, break things, and figure out why they broke.',22,'#55565b',430)]
    if active:
        pieces += [L(78,661,751,661,blue,3),T(77,698,'DISCOVERED THROUGH THE PORTRAIT  /  01',13,blue,700,'mono'),
                   T(70,771,'Mapetite',75,black,740),
                   T(78,810,'A restaurant discovery app that labels uncertain public data',17,'#4d4e54',480),
                   T(78,833,'and validates place searches.  ↗ LIVE MVP',17,'#4d4e54',480)]
    else:
        pieces += [L(78,661,751,661,'#cfd1d3',2),T(77,697,'TRY MOVING ACROSS THE PORTRAIT  ↗',13,blue,700,'mono'),
                   T(77,765,'Selected work',44,black,690),T(78,807,'Mapetite  /  Cura  /  ODDWORKS',16,'#55565b',570,'mono')]
    pieces += [T(82,866,'W.5  /  DIGITAL PLAYGROUND',11,'#777b84',600,'mono'),
               T(1195,866,'VISUAL STUDY  /  01',11,'#777b84',600,'mono')]
    return svg(w,h,''.join(pieces),defs)

def a_mobile(active):
    w,h=390,844; blue='#4058ff'; black='#111217'; pale='#f7f7f4'
    pieces=[R(0,0,w,h,pale),R(0,0,7,h,blue),L(20,67,370,67,'#d4d6d5'),
            T(20,45,'BH /',20,black,800),T(82,44,'PORTFOLIO',10,black,700,'mono'),
            T(235,44,'WORK',10,black,700,'mono'),T(293,44,'CV ↗',10,black,700,'mono'),
            T(20,105,'HELLO, I’M',11,blue,700,'mono'),T(17,170,'Brandon',66,black,830,extra='letter-spacing="-4"'),
            T(17,226,'Hann.',66,black,830,extra='letter-spacing="-4"')]
    crop='M 45 256 C 123 231 279 241 344 291 C 367 328 368 538 332 604 C 263 655 106 645 53 604 C 25 568 22 315 45 256 Z'
    defs=f'<clipPath id="aCrop"><path d="{crop}"/></clipPath>'
    pieces += [f'<path d="{crop}" fill="{blue}" opacity=".18" transform="translate(5 9)"/>',
               f'<g clip-path="url(#aCrop)">{I(22,241,346,405,dither_uri)}</g>']
    if active:
        reveal='M 146 298 C 263 244 360 330 354 455 C 347 579 292 640 162 617 C 50 604 55 408 117 335 Z'
        defs+=f'<clipPath id="aReveal"><path d="{reveal}"/></clipPath>'
        pieces += [f'<g clip-path="url(#aReveal)">{I(22,241,346,405,photo_uri)}</g>',
                   f'<path d="{reveal}" fill="none" stroke="{blue}" stroke-width="4"/>']
    else:
        pieces += [f'<path d="{crop}" fill="none" stroke="{blue}" stroke-width="3"/>']
    pieces += [T(20,679,'CS STUDENT / UNIVERSITY OF THE PACIFIC',10,'#4f5860',650,'mono')]
    if active:
        pieces += [T(18,729,'Mapetite',47,black,740),L(20,743,370,743,blue,2),
                   T(20,770,'Restaurant discovery that labels uncertain',13,'#47494f',480),
                   T(20,788,'public data and validates place searches.',13,'#47494f',480)]
    else:
        pieces += [T(20,722,'MOVE TO REVEAL  ↗',13,blue,750,'mono'),
                   T(20,760,'I build things, break things,',16,black,570),
                   T(20,782,'and figure out why they broke.',16,black,570)]
    pieces += [L(20,813,370,813,'#cfd1d3'),T(20,831,'PROJECTS',10,black,700,'mono'),T(298,831,'RÉSUMÉ ↗',10,black,700,'mono')]
    return svg(w,h,''.join(pieces),defs)

def b_desktop(active):
    w,h=1440,900; bg='#0b0d11'; white='#f3f3f1'; muted='#a5a7af'; mint='#79e0d3'
    pieces=[R(0,0,w,h,bg),R(0,0,w,8,mint),
            T(66,55,'BRANDON HANN',14,white,720,'mono'),T(796,55,'SELECTED WORK',12,muted,600,'mono'),
            T(1051,55,'ABOUT',12,white,600,'mono'),T(1149,55,'PROJECTS',12,white,600,'mono'),
            T(1293,55,'RÉSUMÉ ↗',12,white,600,'mono'),L(66,78,1374,78,'#30343b',1)]
    # Three precise image channels, all derived from the approved photograph.
    defs='<clipPath id="s1"><path d="M 814 120 L 930 120 L 901 733 L 774 733 Z"/></clipPath>'
    defs+='<clipPath id="s2"><path d="M 958 105 L 1121 105 L 1082 733 L 918 733 Z"/></clipPath>'
    defs+='<clipPath id="s3"><path d="M 1152 123 L 1368 123 L 1368 733 L 1111 733 Z"/></clipPath>'
    image_src=photo_uri if active else mono_uri
    for clip,dx in [('s1',-38 if not active else 0),('s2',19 if not active else 0),('s3',-25 if not active else 0)]:
        pieces.append(f'<g clip-path="url(#{clip})">{I(804+dx,99,580,648,image_src)}</g>')
    pieces += [L(771,746,1374,746,mint,2),T(777,772,'01  /  APPROVED PORTRAIT',11,mint,620,'mono')]
    if active:
        pieces += [T(62,201,'SELECTED / 01',14,mint,750,'mono'),
                   T(54,328,'Mapetite',112,white,790,extra='letter-spacing="-7"'),
                   L(63,374,726,374,mint,3),
                   T(63,430,'A restaurant discovery app',29,white,590),
                   T(63,469,'that labels uncertain public data',29,white,590),
                   T(63,508,'and validates place searches.',29,white,590),
                   T(63,588,'PORTFOLIO MVP  ·  LIVE DEMO',13,mint,700,'mono'),
                   T(63,670,'READ PROJECT  ↗',17,white,720,'mono'),
                   T(63,709,'SOURCE & SCOPE  ↗',13,muted,650,'mono')]
    else:
        pieces += [T(61,210,'A BUILDER, IN FULL VIEW',14,mint,730,'mono'),
                   T(54,328,'BRANDON',115,white,810,extra='letter-spacing="-8"'),
                   T(54,444,'HANN.',115,white,810,extra='letter-spacing="-8"'),
                   L(64,481,724,481,'#454a53',2),
                   T(64,548,'I build things, break things,',29,white,490),
                   T(64,588,'and figure out why they broke.',29,white,490),
                   T(64,669,'COMPUTER SCIENCE / UNIVERSITY OF THE PACIFIC',12,muted,580,'mono'),
                   T(64,743,'01  MAPETITE',27,mint,720,'mono'),
                   T(554,743,'FOCUS PROJECT  ↗',13,white,640,'mono')]
    pieces += [L(66,801,1374,801,'#30343b'),T(66,836,'CURATED WORK  /  01–03',12,muted,580,'mono'),
               T(560,836,'01 MAPETITE     02 CURA     03 ODDWORKS',13,white,580,'mono'),
               T(1250,836,'W.5  /  STUDY B',11,mint,580,'mono')]
    return svg(w,h,''.join(pieces),defs)

def b_mobile(active):
    w,h=390,844; bg='#0b0d11'; white='#f3f3f1'; muted='#a5a7af'; mint='#79e0d3'
    pieces=[R(0,0,w,h,bg),R(0,0,w,6,mint),T(20,39,'BRANDON HANN',11,white,700,'mono'),
            T(242,39,'WORK',10,white,630,'mono'),T(313,39,'CV ↗',10,white,630,'mono'),L(20,57,370,57,'#30343b')]
    # Cropped portrait channels are the visual system. Their offsets resolve in the focus state.
    defs='<clipPath id="m1"><path d="M 151 193 L 208 189 L 196 526 L 135 526 Z"/></clipPath>'
    defs+='<clipPath id="m2"><path d="M 216 181 L 287 181 L 270 526 L 201 526 Z"/></clipPath>'
    defs+='<clipPath id="m3"><path d="M 295 193 L 365 190 L 365 526 L 278 526 Z"/></clipPath>'
    img=photo_uri if active else mono_uri
    for clip,dx in [('m1',-25 if not active else 0),('m2',13 if not active else 0),('m3',-16 if not active else 0)]:
        pieces.append(f'<g clip-path="url(#{clip})">{I(125+dx,177,260,359,img)}</g>')
    pieces += [T(20,103,'SELECTED WORK  /  01',10,mint,700,'mono')]
    if active:
        pieces += [T(16,158,'Mapetite',54,white,780,extra='letter-spacing="-4"'),
                   L(20,561,370,561,mint,2),T(20,600,'RESTAURANT DISCOVERY',13,mint,680,'mono'),
                   T(20,640,'Labels uncertain public data',19,white,560),
                   T(20,668,'and validates place searches.',19,white,560),
                   T(20,729,'LIVE MVP  ↗',14,white,700,'mono'),
                   T(20,756,'SOURCE & SCOPE  ↗',11,muted,600,'mono')]
    else:
        pieces += [T(16,158,'Brandon',66,white,810,extra='letter-spacing="-4"'),
                   T(17,264,'Hann.',72,white,810,extra='letter-spacing="-5"'),
                   T(20,572,'I build things, break things,',20,white,530),
                   T(20,600,'and figure out why they broke.',20,white,530),
                   L(20,635,370,635,'#30343b'),T(20,680,'01  MAPETITE',24,mint,720,'mono'),
                   T(20,711,'FOCUS TO SEE THE PROJECT  ↗',11,muted,630,'mono')]
    pieces += [L(20,790,370,790,'#30343b'),T(20,816,'PROJECTS',11,white,700,'mono'),
               T(296,816,'RÉSUMÉ ↗',11,white,700,'mono')]
    return svg(w,h,''.join(pieces),defs)

for label,make in [('a-desktop',a_desktop),('a-mobile',a_mobile),('b-desktop',b_desktop),('b-mobile',b_mobile)]:
    for active,state in [(False,'initial'),(True,'interaction')]:
        (OUT/f'{label}-{state}.svg').write_text(make(active))
