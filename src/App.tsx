import { useMemo, useRef, useState } from "react";

type Kind = "region" | "module" | "file" | "symbol";
type Node = { id:string; name:string; kind:Kind; x:number; y:number; w:number; h:number; lines:number; lang:string; meta:string };

const demo:Node[]=[
 {id:"core",name:"CORE ENGINE",kind:"region",x:48,y:48,w:520,h:410,lines:2480,lang:"SYSTEM",meta:"execution · parsing · rendering"},
 {id:"parser",name:"Parser",kind:"module",x:76,y:100,w:205,h:132,lines:520,lang:"TS",meta:"source analysis"},
 {id:"ast",name:"AST",kind:"module",x:305,y:100,w:205,h:132,lines:410,lang:"TS",meta:"syntax model"},
 {id:"renderer",name:"Renderer",kind:"module",x:76,y:270,w:205,h:132,lines:680,lang:"TS",meta:"layout + paint"},
 {id:"runtime",name:"Runtime",kind:"module",x:305,y:270,w:205,h:132,lines:870,lang:"TS",meta:"graph execution"},
 {id:"ui",name:"UI SYSTEM",kind:"region",x:610,y:48,w:520,h:410,lines:2160,lang:"SYSTEM",meta:"components · state · views"},
 {id:"components",name:"Components",kind:"module",x:638,y:100,w:205,h:132,lines:740,lang:"TSX",meta:"visual primitives"},
 {id:"state",name:"State",kind:"module",x:867,y:100,w:205,h:132,lines:390,lang:"TS",meta:"application state"},
 {id:"views",name:"Views",kind:"module",x:638,y:270,w:205,h:132,lines:610,lang:"TSX",meta:"screens + panels"},
 {id:"hooks",name:"Hooks",kind:"module",x:867,y:270,w:205,h:132,lines:420,lang:"TS",meta:"interaction logic"},
 {id:"data",name:"DATA / SERVICES",kind:"region",x:330,y:520,w:800,h:250,lines:1840,lang:"SYSTEM",meta:"api · storage · config · utilities"},
 {id:"api",name:"API",kind:"module",x:360,y:570,w:165,h:120,lines:510,lang:"TS",meta:"network boundary"},
 {id:"storage",name:"Storage",kind:"module",x:545,y:570,w:165,h:120,lines:360,lang:"TS",meta:"persistence"},
 {id:"config",name:"Config",kind:"module",x:730,y:570,w:165,h:120,lines:290,lang:"TS",meta:"environment"},
 {id:"utils",name:"Utilities",kind:"module",x:915,y:570,w:165,h:120,lines:680,lang:"TS",meta:"shared primitives"},
 {id:"parser-symbol",name:"parse()",kind:"symbol",x:95,y:145,w:155,h:55,lines:84,lang:"TS",meta:"symbol preview"},
 {id:"runtime-symbol",name:"executeGraph()",kind:"symbol",x:324,y:315,w:165,h:55,lines:126,lang:"TS",meta:"symbol preview"},
];

const routes=[
 ["parser","ast"],["parser","renderer"],["ast","runtime"],["renderer","components"],
 ["runtime","state"],["components","views"],["state","api"],["api","storage"],
 ["config","runtime"],["utils","components"]
];

function App(){
 const [scale,setScale]=useState(1);
 const [selected,setSelected]=useState<Node|null>(null);
 const [files,setFiles]=useState<File[]>([]);
 const input=useRef<HTMLInputElement>(null);
 const nodes=useMemo(()=>files.length?files.slice(0,100).map((f,i)=>({
   id:f.name+i,name:f.name,kind:"file" as const,x:40+(i%7)*165,y:55+Math.floor(i/7)*110,w:145,h:82,
   lines:0,lang:f.name.split(".").pop()?.toUpperCase()||"FILE",meta:"local source"
 })):demo,[files]);

 return <main>
  <header>
   <div><span className="eyebrow">SOFTWARE SILICON · TOP-DOWN ARCHITECTURE</span>
    <h1>CodeScope <b>0.2</b></h1>
    <p>A source-code floorplan. Zoom from the whole system into its smallest structures.</p>
   </div>
   <button className="load" onClick={()=>input.current?.click()}>＋ Load project</button>
   <input ref={input} hidden type="file" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
  </header>
  <section className="stats">
   <span><strong>{nodes.length}</strong> blocks</span><span><strong>{files.length?"LOCAL SOURCE":"DEMO ARCHITECTURE"}</strong></span>
   <span><strong>{scale.toFixed(1)}×</strong> zoom</span><span>ARCHITECTURE → MODULES → FILES → SYMBOLS</span>
  </section>
  <div className="workspace">
   <div className="map">
    <div className="viewport" style={{transform:`scale(${scale})`}}>
     <div className="die-label">DIE / SOFTWARE SYSTEM</div>
     <svg className="routes" width="1180" height="820" viewBox="0 0 1180 820">
      {routes.map(([a,b])=>{
       const A=nodes.find(n=>n.id===a),B=nodes.find(n=>n.id===b);
       if(!A||!B)return null;
       const x1=A.x+A.w/2,y1=A.y+A.h/2,x2=B.x+B.w/2,y2=B.y+B.h/2;
       const mx=(x1+x2)/2;
       return <path key={a+b} d={`M${x1} ${y1} H${mx} V${y2} H${x2}`}/>;
      })}
     </svg>
     {nodes.map(n=><button key={n.id} className={`node ${n.kind} ${selected?.id===n.id?"selected":""}`} style={{left:n.x,top:n.y,width:n.w,height:n.h}} onClick={()=>setSelected(n)}>
       <span className="nodekind">{n.kind.toUpperCase()}</span><strong>{n.name}</strong><small>{n.lines?n.lines.toLocaleString()+" LOC":"source block"} · {n.lang}</small><em>{n.meta}</em>
     </button>)}
    </div>
   </div>
   <aside>
    <div className="panel-title">BLOCK INSPECTOR</div>
    {selected?<><div className="inspector-kind">{selected.kind.toUpperCase()}</div><h2>{selected.name}</h2><p>{selected.meta}</p>
     <dl><dt>Language</dt><dd>{selected.lang}</dd><dt>Size</dt><dd>{selected.lines?selected.lines.toLocaleString()+" lines":"pending scan"}</dd><dt>Coordinates</dt><dd>{selected.x}, {selected.y}</dd></dl>
     <div className="trace">● CONNECTIVITY<br/><span>dependency route active</span></div>
    </>:<div className="empty">Select a block to inspect it.<br/><br/>Far zoom shows architecture. Closer zoom reveals modules, files and symbols.</div>}
   </aside>
  </div>
  <footer><button onClick={()=>setScale(s=>Math.min(4,s+.25))}>＋</button><button onClick={()=>setScale(s=>Math.max(.5,s-.25))}>−</button><button onClick={()=>setScale(1)}>Reset</button><span>TOP VIEW · NO 3D · FLOORPLAN MODE</span></footer>
 </main>
}
export default App;