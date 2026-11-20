import math
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

SRC='/tmp/vend/gfonts/ofl/fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf'
SRCI='/tmp/vend/gfonts/ofl/fraunces/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf'
def inst(src, **axes):
    f=TTFont(src); return instancer.instantiateVariableFont(f, axes)

def glyph_path(font, text, size, x0, y0, tracking=0):
    """outline text; returns svg path d, width. y0 = baseline"""
    gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm
    s=size/upm; pen=SVGPathPen(gs); x=x0
    hmtx=font['hmtx']
    for ch in text:
        g=cmap[ord(ch)]
        tp=TransformPen(pen,(s,0,0,-s,x,y0))
        gs[g].draw(tp)
        x+=hmtx[g][0]*s+tracking
    return pen.getCommands(), x-x0-tracking

def bounds(font,ch,size):
    gs=font.getGlyphSet(); g=font.getBestCmap()[ord(ch)]; bp=BoundsPen(gs); gs[g].draw(bp)
    s=size/font['head'].unitsPerEm; xm,ym,xM,yM=bp.bounds
    return xm*s,ym*s,xM*s,yM*s

fP=inst(SRC, wght=640, opsz=144, SOFT=100, WONK=1)
fW=inst(SRCI, wght=560, opsz=72, SOFT=100, WONK=1)

CX,CY=120,116
# --- seal edge: paper-cup pleats + wax irregularity
pts=[]
N=720
for i in range(N):
    t=2*math.pi*i/N
    r=94+2.6*math.sin(36*t)+2.2*math.sin(3*t+0.7)+1.4*math.sin(5*t+2.1)+0.8*math.sin(11*t+0.3)
    pts.append((CX+r*math.cos(t), CY+r*math.sin(t)))
seal='M'+' L'.join(f'{x:.2f},{y:.2f}' for x,y in pts)+' Z'

# drips (hang from lower-left, like the sketch)
def drip(x,top,w,length,bulb):
    # tapered drip with round bulb
    l=x-w/2; r=x+w/2; b=top+length
    return (f'M{l:.1f},{top:.1f} C{l+1:.1f},{top+length*0.45:.1f} {x-bulb:.1f},{b-bulb*1.6:.1f} {x-bulb:.1f},{b-bulb:.1f} '
            f'A{bulb:.1f},{bulb:.1f} 0 0 0 {x+bulb:.1f},{b-bulb:.1f} '
            f'C{x+bulb:.1f},{b-bulb*1.6:.1f} {r-1:.1f},{top+length*0.45:.1f} {r:.1f},{top:.1f} Z')
drips=[drip(86,190,26,46,7.5), drip(112,200,16,26,5.2), drip(148,196,14,18,4.4)]

# --- P glyph centered
size=128
xm,ym,xM,yM=bounds(fP,'P',size)
w=xM-xm; h=yM-ym
x0=CX-w/2-xm; base=CY+(yM+ym)/2
dP,_=glyph_path(fP,'P',size,x0,base)
# little fudge drip from the P's foot serif
Pfoot_y=base - ym  # bottom of glyph (ym ~ 0)
open('/home/claude/tools/pbounds.txt','w').write(f'{x0+xm} {base-yM} {x0+xM} {base-ym}\n')

# --- ring text as outlines along circle
def ring_text(font,text,size,radius,start_deg,tracking):
    gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm; s=size/upm
    hm=font['hmtx']; widths=[hm[cmap[ord(c)]][0]*s+tracking for c in text]
    total=sum(widths); ang=math.radians(start_deg)-total/radius/2
    pen=SVGPathPen(gs); out=[]
    a=ang
    for c,wd in zip(text,widths):
        g=cmap[ord(c)]; mid=a+(wd/2)/radius
        # glyph rotated so its baseline is tangent; text reads clockwise on top
        cx=CX+radius*math.cos(mid); cy=CY+radius*math.sin(mid)
        rot=mid+math.pi/2
        cs,sn=math.cos(rot),math.sin(rot)
        gw=hm[g][0]*s
        # local glyph coords: x in [-gw/2,gw/2], y up -> svg y down
        T=(s*cs, s*sn, s*sn, -s*cs, cx - (gw/2)*cs, cy - (gw/2)*sn)
        # derive: point (u,v) font units -> local (u*s - gw/2, -v*s) -> rotate -> translate
        tp=TransformPen(pen,T); gs[g].draw(tp)
        a+=wd/radius
    return pen.getCommands()
fR=inst('/tmp/vend/gfonts/ofl/dmsans/DMSans[opsz,wght].ttf', wght=600, opsz=14)
ringTop=ring_text(fR,'PORTO SWEETS',10.5,79,-90,2.6)
def ring_bottom(font,text,size,radius,tracking):
    gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=font['head'].unitsPerEm; s=size/upm
    hm=font['hmtx']; widths=[hm[cmap[ord(c)]][0]*s+tracking for c in text]
    total=sum(widths); a=math.pi/2+total/radius/2
    pen=SVGPathPen(gs)
    for c,wd in zip(text,widths):
        g=cmap[ord(c)]; mid=a-(wd/2)/radius
        cx=CX+radius*math.cos(mid); cy=CY+radius*math.sin(mid)
        rot=mid-math.pi/2; cs,sn=math.cos(rot),math.sin(rot); gw=hm[g][0]*s
        T=(s*cs, s*sn, s*sn, -s*cs, cx-(gw/2)*cs, cy-(gw/2)*sn)
        gs[g].draw(TransformPen(pen,T)); a-=wd/radius
    return pen.getCommands()
ringBot=ring_bottom(fR,'PORTO ALEGRE · CALGARY',7.6,87.2,1.9)

GOLD='''<linearGradient id="psGold" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#fbeec0"/><stop offset=".35" stop-color="#e2be6a"/><stop offset=".62" stop-color="#b8892f"/><stop offset="1" stop-color="#f0d68e"/></linearGradient>'''
WAX='''<radialGradient id="psWax" cx="92" cy="78" r="160" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#ff6f7d"/><stop offset=".42" stop-color="#ef4258"/><stop offset=".9" stop-color="#d42748"/><stop offset="1" stop-color="#c41f42"/></radialGradient>
<radialGradient id="psPress" cx="110" cy="100" r="90" gradientUnits="userSpaceOnUse">
<stop offset="0" stop-color="#f24d62"/><stop offset="1" stop-color="#e2344f"/></radialGradient>'''
SPLASH=[(28,62,5.5),(18,80,2.6),(214,58,4.2),(226,74,2.2),(206,182,5),(222,170,2.4),(36,170,3.4),(196,214,2.8)]
def svg(withText, idsuf=''):
    ring = (f'<path d="{ringTop}" fill="url(#psGold)"/><path d="{ringBot}" fill="url(#psGold)"/>'
            f'<circle cx="{CX-80}" cy="{CY}" r="2" fill="url(#psGold)"/><circle cx="{CX+80}" cy="{CY}" r="2" fill="url(#psGold)"/>') if withText else ''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 250" role="img" aria-label="Porto Sweets">
<defs>{GOLD}{WAX}
<filter id="psSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter></defs>
<g class="ps-wax">
{''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#psWax)"/>' for x,y,r in SPLASH)}
<path d="{seal}" fill="url(#psWax)"/>
{''.join(f'<path d="{d}" fill="url(#psWax)"/>' for d in drips)}
<circle cx="{CX}" cy="{CY}" r="70" fill="url(#psPress)"/>
<circle cx="{CX}" cy="{CY}" r="70" fill="none" stroke="#b81d3d" stroke-opacity=".35" stroke-width="1.4" transform="translate(0,-0.8)"/>
<circle cx="{CX}" cy="{CY}" r="73.5" fill="none" stroke="url(#psGold)" stroke-width="1"/>
<path d="M58,84 C66,62 84,46 108,40" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
<circle cx="52" cy="98" r="2.6" fill="#fff" fill-opacity=".35"/>
</g>
<circle cx="{CX}" cy="{CY}" r="{91 if not withText else 91}" fill="none" stroke="url(#psGold)" stroke-width=".9" opacity=".0"/>
{ring}
<path d="{dP}" fill="#9e1236" fill-opacity=".45" transform="translate(1.6,2.2)"/><path class="ps-p" d="{dP}" fill="url(#psGold)"/>
</svg>'''
open('/home/claude/porto-sweets/assets/logo-selo.svg','w').write(svg(True))
open('/home/claude/porto-sweets/assets/logo-marca.svg','w').write(svg(False))

# wordmark
dW,ww=glyph_path(fW,'Porto Sweets',64,0,64)
fS=inst('/tmp/vend/gfonts/ofl/dmsans/DMSans[opsz,wght].ttf', wght=600, opsz=14)
dS,sw=glyph_path(fS,'PORTO ALEGRE · CALGARY',11,0,0,tracking=3.4)
H=96
word=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 {ww+4:.0f} {H}" role="img" aria-label="Porto Sweets">
<path d="{dW}" fill="#d42748"/>
<path d="{dS}" fill="#b8892f" transform="translate({(ww-sw)/2:.1f},{H-6})"/></svg>'''
open('/home/claude/porto-sweets/assets/logo-palavra.svg','w').write(word)
print('ok', ww, sw)
