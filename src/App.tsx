import { useMemo, useRef, useState } from "react";

type Node={id:string;name:string;kind:"folder"|"file";x:number;y:number;w:number;h:number;lines:number;lang:string};
const demo:Node[]=[
{id:"src",name:"src",kind:"folder",x:70,y:90,w:360,h:300,lines:842,lang:"folder"},
{id:"components",name:"components",kind:"folder",x:105,y:135,w:145,h:105,lines:312,lang:"folder"},
{id:"App.tsx",name:"App.tsx",kind:"file",x:270,y:135,w:125,h:105,lines:184,lang:"TSX"},
{id:"engine",name:"engine",kind:"folder",x:105,y:265,w:145,h:90,lines:420,lang:"folder"},
{id:"parser",name:"parser.ts",kind:"file",x:270,y:265,w:125,h:90,lines:238,lang:"TS"},
{id:"public",name:"public",kind:"folder",x:480,y:90,w:230,h:265,lines:94,lang:"folder"},
{id:"index.html",name:"index.html",kind:"file",x:510,y:135,w:170,h:75,lines:42,lang:"HTML"},
{id:"README",name:"README.md",kind:"file",x:480,y:390,w:230,h:80,lines:86,lang:"MD"}
];

function App(){
 const [scale,setScale]=useState(1);
 const [selected,setSelected]=useState<Node|null>(null);
 const [files,setFiles]=useState<File[]>([]);
 const input=useRef<HTMLInputElement>(null);
 const nodes=useMemo(()=>files.length?files.slice(0,120).map((f,i)=>({id:f.name+i,name:f.name,kind:"file" as const,x:40+(i%8)*155,y:70+Math.floor(i/8)*105,w:135,h:82,lines:0,lang:f.name.split(".").pop()?.toUpperCase()||"FILE"})):demo,[files]);
 function load(e:React.ChangeEvent<HTMLInputElement>){setFiles(Array.from(e.target.files||[]));}
 return <main>
  <header><div><span className="eyebrow">EXPERIMENTAL SOFTWARE CARTOGRAPHY</span><h1>CodeScope <b>0.1</b></h1><p>Top-down maps of source code. Zoom from architecture into files.</p></div>
   <button onClick={()=>input.current?.click()}>＋ Load project</button><input ref={input} hidden type="file" multiple onChange={load}/>
  </header>
  <section className="stats"><span><strong>{files.length||demo.length}</strong> nodes</span><span><strong>{files.length?"Local project":"Demo project"}</strong></span><span><strong>{scale.toFixed(1)}×</strong> zoom</span></section>
  <div className="workspace">
   <div className="map" style={{transform:"scale("+scale+")",transformOrigin:"0 0"}}>
    <svg className="routes" width="1000" height="700"><path d="M200 190 C430 190 430 210 560 210"/><path d="M350 315 C470 315 470 280 560 250"/><path d="M560 250 C650 250 650 420 600 430"/></svg>
    {nodes.map(n=><button key={n.id} className={"node "+n.kind+(selected?.id===n.id?" selected":"")} style={{left:n.x,top:n.y,width:n.w,height:n.h}} onClick={()=>setSelected(n)}>
      <span className="nodekind">{n.kind==="folder"?"DIR":"FILE"}</span><strong>{n.name}</strong><small>{n.lines?n.lines.toLocaleString()+" lines":"source node"} · {n.lang}</small>
    </button>)}
   </div>
   <aside><div className="panel-title">INSPECTOR</div>{selected?<><h2>{selected.name}</h2><p>{selected.kind} node</p><dl><dt>Language</dt><dd>{selected.lang}</dd><dt>Lines</dt><dd>{selected.lines||"pending scan"}</dd><dt>Position</dt><dd>{selected.x+", "+selected.y}</dd></dl></>:<div className="empty">Select a block to inspect it.<br/><br/>The real parser comes next.</div>}</aside>
  </div>
  <footer><button onClick={()=>setScale(s=>Math.min(2.4,s+.2))}>＋</button><button onClick={()=>setScale(s=>Math.max(.45,s-.2))}>−</button><button onClick={()=>setScale(1)}>Reset</button><span>Top view · no 3D · prototype</span></footer>
 </main>
}
export default App;