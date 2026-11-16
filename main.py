import json,os,sys,urllib.request
E=os.environ.get("MAKEFUN_ENV_URL")
V={'p':100,'n':320,'b':330,'r':500,'q':900,'k':20000}
def P(f):
 p=f.split();b=['.']*64
 for r,w in enumerate(reversed(p[0].split('/'))):
  c=0
  for ch in w:
   if ch.isdigit():c+=int(ch)
   else:b[r*8+c]=ch;c+=1
 return b,p[1]=='w',p[2],-1 if p[3]=='-'else ord(p[3][0])-97+8*(int(p[3][1])-1)
def A(b,s,w):
 for o,n in[((-17,-15,-10,-6,6,10,15,17),'N'),((-9,-8,-7,-1,1,7,8,9),'K')]:
  for x in o:
   t=s+x
   if 0<=t<64 and abs((t&7)-(s&7))<=(2 if n=='N' else 1)and b[t]==(n if w else n.lower()):return 1
 for o in([-7,-9]if w else[7,9]):
  t=s+o
  if 0<=t<64 and abs((t&7)-(s&7))==1 and b[t]==('P'if w else'p'):return 1
 for os,sc in[([-8,8,-1,1],'RQ'),([-9,-7,7,9],'BQ')]:
  for o in os:
   t=s
   while 0<=(t:=t+o)<64 and abs((t&7)-((t-o)&7))<=1:
    p=b[t]
    if p!='.'and p in(sc if w else sc.lower())and p.isupper()==w:return 1
    if p!='.':break
 return 0
def G(b,w,c,e):
 m=[]
 for f,p in enumerate(b):
  if p=='.'or p.isupper()!=w:continue
  l,r,col=p.lower(),f>>3,f&7
  if l in'nk':
   for o in((-17,-15,-10,-6,6,10,15,17)if l=='n'else(-9,-8,-7,-1,1,7,8,9)):
    t=f+o
    if 0<=t<64 and abs((t&7)-col)<=(2 if l=='n' else 1)and(b[t]=='.'or b[t].isupper()!=w):m.append((f,t,''))
   if l=='k':
    for s,ks,sq,ch in[('K',6,(5,6),(4,5,6)),('Q',2,(1,2,3),(4,3,2)),('k',62,(61,62),(60,61,62)),('q',58,(57,58,59),(60,59,58))]:
     if s in c and w==(s.isupper())and all(b[i]=='.'for i in sq)and not any(A(b,x,not w)for x in ch):m.append((4 if w else 60,ks,''))
  elif l in'rbq':
   for o in((-8,8,-1,1)if l=='r'else((-9,-7,7,9)if l=='b'else(-8,8,-1,1,-9,-7,7,9))):
    t=f
    while 0<=(t:=t+o)<64 and abs((t&7)-((t-o)&7))<=1:
     d=b[t]
     if d=='.':m.append((f,t,''))
     elif d.isupper()!=w:m.append((f,t,''));break
     else:break
  elif l=='p':
   d=8 if w else-8;t=f+d;pr=(w and t>>3==7)or(not w and t>>3==0)
   if 0<=t<64 and b[t]=='.':
    if pr:
     for q in'qrbn':m.append((f,t,q))
    else:
     m.append((f,t,''))
     if((w and r==1)or(not w and r==6))and b[f+d*2]=='.':m.append((f,f+d*2,''))
   for do in[-1,1]:
    tc=col+do
    if 0<=tc<8 and 0<=(t:=f+d+do)<64 and abs((t&7)-col)==1 and((b[t]!='.'and b[t].isupper()!=w)or t==e):
     if pr:
      for q in'qrbn':m.append((f,t,q))
     else:m.append((f,t,''))
 return m
def M(b,w,c,e,m):
 f,t,pr=m;nb=b[:];p=nb[f];nb[f]='.';cap=nb[t]
 if p.lower()=='p'and t==e and cap=='.':nb[t-8 if w else t+8]='.'
 if p.lower()=='k'and abs(t-f)==2:
  rt,ro={(6):(7,5),(2):(0,3),(62):(63,61),(58):(56,59)}[t]
  nb[rt]='.';nb[ro]='R'if w else'r'
 nb[t]=(pr.upper()if w else pr.lower())if pr else p
 nc=c
 for k,x in[('K','K'),('Q','Q'),('k','k'),('q','q')]:
  if p==k or f==[0,7,56,63][['Q','K','q','k'].index(x)]:nc=nc.replace(x,'')
 return nb,1-w,nc or'-',(f+t)//2 if p.lower()=='p'and abs(t-f)==16 else-1
def EV(b,w):
 s=np=wb=bb=0
 for i,p in enumerate(b):
  if p=='.':continue
  l,u,v,r,f=p.lower(),p.isupper(),V[p.lower()],i>>3,i&7
  if not u:r=7-r
  if l not in'pk':np+=v
  wb+=p=='B';bb+=p=='b';d=abs(3.5-f)+abs(3.5-r)
  pst=5*(r-1)+(10 if f in(3,4)else 0)if l=='p'else(36-6*d if l in'nb'else(10 if r==6 and l=='r'else(36-6*d if np<1500 else 20-4*(min(f,7-f)+min(r,7-r)))))
  s+=(v+pst)if u else-(v+pst)
 bs=30*(wb>=2)-30*(bb>=2)
 return(s+bs)if w else-(s+bs)
ND=0
def S(b,w,c,e,d,a,be):
 global ND;ND+=1
 if ND>12000:return 0
 ev=EV(b,w)
 if d<=0:
  if ev>=be:return be
  if a<ev:a=ev
 ms=G(b,w,c,e)
 if d<=0:ms=[m for m in ms if b[m[1]]!='.'or m[1]==e or m[2]]
 sd=sorted([(V.get(b[m[1]].lower(),0)*10-V.get(b[m[0]].lower(),0),m)for m in ms],key=lambda x:x[0],reverse=True)
 lg=0
 for _,m in sd:
  nb,nw,nc,ne=M(b,w,c,e,m)
  ks=next((sq for sq,p in enumerate(nb)if p==('K'if w else'k')),-1)
  if ks!=-1 and A(nb,ks,nw):continue
  lg+=1
  sc=-S(nb,nw,nc,ne,d-1,-be,-a)
  if ND>12000:return 0
  if sc>=be:return be
  if sc>a:a=sc
 if not lg:
  ks=next((sq for sq,p in enumerate(b)if p==('K'if w else'k')),-1)
  return(-20000+d if ks!=-1 and A(b,ks,1-w)else 0)if d else ev
 return a
def choose(fen,legal):
 global ND;ND=0;b,w,c,e=P(fen);best=legal[0];val=-999999
 for d in range(1,6):
  a,be=-999999,999999;lb=best;lv=val
  for m_str in legal:
   fr=ord(m_str[0])-97+8*(int(m_str[1])-1);to=ord(m_str[2])-97+8*(int(m_str[3])-1)
   pr=m_str[4] if len(m_str)==5 else''
   nb,nw,nc,ne=M(b,w,c,e,(fr,to,pr))
   sc=-S(nb,nw,nc,ne,d-1,-be,-a)
   if ND>12000:break
   if sc>lv:lv=sc;lb=m_str
   if lv>a:a=lv
  if ND>12000:break
  best,val=lb,lv
  if d>=5:break
 return best if best in legal else legal[0]
def post(p,b):
 r=urllib.request.Request(E+p,data=json.dumps(b).encode(),headers={"content-type":"application/json"})
 try:
  with urllib.request.urlopen(r) as x:return json.load(x)
 except urllib.error.HTTPError as ex:sys.exit(f"{p}: {ex.code}")
if __name__=="__main__":
 if E:
  while(g:=post("/game",{}))["status"]!="done":
   while g["status"]=="your_move":
    m=choose(g["fen"],g["legal_moves"])
    if m not in g["legal_moves"]:m=g["legal_moves"][0]
    g=post("/move",{"game":g["game"],"move":m})
   print(f"game {g['game']}: {g['outcome']}",file=sys.stderr)
