import { useState, useEffect, useCallback } from "react";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://cgvqftcfsrzffuhhimds.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vetn6UQlrIVVoUTUXi1Dgw_mKtPDWYG";

const sb = {
  headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` },
  authHeaders: (token) => ({ "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${token}` }),
  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: "POST", headers: this.headers, body: JSON.stringify({ email, password }) });
    return r.json();
  },
  async signUp(email, password, fullName) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { method: "POST", headers: this.headers, body: JSON.stringify({ email, password, data: { full_name: fullName } }) });
    return r.json();
  },
  async signOut(token) { await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: this.authHeaders(token) }); },
  async getProfile(userId, token) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, { headers: this.authHeaders(token) });
    const d = await r.json(); return Array.isArray(d) ? d[0] : null;
  },
  async query(table, token, filters = "", select = "*") {
    const h = token ? this.authHeaders(token) : this.headers;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`, { headers: { ...h, "Prefer": "return=representation" } });
    return r.json();
  },
  async insert(table, token, data) {
    const h = token ? this.authHeaders(token) : this.headers;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: { ...h, "Prefer": "return=representation" }, body: JSON.stringify(data) });
    return r.json();
  },
  async patch(table, token, data, filters) {
    const h = token ? this.authHeaders(token) : this.headers;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, { method: "PATCH", headers: { ...h, "Prefer": "return=representation" }, body: JSON.stringify(data) });
    return r.json();
  },
  async del(table, token, filters) {
    const h = token ? this.authHeaders(token) : this.headers;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, { method: "DELETE", headers: h });
    return r.ok;
  }
};

// ─── THEME ────────────────────────────────────────────────────────────────────
const t = {
  bg: "#0D0D0F", surface: "#16161A", surfaceHover: "#1E1E24",
  border: "#2A2A35", borderLight: "#35354A",
  accent: "#C9A96E", accentLight: "#D4B87A", accentDim: "rgba(201,169,110,0.15)",
  text: "#F0EDE8", textMuted: "#8A8799", textDim: "#5A5869",
  green: "#4CAF82", blue: "#5B8FD4", purple: "#9B72CF", red: "#E06868", yellow: "#E8C84A",
};

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:${t.bg};color:${t.text};min-height:100vh}
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${t.bg}} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:2px}
  .dd{font-family:'Cormorant Garamond',serif}
  .fi{animation:fi 0.4s ease forwards} @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .card{background:${t.surface};border:1px solid ${t.border};border-radius:12px;transition:border-color 0.2s,box-shadow 0.2s}
  .card:hover{border-color:${t.borderLight};box-shadow:0 4px 24px rgba(0,0,0,0.3)}
  .bp{background:${t.accent};color:#0D0D0F;border:none;padding:10px 20px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s,transform 0.1s;letter-spacing:0.02em}
  .bp:hover{background:${t.accentLight};transform:translateY(-1px)} .bp:active{transform:translateY(0)} .bp:disabled{opacity:0.6;cursor:not-allowed}
  .bg{background:transparent;color:${t.textMuted};border:1px solid ${t.border};padding:9px 18px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s}
  .bg:hover{border-color:${t.accent};color:${t.accent}}
  .tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;letter-spacing:0.04em;text-transform:uppercase}
  input,textarea,select{background:${t.bg};border:1px solid ${t.border};color:${t.text};border-radius:8px;padding:10px 14px;font-family:'DM Sans',sans-serif;font-size:14px;width:100%;outline:none;transition:border-color 0.2s}
  input:focus,textarea:focus,select:focus{border-color:${t.accent}} textarea{resize:vertical;min-height:80px} select option{background:${t.surface}}
  label{display:block;font-size:12px;font-weight:500;color:${t.textMuted};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px}
  .pb{height:4px;background:${t.border};border-radius:2px;overflow:hidden}
  .pf{height:100%;background:linear-gradient(90deg,${t.accent},${t.accentLight});border-radius:2px;transition:width 0.6s ease}
  .ni{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;cursor:pointer;color:${t.textMuted};font-size:13.5px;font-weight:400;transition:all 0.15s;border:1px solid transparent}
  .ni:hover{background:${t.surfaceHover};color:${t.text}}
  .ni.active{background:${t.accentDim};color:${t.accent};border-color:rgba(201,169,110,0.25);font-weight:500}
  .sb{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em}
  .spin{animation:spin 1s linear infinite;display:inline-block} @keyframes spin{to{transform:rotate(360deg)}}
`;

const sc = (s) => ({
  request_submitted:{bg:"rgba(91,143,212,0.15)",color:t.blue},
  under_review:{bg:"rgba(155,114,207,0.15)",color:t.purple},
  scheduled:{bg:"rgba(232,200,74,0.15)",color:t.yellow},
  in_progress:{bg:"rgba(201,169,110,0.15)",color:t.accent},
  waiting_on_agent:{bg:"rgba(224,104,104,0.15)",color:t.red},
  completed:{bg:"rgba(76,175,130,0.15)",color:t.green},
  delivered:{bg:"rgba(76,175,130,0.2)",color:t.green},
}[s] || {bg:t.border,color:t.textMuted});

const fs = (s) => s?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())||"";
const Spin = () => <span className="spin" style={{fontSize:16,color:t.accent}}>◌</span>;
const Empty = ({icon,title,sub,action}) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{fontSize:40,marginBottom:12}}>{icon}</div>
    <h3 style={{fontSize:16,fontWeight:600,marginBottom:6}}>{title}</h3>
    <p style={{fontSize:13,color:t.textMuted,marginBottom:action?20:0}}>{sub}</p>
    {action}
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const Login = ({onLogin}) => {
  const [mode,setMode] = useState("login");
  const [email,setEmail] = useState(""); const [pw,setPw] = useState(""); const [name,setName] = useState("");
  const [err,setErr] = useState(""); const [loading,setLoading] = useState(false);

  const doLogin = async () => {
    if(!email||!pw){setErr("Please enter your email and password.");return;}
    setLoading(true);setErr("");
    try {
      const d = await sb.signIn(email,pw);
      if(d.error||d.error_description){setErr(d.error_description||d.error||"Login failed.");return;}
      if(d.access_token){
        const p = await sb.getProfile(d.user.id,d.access_token);
        onLogin({...d.user,...p,token:d.access_token,name:p?.full_name||d.user.email});
      }
    } catch{setErr("Connection error. Please try again.");}
    finally{setLoading(false);}
  };

  const doSignup = async () => {
    if(!email||!pw||!name){setErr("Please fill in all fields.");return;}
    setLoading(true);setErr("");
    try {
      const d = await sb.signUp(email,pw,name);
      if(d.error){setErr(d.error.message||"Sign up failed.");return;}
      if(d.access_token){
        await new Promise(r=>setTimeout(r,800));
        const p = await sb.getProfile(d.user.id,d.access_token);
        onLogin({...d.user,...p,token:d.access_token,name});
      } else {
        setErr("Check your email to confirm your account, then sign in.");
        setMode("login");
      }
    } catch{setErr("Connection error. Please try again.");}
    finally{setLoading(false);}
  };

  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <style>{G}</style>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:t.accent,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:18,color:"#0D0D0F",fontWeight:700}}>D</span>
            </div>
            <span className="dd" style={{fontSize:28,fontWeight:600,letterSpacing:"0.05em"}}>Dot Collection</span>
          </div>
          <p style={{color:t.textMuted,fontSize:14}}>Agent Resource Platform</p>
        </div>
        <div className="card" style={{padding:36}}>
          <h2 className="dd" style={{fontSize:24,marginBottom:6}}>{mode==="login"?"Welcome back":"Create account"}</h2>
          <p style={{color:t.textMuted,fontSize:13,marginBottom:28}}>{mode==="login"?"Sign in to access your resources":"Join the Dot Collection platform"}</p>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {mode==="signup"&&<div><label>Full Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Sarah Chen"/></div>}
            <div><label>Email Address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@dotcollection.com" onKeyDown={e=>e.key==="Enter"&&(mode==="login"?doLogin():doSignup())}/></div>
            <div><label>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&(mode==="login"?doLogin():doSignup())}/></div>
            {err&&<p style={{color:t.red,fontSize:13,padding:"10px 14px",background:"rgba(224,104,104,0.1)",borderRadius:8}}>{err}</p>}
            <button className="bp" onClick={mode==="login"?doLogin:doSignup} disabled={loading} style={{marginTop:4,width:"100%",padding:"13px"}}>
              {loading?<Spin/>:mode==="login"?"Sign In →":"Create Account →"}
            </button>
          </div>
          <div style={{marginTop:20,textAlign:"center"}}>
            <button onClick={()=>{setMode(mode==="login"?"signup":"login");setErr("");}} style={{background:"none",border:"none",cursor:"pointer",color:t.accent,fontSize:13}}>
              {mode==="login"?"New agent? Create an account":"Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({active,setActive,user,onLogout}) => {
  const [exp,setExp] = useState({marketing:true,training:false});
  const nav = [
    {key:"dashboard",label:"Dashboard"},
    {key:"marketing",label:"Marketing Hub",ch:[
      {key:"marketing_weekly",label:"Weekly Drop"},
      {key:"marketing_email",label:"Email Templates"},
      {key:"marketing_print",label:"Print Materials"},
      {key:"marketing_social",label:"Social Templates"},
      {key:"marketing_ideas",label:"Content Ideas"},
    ]},
    {key:"developments",label:"Developments"},
    {key:"listing_services",label:"Listing Services"},
    {key:"assets",label:"Asset Delivery"},
    {key:"training",label:"Training Hub",ch:[
      {key:"training_courses",label:"Courses"},
      {key:"training_videos",label:"Video Library"},
      {key:"training_resources",label:"Downloads"},
    ]},
    {key:"billing",label:"Membership"},
    ...(user.role==="admin"?[{key:"admin",label:"Admin Panel"}]:[]),
  ];
  return (
    <div style={{width:220,background:t.surface,borderRight:`1px solid ${t.border}`,height:"100vh",display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:100}}>
      <div style={{padding:"24px 20px 20px",borderBottom:`1px solid ${t.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:t.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:14,color:"#0D0D0F",fontWeight:700}}>D</span>
          </div>
          <div>
            <div className="dd" style={{fontSize:16,fontWeight:600,letterSpacing:"0.04em",lineHeight:1.2}}>Dot Collection</div>
            <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.08em"}}>Agent Platform</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 10px"}}>
        {nav.map(item=>(
          <div key={item.key}>
            <div className={`ni ${active===item.key||item.ch?.some(c=>c.key===active)?"active":""}`}
              onClick={()=>item.ch?setExp(e=>({...e,[item.key]:!e[item.key]})):setActive(item.key)}
              style={{justifyContent:"space-between"}}>
              <span>{item.label}</span>
              {item.ch&&<span style={{fontSize:10,color:t.textDim}}>{exp[item.key]?"▲":"▼"}</span>}
            </div>
            {item.ch&&exp[item.key]&&(
              <div style={{marginLeft:14,marginBottom:4}}>
                {item.ch.map(c=>(
                  <div key={c.key} className={`ni ${active===c.key?"active":""}`} onClick={()=>setActive(c.key)} style={{fontSize:13,padding:"8px 12px"}}>
                    <span style={{color:t.textDim,fontSize:10}}>—</span> {c.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{padding:"14px 10px",borderTop:`1px solid ${t.border}`}}>
        <div style={{padding:"10px 12px",borderRadius:8,background:t.bg,marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:500}}>{user.name||user.email}</div>
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
            <span className="tag" style={{background:t.accentDim,color:t.accent}}>{user.tier||"basic"}</span>
            <span className="tag" style={{background:"rgba(91,143,212,0.15)",color:t.blue}}>{user.role||"agent"}</span>
          </div>
        </div>
        <div className="ni" onClick={onLogout} style={{fontSize:13}}>Sign Out →</div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({user,setActive}) => {
  const [stats,setStats] = useState({templates:0,requests:0,courses:0});
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      try{
        const [tpl,req,crs] = await Promise.all([
          sb.query("templates",user.token,"&is_published=eq.true"),
          sb.query("listing_requests",user.token,`&agent_id=eq.${user.id}`),
          sb.query("courses",user.token,"&is_published=eq.true"),
        ]);
        setStats({
          templates:Array.isArray(tpl)?tpl.length:0,
          requests:Array.isArray(req)?req.filter(r=>!["completed","delivered"].includes(r.status)).length:0,
          courses:Array.isArray(crs)?crs.length:0,
        });
      }catch{}
      setLoading(false);
    })();
  },[user]);

  const blocks = [
    {title:"This Week's Market Drop",sub:"Ready-to-use market content",cta:"Download Now",to:"marketing_weekly",accent:t.accent,icon:"📊"},
    {title:"Email Templates",sub:"Branded, plug-and-play templates",cta:"Browse Templates",to:"marketing_email",accent:t.blue,icon:"✉️"},
    {title:"Listing Services",sub:"Request photography, marketing & more",cta:"Submit Request",to:"listing_services",accent:t.green,icon:"🏡"},
    {title:"Training Hub",sub:"Courses, videos, and coaching replays",cta:"Start Learning",to:"training_courses",accent:t.purple,icon:"🎓"},
  ];

  return (
    <div className="fi">
      <div style={{marginBottom:32}}>
        <h1 className="dd" style={{fontSize:36,fontWeight:600,marginBottom:6}}>Good morning, {(user.name||user.email)?.split(" ")[0]}.</h1>
        <p style={{color:t.textMuted,fontSize:15}}>Here's what's available for you today.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:28}}>
        {[
          {label:"Published Templates",val:loading?"—":stats.templates},
          {label:"Active Requests",val:loading?"—":stats.requests},
          {label:"Available Courses",val:loading?"—":stats.courses},
          {label:"Membership",val:(user.tier||"basic").charAt(0).toUpperCase()+(user.tier||"basic").slice(1)},
        ].map((s,i)=>(
          <div key={i} className="card" style={{padding:"18px 20px"}}>
            <div style={{fontSize:11,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>{s.label}</div>
            <div className="dd" style={{fontSize:28,fontWeight:500}}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
        {blocks.map((b,i)=>(
          <div key={i} className="card" style={{padding:24}}>
            <div style={{fontSize:28,marginBottom:10}}>{b.icon}</div>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:6}}>{b.title}</h3>
            <p style={{fontSize:13,color:t.textMuted,marginBottom:16}}>{b.sub}</p>
            <button className="bg" onClick={()=>setActive(b.to)} style={{fontSize:13,borderColor:`${b.accent}50`,color:b.accent}}>{b.cta} →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── WEEKLY DROP ──────────────────────────────────────────────────────────────
const CopyBtn = ({text}) => {
  const [copied,setCopied] = useState(false);
  const copy = ()=>{ navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return <button onClick={copy} className="bg" style={{fontSize:11,padding:"4px 10px",flexShrink:0}}>{copied?"✓ Copied":"Copy"}</button>;
};

const WeeklyDrop = ({user}) => {
  const [drop,setDrop] = useState(null); const [loading,setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      const drops = await sb.query("weekly_drops",user.token,"&is_published=eq.true&order=created_at.desc&limit=1");
      if(Array.isArray(drops)&&drops.length>0) setDrop(drops[0]);
      setLoading(false);
    })();
  },[user]);

  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  if(!drop)return(
    <div className="fi">
      <h1 className="dd" style={{fontSize:32,marginBottom:20}}>Weekly Marketing Kit</h1>
      <Empty icon="📦" title="This week's kit isn't ready yet" sub="Check back Monday morning — the Dot team publishes a fresh kit each week."/>
    </div>
  );

  const captions = [drop.caption_1,drop.caption_2,drop.caption_3].filter(Boolean);

  return(
    <div className="fi">
      {/* Header */}
      <div style={{marginBottom:28}}>
        <span className="tag" style={{background:t.accentDim,color:t.accent,marginBottom:10,display:"inline-block"}}>📦 Weekly Kit</span>
        <h1 className="dd" style={{fontSize:32,marginBottom:6}}>This Week's Marketing Kit</h1>
        <p style={{color:t.textMuted}}>{drop.week_label}{drop.theme&&<> · <strong style={{color:t.text}}>{drop.theme}</strong></>}</p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>

        {/* MONTHLY NEWSLETTER */}
        {drop.newsletter_url&&(
          <div className="card" style={{padding:24,border:`1px solid rgba(201,169,110,0.25)`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:18}}>📰</span>
                  <span className="tag" style={{background:"rgba(91,143,212,0.12)",color:t.blue}}>Monthly Newsletter</span>
                </div>
                <h3 style={{fontSize:17,fontWeight:600,marginBottom:6}}>{drop.newsletter_label||"This Month's Newsletter"}</h3>
                <p style={{fontSize:13,color:t.textMuted,lineHeight:1.6}}>{drop.newsletter_notes||"Send this to your full database. Branded and ready to go."}</p>
              </div>
              <a href={drop.newsletter_url} target="_blank" rel="noreferrer" style={{flexShrink:0}}>
                <button className="bp" style={{fontSize:13}}>↓ Get Newsletter</button>
              </a>
            </div>
          </div>
        )}

        {/* DEVELOPMENT SPOTLIGHT */}
        {drop.dev_title&&(
          <div className="card" style={{padding:24,border:`1px solid rgba(201,169,110,0.25)`}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:18}}>🏗</span>
              <span className="tag" style={{background:"rgba(201,169,110,0.12)",color:t.accent}}>Development Spotlight</span>
            </div>
            <h3 style={{fontSize:17,fontWeight:600,marginBottom:6}}>{drop.dev_title}</h3>
            {drop.dev_description&&<p style={{fontSize:13,color:t.textMuted,lineHeight:1.6,marginBottom:14}}>{drop.dev_description}</p>}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {drop.dev_email_url&&<a href={drop.dev_email_url} target="_blank" rel="noreferrer"><button className="bp" style={{fontSize:13}}>↓ Send This Email</button></a>}
              {drop.dev_brochure_url&&<a href={drop.dev_brochure_url} target="_blank" rel="noreferrer"><button className="bg" style={{fontSize:13}}>↓ Download Brochure</button></a>}
            </div>
          </div>
        )}

        {/* MARKET STATS */}
        {(drop.median_price||drop.inventory_change||drop.days_on_market||drop.list_to_sale||drop.new_listings||drop.absorption_rate)&&(
          <div className="card" style={{padding:24}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{fontSize:18}}>📊</span>
              <h3 style={{fontSize:16,fontWeight:600}}>Market Update</h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
              {[
                ["Median Sale Price",drop.median_price],
                ["Inventory Change",drop.inventory_change],
                ["Days on Market",drop.days_on_market],
                ["List-to-Sale Ratio",drop.list_to_sale],
                ["New Listings",drop.new_listings],
                ["Absorption Rate",drop.absorption_rate],
              ].filter(([,v])=>v).map(([l,v])=>(
                <div key={l} style={{padding:"14px 16px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`,textAlign:"center"}}>
                  <div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>{l}</div>
                  <div className="dd" style={{fontSize:22,color:t.accent}}>{v}</div>
                </div>
              ))}
            </div>
            {drop.market_notes&&<p style={{fontSize:13,color:t.textMuted,lineHeight:1.6,fontStyle:"italic",padding:"12px 14px",background:t.bg,borderRadius:8,border:`1px solid ${t.border}`}}>{drop.market_notes}</p>}
          </div>
        )}

        {/* SOCIAL TEMPLATES */}
        {(drop.social_template_1_url||drop.social_template_2_url)&&(
          <div className="card" style={{padding:24}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{fontSize:18}}>📱</span>
              <h3 style={{fontSize:16,fontWeight:600}}>This Week's Social Templates</h3>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {drop.social_template_1_url&&(
                <a href={drop.social_template_1_url} target="_blank" rel="noreferrer">
                  <button className="bp" style={{fontSize:13}}>↓ {drop.social_template_1_label||"Social Template 1"}</button>
                </a>
              )}
              {drop.social_template_2_url&&(
                <a href={drop.social_template_2_url} target="_blank" rel="noreferrer">
                  <button className="bg" style={{fontSize:13}}>↓ {drop.social_template_2_label||"Social Template 2"}</button>
                </a>
              )}
            </div>
          </div>
        )}

        {/* READY-TO-POST CAPTIONS */}
        {captions.length>0&&(
          <div className="card" style={{padding:24}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{fontSize:18}}>✍️</span>
              <h3 style={{fontSize:16,fontWeight:600}}>Ready-to-Post Captions</h3>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {captions.map((cap,i)=>(
                <div key={i} style={{padding:"14px 16px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                    <p style={{fontSize:13,lineHeight:1.7,color:t.text,flex:1,whiteSpace:"pre-wrap"}}>{cap}</p>
                    <CopyBtn text={cap}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REEL IDEA */}
        {drop.reel_idea&&(
          <div className="card" style={{padding:24,border:`1px solid rgba(91,143,212,0.2)`}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:18}}>🎬</span>
              <span className="tag" style={{background:"rgba(91,143,212,0.12)",color:t.blue}}>Reel Idea of the Week</span>
            </div>
            <h3 style={{fontSize:15,fontWeight:600,marginBottom:10}}>{drop.reel_title||"This Week's Reel Prompt"}</h3>
            <div style={{padding:"16px 18px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:12}}>
              <p style={{fontSize:13,lineHeight:1.8,color:t.text,whiteSpace:"pre-wrap"}}>{drop.reel_idea}</p>
            </div>
            {drop.reel_hook&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"rgba(91,143,212,0.08)",borderRadius:8,border:`1px solid rgba(91,143,212,0.2)`}}>
                <div>
                  <div style={{fontSize:10,color:t.blue,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Hook Line</div>
                  <p style={{fontSize:13,color:t.text,fontStyle:"italic"}}>"{drop.reel_hook}"</p>
                </div>
                <CopyBtn text={drop.reel_hook}/>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// ─── TEMPLATE LIBRARY ─────────────────────────────────────────────────────────
const TemplateLib = ({type,user}) => {
  const [templates,setTemplates] = useState([]); const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState(""); const [cat,setCat] = useState("all");
  const [favs,setFavs] = useState([]); const [dl,setDl] = useState([]);
  const [preview,setPreview] = useState(null);

  useEffect(()=>{
    (async()=>{
      const data = await sb.query("templates",user.token,`&type=eq.${type}&is_published=eq.true&order=category.asc,title.asc`);
      if(Array.isArray(data))setTemplates(data);
      const f = await sb.query("favorites",user.token,`&user_id=eq.${user.id}&item_type=eq.template`);
      if(Array.isArray(f))setFavs(f.map(x=>x.item_id));
      setLoading(false);
    })();
  },[type,user]);

  const toggleFav = async(id) => {
    if(favs.includes(id)){
      await sb.del("favorites",user.token,`user_id=eq.${user.id}&item_type=eq.template&item_id=eq.${id}`);
      setFavs(f=>f.filter(x=>x!==id));
    } else {
      await sb.insert("favorites",user.token,{user_id:user.id,item_type:"template",item_id:id});
      setFavs(f=>[...f,id]);
    }
  };

  const handleDl = async(tpl) => {
    await sb.patch("templates",user.token,{downloads:(tpl.downloads||0)+1},`id=eq.${tpl.id}`);
    setDl(d=>[...d,tpl.id]);
    setTemplates(ts=>ts.map(x=>x.id===tpl.id?{...x,downloads:(x.downloads||0)+1}:x));
    if(preview)setPreview(p=>({...p,downloads:(p.downloads||0)+1}));
    if(tpl.file_url)window.open(tpl.file_url,"_blank");
  };

  const cats = ["all",...new Set(templates.map(x=>x.category).filter(Boolean))];
  const filtered = templates.filter(x=>(cat==="all"||x.category===cat)&&(search===""||x.title.toLowerCase().includes(search.toLowerCase())));

  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}>
        <h1 className="dd" style={{fontSize:32,marginBottom:6}}>{type==="email"?"Email":type==="print"?"Print Materials":"Social Media"} Templates</h1>
        <p style={{color:t.textMuted}}>{type==="print"?"Postcards, booklets, beauty sheets, and print-ready files.":"Branded, plug-and-play templates ready to personalize."}</p>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:"1",minWidth:200,maxWidth:300}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search templates..."/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,textTransform:"capitalize",background:cat===c?t.accent:t.surface,color:cat===c?"#0D0D0F":t.textMuted,transition:"all 0.15s"}}>{c}</button>
          ))}
        </div>
      </div>
      {filtered.length===0
        ?<Empty icon="📄" title="No templates found" sub="Try a different search or check back later."/>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {filtered.map(tpl=>(
            <div key={tpl.id} className="card" style={{padding:20,cursor:"pointer",transition:"transform 0.15s,border-color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            >
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <span className="tag" style={{background:t.accentDim,color:t.accent}}>{tpl.category}</span>
                <button onClick={e=>{e.stopPropagation();toggleFav(tpl.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:favs.includes(tpl.id)?t.accent:t.textDim}}>★</button>
              </div>
              <h3 style={{fontSize:15,fontWeight:600,marginBottom:8}}>{tpl.title}</h3>
              {tpl.preview_text&&<p style={{fontSize:12.5,color:t.textMuted,lineHeight:1.6,marginBottom:12,fontStyle:"italic"}}>"{tpl.preview_text}"</p>}
              {type==="social"&&tpl.platform&&<div style={{fontSize:11,color:t.textDim,marginBottom:10}}>Platform: <span style={{color:t.blue}}>{tpl.platform}</span></div>}
              <div style={{fontSize:11,color:t.textDim,marginBottom:14}}>{tpl.downloads||0} downloads</div>
              <div style={{display:"flex",gap:8}}>
                <button className="bg" onClick={()=>setPreview(tpl)} style={{fontSize:12,padding:"7px 14px",flex:1}}>👁 Preview</button>
                <button className="bp" onClick={()=>handleDl(tpl)} style={{fontSize:12,padding:"7px 14px",flex:1}}>
                  {dl.includes(tpl.id)?"✓ Got it":"↓ Download"}
                </button>
              </div>
            </div>
          ))}
        </div>
      }

      {/* PREVIEW MODAL */}
      {preview&&(
        <div onClick={()=>setPreview(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:t.surface,borderRadius:16,border:`1px solid ${t.border}`,width:"100%",maxWidth:600,maxHeight:"85vh",overflow:"auto",padding:36,position:"relative"}}>
            <button onClick={()=>setPreview(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",cursor:"pointer",fontSize:20,color:t.textMuted,lineHeight:1}}>✕</button>
            
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
              <span className="tag" style={{background:t.accentDim,color:t.accent}}>{preview.category}</span>
              {preview.type&&<span className="tag" style={{background:"rgba(91,143,212,0.12)",color:t.blue,textTransform:"capitalize"}}>{preview.type}</span>}
            </div>
            <h2 className="dd" style={{fontSize:24,marginBottom:20}}>{preview.title}</h2>

            {/* Preview body */}
            <div style={{background:t.bg,borderRadius:12,padding:24,marginBottom:20,border:`1px solid ${t.border}`}}>
              <div style={{fontSize:11,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Template Preview</div>
              {preview.preview_text
                ? <p style={{fontSize:14,lineHeight:1.8,color:t.text,fontStyle:"italic",whiteSpace:"pre-wrap"}}>"{preview.preview_text}"</p>
                : <p style={{fontSize:13,color:t.textMuted,fontStyle:"italic"}}>No preview text available. Download to see the full template.</p>
              }
            </div>

            {/* What's included */}
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,color:t.textDim,marginBottom:8}}>
                <span style={{color:t.green}}>✓</span> Fully branded to your identity
              </div>
              <div style={{fontSize:12,color:t.textDim,marginBottom:8}}>
                <span style={{color:t.green}}>✓</span> Ready to personalize and send
              </div>
              <div style={{fontSize:12,color:t.textDim}}>
                <span style={{color:t.green}}>✓</span> {preview.downloads||0} agents have downloaded this
              </div>
            </div>

            <div style={{display:"flex",gap:10}}>
              <button className="bp" onClick={()=>handleDl(preview)} style={{flex:1,fontSize:14}}>
                {dl.includes(preview.id)?"✓ Downloaded — Open Again":"↓ Download Template"}
              </button>
              <button className="bg" onClick={()=>{toggleFav(preview.id);}} style={{fontSize:13}}>
                {favs.includes(preview.id)?"★ Saved":"☆ Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── CONTENT IDEAS ────────────────────────────────────────────────────────────
const ContentIdeas = ({user}) => {
  const [ideas,setIdeas] = useState([]); const [loading,setLoading] = useState(true); const [filter,setFilter] = useState("all");
  useEffect(()=>{
    (async()=>{
      const drops = await sb.query("weekly_drops",user.token,"&is_published=eq.true&order=created_at.desc&limit=1");
      if(Array.isArray(drops)&&drops.length>0){
        const d = await sb.query("content_ideas",user.token,`&weekly_drop_id=eq.${drops[0].id}`);
        if(Array.isArray(d))setIdeas(d);
      }
      setLoading(false);
    })();
  },[user]);
  const cats = ["all",...new Set(ideas.map(i=>i.category).filter(Boolean))];
  const filtered = filter==="all"?ideas:ideas.filter(i=>i.category===filter);
  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}>
        <h1 className="dd" style={{fontSize:32,marginBottom:6}}>Content Ideas</h1>
        <p style={{color:t.textMuted}}>Fresh ideas every week. Just pick one and post.</p>
      </div>
      {cats.length>1&&<div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,textTransform:"capitalize",background:filter===c?t.accent:t.surface,color:filter===c?"#0D0D0F":t.textMuted,transition:"all 0.15s"}}>{c}</button>)}
      </div>}
      {filtered.length===0
        ?<Empty icon="💡" title="No content ideas yet" sub="The Dot team will add ideas with each weekly drop."/>
        :<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map((idea,i)=>(
            <div key={i} className="card" style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:6}}>
                  <span className="tag" style={{background:t.accentDim,color:t.accent}}>{idea.type}</span>
                  {idea.category&&<span className="tag" style={{background:"rgba(91,143,212,0.12)",color:t.blue}}>{idea.category}</span>}
                </div>
                <p style={{fontSize:14,lineHeight:1.5}}>{idea.idea}</p>
              </div>
              {idea.difficulty&&<span className="tag" style={{background:idea.difficulty==="easy"?"rgba(76,175,130,0.12)":"rgba(232,200,74,0.12)",color:idea.difficulty==="easy"?t.green:t.yellow,flexShrink:0}}>{idea.difficulty}</span>}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

// ─── DEVELOPMENTS ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  coming_soon:{label:"Coming Soon",bg:"rgba(232,200,74,0.12)",color:"#E8C84A"},
  active:{label:"Active",bg:"rgba(76,175,130,0.12)",color:"#4CAF82"},
  limited:{label:"Limited Availability",bg:"rgba(201,169,110,0.12)",color:"#C9A96E"},
  sold_out:{label:"Sold Out",bg:"rgba(150,150,150,0.12)",color:"#888"},
  archived:{label:"Archived",bg:"rgba(150,150,150,0.08)",color:"#666"},
};

const DevelopmentsPage = ({user}) => {
  const [devs,setDevs] = useState([]); const [loading,setLoading] = useState(true);
  const [tab,setTab] = useState("active"); const [selected,setSelected] = useState(null);

  useEffect(()=>{
    (async()=>{
      const d = await sb.query("developments",user.token,"&order=sort_order.asc,created_at.desc");
      if(Array.isArray(d))setDevs(d);
      setLoading(false);
    })();
  },[user]);

  const active = devs.filter(d=>d.status!=="archived"&&d.status!=="sold_out");
  const archived = devs.filter(d=>d.status==="archived"||d.status==="sold_out");
  const list = tab==="active"?active:archived;

  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}>
        <h1 className="dd" style={{fontSize:32,marginBottom:6}}>Developments</h1>
        <p style={{color:t.textMuted}}>Current projects, email templates, and marketing assets for each development.</p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:24,background:t.surface,borderRadius:10,padding:4,width:"fit-content",border:`1px solid ${t.border}`}}>
        {[["active","Active Projects"],["archived","Archives"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 18px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,background:tab===k?t.accent:"transparent",color:tab===k?"#0D0D0F":t.textMuted,fontFamily:"inherit",transition:"all 0.15s"}}>{l}</button>
        ))}
      </div>

      {list.length===0
        ?<Empty icon="🏗" title={tab==="active"?"No active developments":"No archived developments"} sub={tab==="active"?"Developments will appear here when published.":"Past developments will be archived here."}/>
        :<div style={{display:"flex",flexDirection:"column",gap:16}}>
          {list.map(dev=>{
            const sc = STATUS_CONFIG[dev.status]||STATUS_CONFIG.active;
            const isOpen = selected===dev.id;
            return(
              <div key={dev.id} className="card" style={{padding:0,overflow:"hidden",border:isOpen?`1px solid ${t.accent}`:undefined}}>
                {/* Card Header */}
                <div onClick={()=>setSelected(isOpen?null:dev.id)} style={{padding:"22px 26px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                      {dev.is_featured&&<span className="tag" style={{background:t.accentDim,color:t.accent,fontSize:10}}>★ Featured</span>}
                      <span className="tag" style={{background:sc.bg,color:sc.color,fontSize:10}}>{sc.label}</span>
                      {dev.location&&<span style={{fontSize:12,color:t.textDim}}>📍 {dev.location}</span>}
                    </div>
                    <h3 className="dd" style={{fontSize:22,marginBottom:4}}>{dev.name}</h3>
                    {dev.tagline&&<p style={{fontSize:13,color:t.textMuted}}>{dev.tagline}</p>}
                  </div>
                  <div style={{display:"flex",gap:16,alignItems:"center",flexShrink:0}}>
                    {dev.price_range&&<div style={{textAlign:"right"}}><div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em"}}>Price</div><div style={{fontSize:14,fontWeight:600,color:t.accent}}>{dev.price_range}</div></div>}
                    <span style={{color:t.textDim,fontSize:18,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isOpen&&(
                  <div style={{borderTop:`1px solid ${t.border}`,padding:"24px 26px"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
                      <div>
                        {dev.description&&<p style={{fontSize:14,lineHeight:1.8,color:t.textMuted,marginBottom:20}}>{dev.description}</p>}
                        {(dev.total_units||dev.units_remaining)&&(
                          <div style={{display:"flex",gap:16,marginBottom:20}}>
                            {dev.total_units&&<div style={{padding:"12px 16px",background:t.bg,borderRadius:8,border:`1px solid ${t.border}`,textAlign:"center",flex:1}}><div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Total Units</div><div className="dd" style={{fontSize:20}}>{dev.total_units}</div></div>}
                            {dev.units_remaining&&<div style={{padding:"12px 16px",background:t.bg,borderRadius:8,border:`1px solid ${t.accent}40`,textAlign:"center",flex:1}}><div style={{fontSize:10,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Remaining</div><div className="dd" style={{fontSize:20,color:t.accent}}>{dev.units_remaining}</div></div>}
                          </div>
                        )}
                        {dev.highlights&&dev.highlights.length>0&&(
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Highlights</div>
                            {dev.highlights.map((h,i)=>(
                              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
                                <span style={{color:t.accent,fontSize:13,marginTop:1}}>✦</span>
                                <span style={{fontSize:13,color:t.textMuted,lineHeight:1.5}}>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Marketing Assets</div>
                        <div style={{display:"flex",flexDirection:"column",gap:10}}>
                          {dev.email_url&&(
                            <a href={dev.email_url} target="_blank" rel="noreferrer">
                              <div style={{padding:"14px 16px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                                  <span style={{fontSize:18}}>✉️</span>
                                  <div><div style={{fontSize:13,fontWeight:500}}>Email Template</div><div style={{fontSize:11,color:t.textDim}}>Send to your database</div></div>
                                </div>
                                <span style={{color:t.accent,fontSize:13}}>↓</span>
                              </div>
                            </a>
                          )}
                          {dev.brochure_url&&(
                            <a href={dev.brochure_url} target="_blank" rel="noreferrer">
                              <div style={{padding:"14px 16px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                                  <span style={{fontSize:18}}>📄</span>
                                  <div><div style={{fontSize:13,fontWeight:500}}>Brochure / One Pager</div><div style={{fontSize:11,color:t.textDim}}>Share with clients</div></div>
                                </div>
                                <span style={{color:t.accent,fontSize:13}}>↓</span>
                              </div>
                            </a>
                          )}
                          {dev.website_url&&(
                            <a href={dev.website_url} target="_blank" rel="noreferrer">
                              <div style={{padding:"14px 16px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                                  <span style={{fontSize:18}}>🌐</span>
                                  <div><div style={{fontSize:13,fontWeight:500}}>Project Website</div><div style={{fontSize:11,color:t.textDim}}>Send to interested buyers</div></div>
                                </div>
                                <span style={{color:t.accent,fontSize:13}}>↗</span>
                              </div>
                            </a>
                          )}
                          {!dev.email_url&&!dev.brochure_url&&!dev.website_url&&(
                            <p style={{fontSize:13,color:t.textDim,fontStyle:"italic"}}>Assets coming soon...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
    </div>
  );
};

// ─── LISTING SERVICES ─────────────────────────────────────────────────────────
const PACKAGES = [
  {id:"essential",name:"Essential Launch",price:"Starting at $495",emoji:"✦",
   includes:["Photography","Basic floor plan","Template beauty sheet","MLS-ready property summary","Social media launch graphics"]},
  {id:"signature",name:"Signature Launch",price:"Starting at $995",emoji:"✦✦",highlight:true,
   includes:["Photography","Video walkthrough / reel","Floor plan","Custom beauty sheet","Property website","Social media launch graphics","Email marketing template / blast setup"]},
  {id:"premier",name:"Premier Launch",price:"Starting at $1,750",emoji:"✦✦✦",
   includes:["Photography","Cinematic video","Drone","Floor plan","Custom beauty sheet or brochure","Property website","Social media launch graphics","Email marketing campaign","Coming soon assets","Open house marketing kit"]},
];
const ADDONS = ["Drone upgrade","Additional reel / edited video cut","Custom brochure","Extra open house graphics","Neighborhood / lifestyle feature","Coming soon campaign","Email blast upgrade","Property website upgrade","Twilight edit / virtual enhancement","Rush turnaround"];

const emptyForm = {
  // package
  package:"", addons:[],
  // section 1
  address:"",propType:"",price:"",beds:"",baths:"",sqft:"",lotSize:"",yearBuilt:"",hoa:"",parking:"",
  // section 2
  headline:"",remarks:"",neighborhood:"",upgrades:"",outdoor:"",openHouse:"",offerDeadline:"",disclosures:"",
  // section 3
  launchDate:"",shootDate:"",occupancy:"",staging:"",accessInstructions:"",accessContact:"",internalNotes:"",
};

const ListingServices = ({user}) => {
  const [reqs,setReqs] = useState([]); const [loading,setLoading] = useState(true);
  const [step,setStep] = useState(0); // 0=list, 1=package, 2=form, 3=addons
  const [form,setForm] = useState(emptyForm);
  const [submitting,setSubmitting] = useState(false); const [ok,setOk] = useState(false);

  const load = useCallback(async()=>{
    const filter = user.role==="admin"?"":` &agent_id=eq.${user.id}`;
    const d = await sb.query("listing_requests",user.token,`${filter}&order=created_at.desc`);
    if(Array.isArray(d))setReqs(d);
    setLoading(false);
  },[user]);
  useEffect(()=>{load();},[load]);

  const F = (field,placeholder,label,type="text",opts=null) => (
    <div>
      <label>{label}</label>
      {opts
        ? <select value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}>
            <option value="">Select...</option>
            {opts.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        : <input type={type} placeholder={placeholder} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}/>
      }
    </div>
  );

  const submit = async()=>{
    if(!form.address||!form.package)return;
    setSubmitting(true);
    const pkg = PACKAGES.find(p=>p.id===form.package);
    const d = await sb.insert("listing_requests",user.token,{
      agent_id:user.id,
      property_address:form.address,
      list_price:form.price,
      target_launch_date:form.launchDate||null,
      services_requested:[pkg?.name,...form.addons],
      notes:JSON.stringify({
        package:form.package,addons:form.addons,
        section1:{propType:form.propType,beds:form.beds,baths:form.baths,sqft:form.sqft,lotSize:form.lotSize,yearBuilt:form.yearBuilt,hoa:form.hoa,parking:form.parking},
        section2:{headline:form.headline,remarks:form.remarks,neighborhood:form.neighborhood,upgrades:form.upgrades,outdoor:form.outdoor,openHouse:form.openHouse,offerDeadline:form.offerDeadline,disclosures:form.disclosures},
        section3:{shootDate:form.shootDate,occupancy:form.occupancy,staging:form.staging,accessInstructions:form.accessInstructions,accessContact:form.accessContact,internalNotes:form.internalNotes},
      }),
      status:"request_submitted"
    });
    if(Array.isArray(d)&&d[0]){setReqs(r=>[d[0],...r]);setForm(emptyForm);setStep(0);setOk(true);setTimeout(()=>setOk(false),5000);}
    setSubmitting(false);
  };

  const updStatus = async(id,status)=>{
    await sb.patch("listing_requests",user.token,{status},`id=eq.${id}`);
    setReqs(rs=>rs.map(r=>r.id===id?{...r,status}:r));
  };

  const sec = {fontSize:13,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14,marginTop:8,paddingBottom:8,borderBottom:`1px solid ${t.border}`};
  const grid2 = {display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:4};
  const grid1 = {display:"grid",gridTemplateColumns:"1fr",gap:14,marginBottom:4};

  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
        <div>
          <h1 className="dd" style={{fontSize:32,marginBottom:6}}>Listing Services</h1>
          <p style={{color:t.textMuted}}>Photography, marketing assets, and launch packages for your listings.</p>
        </div>
        {step===0&&<button className="bp" onClick={()=>setStep(1)}>+ New Request</button>}
      </div>

      {ok&&<div style={{padding:"14px 18px",background:"rgba(76,175,130,0.12)",border:`1px solid ${t.green}40`,borderRadius:10,marginBottom:20,color:t.green,fontSize:14}}>✓ Request submitted! You'll receive status updates here.</div>}

      {/* STEP 1 — PACKAGE SELECTION */}
      {step===1&&(
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="bg" onClick={()=>setStep(0)} style={{fontSize:12}}>← Back</button>
            <div>
              <h2 style={{fontSize:20,fontWeight:600}}>Select Your Launch Package</h2>
              <p style={{fontSize:13,color:t.textMuted}}>Choose the package that fits your listing.</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {PACKAGES.map(pkg=>(
              <div key={pkg.id} onClick={()=>{setForm(f=>({...f,package:pkg.id}));setStep(2);}}
                style={{padding:28,borderRadius:14,border:`2px solid ${pkg.highlight?t.accent:t.border}`,background:pkg.highlight?`linear-gradient(135deg,${t.surface},${t.accentDim})`:t.surface,cursor:"pointer",transition:"all 0.2s",position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=pkg.highlight?t.accent:t.border;e.currentTarget.style.transform="translateY(0)";}}
              >
                {pkg.highlight&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:t.accent,color:"#0D0D0F",fontSize:10,fontWeight:700,padding:"3px 12px",borderRadius:"0 0 8px 8px",letterSpacing:"0.08em"}}>MOST POPULAR</div>}
                <div style={{fontSize:22,marginBottom:10,color:t.accent}}>{pkg.emoji}</div>
                <h3 className="dd" style={{fontSize:20,marginBottom:4}}>{pkg.name}</h3>
                <div style={{fontSize:13,color:t.accent,fontWeight:600,marginBottom:18}}>{pkg.price}</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {pkg.includes.map(item=>(
                    <div key={item} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <span style={{color:t.green,fontSize:13,marginTop:1,flexShrink:0}}>✓</span>
                      <span style={{fontSize:13,color:t.textMuted,lineHeight:1.4}}>{item}</span>
                    </div>
                  ))}
                </div>
                <button className="bp" style={{width:"100%",marginTop:22,fontSize:13}}>Select {pkg.name} →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 — INTAKE FORM */}
      {step===2&&(
        <div className="card" style={{padding:32,marginBottom:24,border:`1px solid rgba(201,169,110,0.3)`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
            <button className="bg" onClick={()=>setStep(1)} style={{fontSize:12}}>← Back</button>
            <div>
              <h2 style={{fontSize:20,fontWeight:600}}>Listing Intake Form</h2>
              <div style={{fontSize:13,color:t.accent,marginTop:2}}>Package: {PACKAGES.find(p=>p.id===form.package)?.name} — {PACKAGES.find(p=>p.id===form.package)?.price}</div>
            </div>
          </div>

          <div style={sec}>Section 1 — Listing Basics</div>
          <div style={grid2}>
            {F("address","142 Maple St, Boston MA","Property Address *")}
            {F("propType","","Property Type",null,["Single Family","Condo","Townhouse","Multi-Family","Land","Commercial"])}
            {F("price","$595,000","List Price")}
            {F("beds","3","Bedrooms")}
            {F("baths","2","Bathrooms")}
            {F("sqft","1,850","Square Footage")}
            {F("lotSize","0.25 acres","Lot Size")}
            {F("yearBuilt","2002","Year Built")}
            {F("hoa","$250/mo","HOA Fee")}
            {F("parking","2-car garage","Parking")}
          </div>

          <div style={{...sec,marginTop:28}}>Section 2 — Marketing Content</div>
          <div style={grid1}>
            {F("headline","Stunning renovated colonial steps from the common...","Public-Facing Headline")}
          </div>
          <div style={{marginBottom:14}}>
            <label>Public Remarks / Property Description</label>
            <textarea placeholder="Describe the property for MLS and marketing..." value={form.remarks} onChange={e=>setForm(f=>({...f,remarks:e.target.value}))} style={{minHeight:100}}/>
          </div>
          <div style={grid2}>
            {F("neighborhood","Close to downtown, top-rated schools...","Neighborhood / Location Highlights")}
            {F("upgrades","New kitchen 2022, roof 2020...","Notable Upgrades / Renovations")}
            {F("outdoor","Large deck, fenced yard, fire pit...","Outdoor Space")}
            {F("openHouse","Sunday March 23, 1–3pm","Open House Date(s)")}
            {F("offerDeadline","Monday March 24 at 5pm","Offer Deadline")}
          </div>
          <div style={{marginBottom:14}}>
            <label>Disclosure / Disclaimer Notes</label>
            <textarea placeholder="Any disclosures agents should know..." value={form.disclosures} onChange={e=>setForm(f=>({...f,disclosures:e.target.value}))}/>
          </div>

          <div style={{...sec,marginTop:28}}>Section 3 — Logistics</div>
          <div style={grid2}>
            {F("launchDate","","Target Launch Date","date")}
            {F("shootDate","","Preferred Shoot Date","date")}
            {F("occupancy","","Occupancy Status",null,["Owner Occupied","Tenant Occupied","Vacant","New Construction"])}
            {F("staging","","Staging Status",null,["Fully Staged","Partially Staged","Seller Furnished","Vacant","Virtual Only"])}
            {F("accessContact","Jane Smith · 617-555-0199","Property Access Contact")}
          </div>
          <div style={{marginBottom:14}}>
            <label>Access Instructions</label>
            <textarea placeholder="Lockbox code, key pickup, showing instructions..." value={form.accessInstructions} onChange={e=>setForm(f=>({...f,accessInstructions:e.target.value}))}/>
          </div>
          <div style={{marginBottom:20}}>
            <label>Internal Notes / Special Instructions</label>
            <textarea placeholder="Anything the Dot team should know..." value={form.internalNotes} onChange={e=>setForm(f=>({...f,internalNotes:e.target.value}))}/>
          </div>

          <div style={{display:"flex",gap:10}}>
            <button className="bp" onClick={()=>setStep(3)} disabled={!form.address}>Continue to Add-Ons →</button>
            <button className="bg" onClick={()=>{setStep(0);setForm(emptyForm);}}>Cancel</button>
          </div>
        </div>
      )}

      {/* STEP 3 — ADD-ONS */}
      {step===3&&(
        <div className="card" style={{padding:32,marginBottom:24,border:`1px solid rgba(201,169,110,0.3)`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="bg" onClick={()=>setStep(2)} style={{fontSize:12}}>← Back</button>
            <div>
              <h2 style={{fontSize:20,fontWeight:600}}>Optional Add-Ons</h2>
              <p style={{fontSize:13,color:t.textMuted}}>Enhance your {PACKAGES.find(p=>p.id===form.package)?.name} package.</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:28}}>
            {ADDONS.map(a=>{
              const sel = form.addons.includes(a);
              return(
                <div key={a} onClick={()=>setForm(f=>({...f,addons:sel?f.addons.filter(x=>x!==a):[...f.addons,a]}))}
                  style={{padding:"14px 18px",borderRadius:10,border:`1px solid ${sel?t.accent:t.border}`,background:sel?t.accentDim:t.surface,cursor:"pointer",display:"flex",gap:12,alignItems:"center",transition:"all 0.15s"}}>
                  <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${sel?t.accent:t.border}`,background:sel?t.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                    {sel&&<span style={{color:"#0D0D0F",fontSize:12,fontWeight:700}}>✓</span>}
                  </div>
                  <span style={{fontSize:13,color:sel?t.accent:t.text}}>{a}</span>
                </div>
              );
            })}
          </div>
          <div style={{padding:"16px 20px",background:t.bg,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Order Summary</div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
              <span>{PACKAGES.find(p=>p.id===form.package)?.name}</span>
              <span style={{color:t.accent}}>{PACKAGES.find(p=>p.id===form.package)?.price}</span>
            </div>
            {form.addons.map(a=>(
              <div key={a} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:t.textMuted,marginBottom:2}}>
                <span>+ {a}</span><span>TBD</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${t.border}`,marginTop:12,paddingTop:10,fontSize:12,color:t.textDim}}>Final pricing confirmed by Dot team after review.</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button className="bp" onClick={submit} disabled={submitting||!form.address}>{submitting?<Spin/>:"Submit Request →"}</button>
            <button className="bg" onClick={()=>{setStep(0);setForm(emptyForm);}}>Cancel</button>
          </div>
        </div>
      )}

      {/* REQUEST LIST */}
      {step===0&&(
        reqs.length===0
          ?<Empty icon="🏡" title="No requests yet" sub="Submit your first listing service request above." action={<button className="bp" onClick={()=>setStep(1)}>+ New Request</button>}/>
          :<div style={{display:"flex",flexDirection:"column",gap:12}}>
            {reqs.map(req=>{
              const s = sc(req.status);
              let pkg = ""; try{ pkg = JSON.parse(req.notes||"{}").package||""; }catch(e){}
              const pkgName = PACKAGES.find(p=>p.id===pkg)?.name||req.services_requested?.[0]||"";
              return(
                <div key={req.id} className="card" style={{padding:"20px 24px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <h3 style={{fontSize:15,fontWeight:600,marginBottom:6}}>{req.property_address}</h3>
                      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                        {pkgName&&<span className="tag" style={{background:t.accentDim,color:t.accent}}>{pkgName}</span>}
                        {req.list_price&&<span style={{fontSize:12.5,color:t.textMuted}}>List: {req.list_price}</span>}
                        <span style={{fontSize:12.5,color:t.textDim}}>{new Date(req.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
                      <span className="sb" style={{background:s.bg,color:s.color}}>{fs(req.status)}</span>
                      {user.role==="admin"&&(
                        <select value={req.status} onChange={e=>updStatus(req.id,e.target.value)} style={{width:"auto",fontSize:12,padding:"4px 8px"}}>
                          {["request_submitted","under_review","scheduled","in_progress","waiting_on_agent","completed","delivered"].map(x=><option key={x} value={x}>{fs(x)}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
};

// ─── ASSET DELIVERY ───────────────────────────────────────────────────────────
const AssetDelivery = ({user}) => {
  const [reqs,setReqs] = useState([]); const [idx,setIdx] = useState(0);
  const [assets,setAssets] = useState([]); const [loading,setLoading] = useState(true);
  const [uploading,setUploading] = useState(false); const [dragOver,setDragOver] = useState(false);
  const [uploadProgress,setUploadProgress] = useState("");
  const fileInputRef = useCallback(node => { if(node) node.value = ""; }, []);

  useEffect(()=>{
    (async()=>{
      const filter = user.role==="admin"?"":` &agent_id=eq.${user.id}`;
      const r = await sb.query("listing_requests",user.token,`${filter}&order=created_at.desc`);
      if(Array.isArray(r)&&r.length>0){
        setReqs(r);
        const a = await sb.query("assets",user.token,`&request_id=eq.${r[0].id}&order=created_at.desc`);
        if(Array.isArray(a))setAssets(a);
      }
      setLoading(false);
    })();
  },[user]);

  const loadAssets = async(rid)=>{
    const a = await sb.query("assets",user.token,`&request_id=eq.${rid}&order=created_at.desc`);
    if(Array.isArray(a))setAssets(a);
  };

  const uploadFile = async(file)=>{
    if(!file||!reqs[idx])return;
    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    try {
      // Upload to Supabase Storage
      const filePath = `${reqs[idx].id}/${Date.now()}_${file.name}`;
      const uploadResp = await fetch(`${SUPABASE_URL}/storage/v1/object/assets/${filePath}`, {
        method: "POST",
        headers: { ...sb.authHeaders(user.token), "Content-Type": file.type },
        body: file
      });
      if(!uploadResp.ok) throw new Error("Upload failed");

      // Get signed download URL
      const urlResp = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/assets/${filePath}`, {
        method: "POST",
        headers: { ...sb.authHeaders(user.token), "Content-Type": "application/json" },
        body: JSON.stringify({ expiresIn: 31536000 }) // 1 year
      });
      const urlData = await urlResp.json();
      const fileUrl = urlData.signedURL ? `${SUPABASE_URL}/storage/v1${urlData.signedURL}` : "#";

      // Save record to assets table
      const d = await sb.insert("assets",user.token,{
        request_id:reqs[idx].id, uploaded_by:user.id,
        direction:user.role==="admin"?"team_to_agent":"agent_to_team",
        file_name:file.name, file_url:fileUrl,
        file_type:file.type||"File", file_size:file.size,
      });
      if(Array.isArray(d)&&d[0])setAssets(a=>[d[0],...a]);
      setUploadProgress("✓ Upload complete!");
      setTimeout(()=>setUploadProgress(""),3000);
    } catch(e) {
      setUploadProgress("Upload failed. Please try again.");
      setTimeout(()=>setUploadProgress(""),3000);
    }
    setUploading(false);
  };

  const handleFileInput = (e)=>{ if(e.target.files[0]) uploadFile(e.target.files[0]); };
  const handleDrop = (e)=>{ e.preventDefault(); setDragOver(false); if(e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]); };

  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}>
        <h1 className="dd" style={{fontSize:32,marginBottom:6}}>Asset Delivery</h1>
        <p style={{color:t.textMuted}}>Upload and download files for each listing.</p>
      </div>
      {reqs.length===0
        ?<Empty icon="⬡" title="No listings yet" sub="Submit a listing service request first to manage assets."/>
        :<div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {reqs.map((r,i)=>{const s=sc(r.status);return(
              <div key={r.id} onClick={()=>{setIdx(i);loadAssets(r.id);}} className="card" style={{padding:"14px 16px",cursor:"pointer",border:idx===i?`1px solid ${t.accent}`:undefined,background:idx===i?t.accentDim:t.surface}}>
                <div style={{fontSize:13,fontWeight:500,marginBottom:6}}>{r.property_address?.split(",")[0]}</div>
                <span className="sb" style={{background:s.bg,color:s.color,fontSize:10}}>{fs(r.status)}</span>
              </div>
            );})}
          </div>
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:4}}>{reqs[idx]?.property_address}</h3>
            <p style={{fontSize:13,color:t.textMuted,marginBottom:20}}>All files for this listing.</p>
            {assets.length===0
              ?<Empty icon="📁" title="No files yet" sub="Drag and drop a file below or click to upload."/>
              :<div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {assets.map((f,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:t.bg,borderRadius:8,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <span style={{fontSize:20}}>{f.direction==="team_to_agent"?"📦":"📄"}</span>
                      <div>
                        <div style={{fontSize:13.5,fontWeight:500}}>{f.file_name}</div>
                        <div style={{fontSize:11,color:t.textDim}}>
                          {f.file_type} · {new Date(f.created_at).toLocaleDateString()}
                          {f.file_size&&` · ${(f.file_size/1024/1024).toFixed(1)}MB`}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span className="tag" style={{background:f.direction==="team_to_agent"?"rgba(76,175,130,0.12)":"rgba(91,143,212,0.12)",color:f.direction==="team_to_agent"?t.green:t.blue}}>{f.direction==="team_to_agent"?"From Dot":"From You"}</span>
                      {f.file_url&&f.file_url!=="#"&&<a href={f.file_url} target="_blank" rel="noreferrer"><button className="bg" style={{fontSize:11,padding:"5px 10px"}}>↓ Download</button></a>}
                    </div>
                  </div>
                ))}
              </div>
            }

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={e=>{e.preventDefault();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={handleDrop}
              onClick={()=>document.getElementById("fileInput").click()}
              style={{padding:"32px 20px",background:dragOver?t.accentDim:t.bg,borderRadius:10,border:`2px dashed ${dragOver?t.accent:t.borderLight}`,textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}
            >
              <div style={{fontSize:32,marginBottom:10}}>☁️</div>
              {uploading
                ? <><div style={{fontSize:14,color:t.accent,marginBottom:4}}><Spin/> {uploadProgress}</div></>
                : uploadProgress
                  ? <div style={{fontSize:14,color:t.green}}>{uploadProgress}</div>
                  : <>
                      <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>Drag & drop files here</div>
                      <div style={{fontSize:12,color:t.textMuted}}>or click to browse — photos, PDFs, videos, anything</div>
                    </>
              }
              <input id="fileInput" type="file" ref={fileInputRef} onChange={handleFileInput} style={{display:"none"}} multiple={false}/>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

// ─── TRAINING / VIDEOS / RESOURCES ───────────────────────────────────────────
const Courses = ({user}) => {
  const [courses,setCourses] = useState([]); const [loading,setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      const d = await sb.query("courses",user.token,"&is_published=eq.true&order=sort_order.asc");
      if(Array.isArray(d))setCourses(d); setLoading(false);
    })();
  },[user]);
  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}><h1 className="dd" style={{fontSize:32,marginBottom:6}}>Courses</h1><p style={{color:t.textMuted}}>Structured learning to build your business and brand.</p></div>
      {courses.length===0
        ?<Empty icon="🎓" title="No courses yet" sub="The Dot team is building courses for you. Check back soon!"/>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {courses.map(c=>(
            <div key={c.id} className="card" style={{padding:22}}>
              <div style={{fontSize:36,marginBottom:14}}>{c.thumbnail_emoji||"📚"}</div>
              {c.category&&<span className="tag" style={{background:t.accentDim,color:t.accent,marginBottom:10,display:"inline-block"}}>{c.category}</span>}
              <h3 style={{fontSize:16,fontWeight:600,marginBottom:6}}>{c.title}</h3>
              {c.description&&<p style={{fontSize:13,color:t.textMuted,marginBottom:10,lineHeight:1.5}}>{c.description}</p>}
              <p style={{fontSize:12,color:t.textDim,marginBottom:16}}>{c.total_lessons} lessons · {c.duration_label}</p>
              <button className="bp" style={{width:"100%",fontSize:13}}>Start Course →</button>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

const Videos = ({user}) => {
  const [vids,setVids] = useState([]); const [loading,setLoading] = useState(true); const [search,setSearch] = useState("");
  useEffect(()=>{
    (async()=>{
      const d = await sb.query("videos",user.token,"&is_published=eq.true&order=created_at.desc");
      if(Array.isArray(d))setVids(d); setLoading(false);
    })();
  },[user]);
  const filtered = vids.filter(v=>v.title.toLowerCase().includes(search.toLowerCase()));
  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}><h1 className="dd" style={{fontSize:32,marginBottom:6}}>Video Library</h1><p style={{color:t.textMuted}}>Training videos, coaching replays, and marketing examples.</p></div>
      <div style={{maxWidth:360,marginBottom:20}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search videos..."/></div>
      {filtered.length===0
        ?<Empty icon="▶" title="No videos yet" sub="The Dot team will upload training videos here."/>
        :<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {filtered.map(v=>(
            <div key={v.id} className="card" style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:48,height:48,background:t.accentDim,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{color:t.accent,fontSize:18}}>▶</span>
              </div>
              <div style={{flex:1}}>
                <h3 style={{fontSize:14.5,fontWeight:500,marginBottom:4}}>{v.title}</h3>
                <div style={{display:"flex",gap:10}}>
                  {v.category&&<span className="tag" style={{background:t.border,color:t.textMuted}}>{v.category}</span>}
                  {v.duration_label&&<span style={{fontSize:12,color:t.textDim}}>{v.duration_label}</span>}
                  <span style={{fontSize:12,color:t.textDim}}>{v.views} views</span>
                </div>
              </div>
              {v.video_url
                ?<a href={v.video_url} target="_blank" rel="noreferrer"><button className="bg" style={{fontSize:12}}>Watch</button></a>
                :<button className="bg" style={{fontSize:12}}>Watch</button>
              }
            </div>
          ))}
        </div>
      }
    </div>
  );
};

const Resources = ({user}) => {
  const [res,setRes] = useState([]); const [loading,setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      const d = await sb.query("resource_downloads",user.token,"&is_published=eq.true&order=created_at.desc");
      if(Array.isArray(d))setRes(d); setLoading(false);
    })();
  },[user]);
  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:28}}><h1 className="dd" style={{fontSize:32,marginBottom:6}}>Resource Downloads</h1><p style={{color:t.textMuted}}>Worksheets, checklists, scripts, and SOPs.</p></div>
      {res.length===0
        ?<Empty icon="📄" title="No resources yet" sub="Downloadable resources will appear here."/>
        :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {res.map(r=>(
            <div key={r.id} className="card" style={{padding:20}}>
              <div style={{fontSize:28,marginBottom:12}}>📄</div>
              {r.type&&<span className="tag" style={{background:t.border,color:t.textMuted,marginBottom:8,display:"inline-block"}}>{r.type}</span>}
              <h3 style={{fontSize:14.5,fontWeight:500,marginBottom:14}}>{r.title}</h3>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:t.textDim}}>{r.format}</span>
                {r.file_url
                  ?<a href={r.file_url} target="_blank" rel="noreferrer"><button className="bg" style={{fontSize:11,padding:"5px 10px"}}>↓ Download</button></a>
                  :<button className="bg" style={{fontSize:11,padding:"5px 10px"}}>↓ Download</button>
                }
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

// ─── BILLING ──────────────────────────────────────────────────────────────────
const Billing = ({user}) => {
  const tiers = [
    {id:"basic",name:"Basic",price:"$49/mo",features:["Marketing Hub access","Email templates","Social templates","Weekly content ideas","Weekly market drop"]},
    {id:"pro",name:"Pro",price:"$99/mo",features:["Everything in Basic","Listing Services portal","Asset delivery portal","Video library","Premium templates","Resource downloads"]},
    {id:"premium",name:"Collective",price:"$179/mo",features:["Everything in Pro","Full course library","Coaching call replays","Priority service requests","Service discounts"]},
  ];
  const cur = user.tier||"basic";
  return(
    <div className="fi">
      <div style={{marginBottom:28}}>
        <h1 className="dd" style={{fontSize:32,marginBottom:6}}>Membership</h1>
        <p style={{color:t.textMuted}}>You're on the <strong style={{color:t.accent}}>{cur.charAt(0).toUpperCase()+cur.slice(1)}</strong> plan.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
        {tiers.map(tier=>(
          <div key={tier.id} className="card" style={{padding:28,position:"relative",border:tier.id==="pro"?`1px solid ${t.accent}`:tier.id===cur?`1px solid ${t.green}`:undefined}}>
            {tier.id==="pro"&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:t.accent,color:"#0D0D0F",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:20}}>MOST POPULAR</div>}
            {tier.id===cur&&<div style={{position:"absolute",top:-12,right:20,background:t.green,color:"#0D0D0F",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20}}>CURRENT</div>}
            <h3 className="dd" style={{fontSize:22,fontWeight:600,marginBottom:4}}>{tier.name}</h3>
            <div style={{fontSize:26,fontWeight:700,color:t.accent,marginBottom:20}}>{tier.price}</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
              {tier.features.map((f,i)=><div key={i} style={{display:"flex",gap:8}}><span style={{color:t.green,fontSize:12,marginTop:2}}>✓</span><span style={{fontSize:13,color:t.textMuted}}>{f}</span></div>)}
            </div>
            <button className={tier.id===cur?"bg":"bp"} style={{width:"100%"}}>{tier.id===cur?"Current Plan":"Upgrade →"}</button>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:22}}>
        <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Account Details</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[["Name",user.name||"—"],["Email",user.email],["Role",user.role||"agent"],["Member Since",user.joined_at?new Date(user.joined_at).toLocaleDateString():"—"]].map(([k,v])=>(
            <div key={k}>
              <div style={{fontSize:11,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{k}</div>
              <div style={{fontSize:14.5}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
const Admin = ({user}) => {
  const [tab,setTab] = useState("overview");
  const [users,setUsers] = useState([]); const [stats,setStats] = useState({});
  const [loading,setLoading] = useState(true);
  const [tpl,setTpl] = useState({title:"",type:"email",category:"",preview_text:"",file_url:""});
  const [drop,setDrop] = useState({week_label:"",theme:"",newsletter_label:"",newsletter_url:"",newsletter_notes:"",dev_title:"",dev_description:"",dev_email_url:"",dev_brochure_url:"",median_price:"",inventory_change:"",days_on_market:"",list_to_sale:"",new_listings:"",absorption_rate:"",market_notes:"",social_template_1_url:"",social_template_1_label:"",social_template_2_url:"",social_template_2_label:"",caption_1:"",caption_2:"",caption_3:"",reel_title:"",reel_idea:"",reel_hook:""});
  const [vid,setVid] = useState({title:"",category:"",video_url:"",duration_label:""});
  const [course,setCourse] = useState({title:"",category:"",description:"",duration_label:"",thumbnail_emoji:"📚",total_lessons:0});
  const [dl,setDl] = useState({title:"",type:"",format:"PDF",file_url:""});
  const [dev,setDev] = useState({name:"",tagline:"",description:"",status:"active",price_range:"",location:"",total_units:"",units_remaining:"",email_url:"",brochure_url:"",website_url:"",highlights:["","",""],is_featured:false});
  const [saving,setSaving] = useState(false); const [msg,setMsg] = useState("");

  useEffect(()=>{
    (async()=>{
      const [p,tpls,reqs,crs] = await Promise.all([
        sb.query("profiles",user.token,""),
        sb.query("templates",user.token,""),
        sb.query("listing_requests",user.token,""),
        sb.query("courses",user.token,""),
      ]);
      if(Array.isArray(p))setUsers(p);
      setStats({
        members:Array.isArray(p)?p.length:0,
        templates:Array.isArray(tpls)?tpls.length:0,
        requests:Array.isArray(reqs)?reqs.filter(r=>!["completed","delivered"].includes(r.status)).length:0,
        courses:Array.isArray(crs)?crs.length:0,
      });
      setLoading(false);
    })();
  },[user]);

  const save = async(fn,reset,successMsg)=>{
    setSaving(true); await fn(); setMsg(successMsg); reset(); setTimeout(()=>setMsg(""),3000); setSaving(false);
  };

  const updUser = async(uid,field,val)=>{
    await sb.patch("profiles",user.token,{[field]:val},`id=eq.${uid}`);
    setUsers(us=>us.map(u=>u.id===uid?{...u,[field]:val}:u));
  };

  if(loading)return <div style={{padding:40,textAlign:"center"}}><Spin/></div>;
  return(
    <div className="fi">
      <div style={{marginBottom:24}}><h1 className="dd" style={{fontSize:32,marginBottom:6}}>Admin Panel</h1><p style={{color:t.textMuted}}>Manage members, content, and requests.</p></div>
      <div style={{display:"flex",gap:4,marginBottom:24,background:t.surface,borderRadius:10,padding:4,width:"fit-content",border:`1px solid ${t.border}`}}>
        {["overview","members","templates","weekly drop","videos","courses","downloads","developments"].map(x=>(
          <button key={x} onClick={()=>setTab(x)} style={{padding:"8px 16px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:500,textTransform:"capitalize",background:tab===x?t.accent:"transparent",color:tab===x?"#0D0D0F":t.textMuted,fontFamily:"inherit",transition:"all 0.15s"}}>{x}</button>
        ))}
      </div>
      {msg&&<div style={{padding:"12px 16px",background:"rgba(76,175,130,0.12)",border:`1px solid ${t.green}40`,borderRadius:8,marginBottom:16,color:t.green,fontSize:13}}>{msg}</div>}

      {tab==="overview"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            {[["Total Members",stats.members,t.accent],["Active Requests",stats.requests,t.blue],["Templates",stats.templates,t.purple],["Courses",stats.courses,t.green]].map(([l,v,c])=>(
              <div key={l} className="card" style={{padding:"20px 22px"}}>
                <div style={{fontSize:11,color:t.textDim,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>{l}</div>
                <div className="dd" style={{fontSize:32,color:c}}>{v}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:22}}>
            <h3 style={{fontSize:15,fontWeight:600,marginBottom:14}}>Quick Actions</h3>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {["templates","weekly drop","videos","courses","downloads","developments"].map(x=><button key={x} className="bg" onClick={()=>setTab(x)} style={{textTransform:"capitalize",fontSize:13}}>+ Add {x}</button>)}
            </div>
          </div>
        </div>
      )}

      {tab==="members"&&(
        <div className="card" style={{padding:22}}>
          <h3 style={{fontSize:15,fontWeight:600,marginBottom:18}}>All Members ({users.length})</h3>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {users.map(u=>(
              <div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:8,background:t.bg}}>
                <div>
                  <span style={{fontSize:14,fontWeight:500}}>{u.full_name||"—"}</span>
                  <span style={{fontSize:12,color:t.textDim,marginLeft:10}}>{u.email}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <select value={u.tier||"basic"} onChange={e=>updUser(u.id,"tier",e.target.value)} style={{width:"auto",fontSize:12,padding:"4px 8px"}}>
                    <option value="basic">Basic</option><option value="pro">Pro</option><option value="premium">Premium</option>
                  </select>
                  <select value={u.role||"agent"} onChange={e=>updUser(u.id,"role",e.target.value)} style={{width:"auto",fontSize:12,padding:"4px 8px"}}>
                    <option value="agent">Agent</option><option value="admin">Admin</option><option value="creative_team">Creative Team</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="templates"&&(
        <div className="card" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>Publish New Template</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label>Title *</label><input value={tpl.title} onChange={e=>setTpl(f=>({...f,title:e.target.value}))} placeholder="Just Listed Announcement"/></div>
            <div><label>Type</label><select value={tpl.type} onChange={e=>setTpl(f=>({...f,type:e.target.value}))}><option value="email">Email</option><option value="social">Social</option></select></div>
            <div><label>Category</label><input value={tpl.category} onChange={e=>setTpl(f=>({...f,category:e.target.value}))} placeholder="listing, market, events..."/></div>
            <div><label>File URL</label><input value={tpl.file_url} onChange={e=>setTpl(f=>({...f,file_url:e.target.value}))} placeholder="https://..."/></div>
          </div>
          <div style={{marginBottom:18}}><label>Preview Text</label><textarea value={tpl.preview_text} onChange={e=>setTpl(f=>({...f,preview_text:e.target.value}))} placeholder="Short preview..."/></div>
          <button className="bp" onClick={()=>save(()=>sb.insert("templates",user.token,{...tpl,is_published:true}),()=>setTpl({title:"",type:"email",category:"",preview_text:"",file_url:""}),"✓ Template published!")} disabled={saving||!tpl.title}>{saving?<Spin/>:"Publish Template →"}</button>
        </div>
      )}

      {tab==="weekly drop"&&(
        <div className="card" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:6}}>Publish Weekly Marketing Kit</h3>
          <p style={{fontSize:13,color:t.textMuted,marginBottom:24}}>Fill in the sections you have this week — empty sections won't show to agents.</p>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>Basics</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div><label>Week Label *</label><input value={drop.week_label} onChange={e=>setDrop(f=>({...f,week_label:e.target.value}))} placeholder="Week of March 18, 2026"/></div>
            <div><label>Theme / Focus</label><input value={drop.theme} onChange={e=>setDrop(f=>({...f,theme:e.target.value}))} placeholder="Spring Market Momentum"/></div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>📰 Monthly Newsletter</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div><label>Newsletter Label</label><input value={drop.newsletter_label} onChange={e=>setDrop(f=>({...f,newsletter_label:e.target.value}))} placeholder="March 2026 Newsletter"/></div>
            <div><label>Canva / Link URL</label><input value={drop.newsletter_url} onChange={e=>setDrop(f=>({...f,newsletter_url:e.target.value}))} placeholder="https://..."/></div>
            <div style={{gridColumn:"1/-1"}}><label>Notes for agents</label><input value={drop.newsletter_notes} onChange={e=>setDrop(f=>({...f,newsletter_notes:e.target.value}))} placeholder="Send to your full database this week"/></div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>🏗 Development Spotlight</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div><label>Development Name</label><input value={drop.dev_title} onChange={e=>setDrop(f=>({...f,dev_title:e.target.value}))} placeholder="The Guild / Copia"/></div>
            <div><label>Email Template URL</label><input value={drop.dev_email_url} onChange={e=>setDrop(f=>({...f,dev_email_url:e.target.value}))} placeholder="https://canva.com/..."/></div>
            <div><label>Brochure URL</label><input value={drop.dev_brochure_url} onChange={e=>setDrop(f=>({...f,dev_brochure_url:e.target.value}))} placeholder="https://..."/></div>
            <div style={{gridColumn:"1/-1"}}><label>Description</label><textarea value={drop.dev_description} onChange={e=>setDrop(f=>({...f,dev_description:e.target.value}))} placeholder="Brief description agents can reference..."/></div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>📊 Market Stats</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div><label>Median Sale Price</label><input value={drop.median_price} onChange={e=>setDrop(f=>({...f,median_price:e.target.value}))} placeholder="$649,000"/></div>
            <div><label>Inventory Change</label><input value={drop.inventory_change} onChange={e=>setDrop(f=>({...f,inventory_change:e.target.value}))} placeholder="↓ 12%"/></div>
            <div><label>Days on Market</label><input value={drop.days_on_market} onChange={e=>setDrop(f=>({...f,days_on_market:e.target.value}))} placeholder="21 days"/></div>
            <div><label>List-to-Sale Ratio</label><input value={drop.list_to_sale} onChange={e=>setDrop(f=>({...f,list_to_sale:e.target.value}))} placeholder="103%"/></div>
            <div><label>New Listings</label><input value={drop.new_listings} onChange={e=>setDrop(f=>({...f,new_listings:e.target.value}))} placeholder="142"/></div>
            <div><label>Absorption Rate</label><input value={drop.absorption_rate} onChange={e=>setDrop(f=>({...f,absorption_rate:e.target.value}))} placeholder="2.1 months"/></div>
            <div style={{gridColumn:"1/-1"}}><label>Market Commentary (optional)</label><textarea value={drop.market_notes} onChange={e=>setDrop(f=>({...f,market_notes:e.target.value}))} placeholder="Brief note agents can reference when talking to clients..."/></div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>📱 Social Templates</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div><label>Template 1 Label</label><input value={drop.social_template_1_label} onChange={e=>setDrop(f=>({...f,social_template_1_label:e.target.value}))} placeholder="Market Update Graphic"/></div>
            <div><label>Template 1 URL</label><input value={drop.social_template_1_url} onChange={e=>setDrop(f=>({...f,social_template_1_url:e.target.value}))} placeholder="https://canva.com/..."/></div>
            <div><label>Template 2 Label</label><input value={drop.social_template_2_label} onChange={e=>setDrop(f=>({...f,social_template_2_label:e.target.value}))} placeholder="Development Story"/></div>
            <div><label>Template 2 URL</label><input value={drop.social_template_2_url} onChange={e=>setDrop(f=>({...f,social_template_2_url:e.target.value}))} placeholder="https://canva.com/..."/></div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>✍️ Ready-to-Post Captions</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            <div><label>Caption 1</label><textarea value={drop.caption_1} onChange={e=>setDrop(f=>({...f,caption_1:e.target.value}))} placeholder="The market is moving — here's what you need to know this week in Boston..."/></div>
            <div><label>Caption 2</label><textarea value={drop.caption_2} onChange={e=>setDrop(f=>({...f,caption_2:e.target.value}))} placeholder="Thinking about buying? Here's why right now might be your window..."/></div>
            <div><label>Caption 3</label><textarea value={drop.caption_3} onChange={e=>setDrop(f=>({...f,caption_3:e.target.value}))} placeholder="Optional third caption..."/></div>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>🎬 Reel Idea of the Week</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
            <div><label>Reel Title</label><input value={drop.reel_title} onChange={e=>setDrop(f=>({...f,reel_title:e.target.value}))} placeholder="Why Buyers Are Back This Spring"/></div>
            <div><label>Hook Line (copy/paste ready)</label><input value={drop.reel_hook} onChange={e=>setDrop(f=>({...f,reel_hook:e.target.value}))} placeholder="If you've been waiting to buy, watch this..."/></div>
            <div style={{gridColumn:"1/-1"}}><label>Reel Script / Prompt</label><textarea value={drop.reel_idea} onChange={e=>setDrop(f=>({...f,reel_idea:e.target.value}))} placeholder="Film yourself walking through why spring is a strong time to buy. Cover 3 points: inventory, rates, and competition. Keep it under 60 seconds. End with a CTA to DM you."/></div>
          </div>

          <button className="bp" onClick={()=>save(()=>sb.insert("weekly_drops",user.token,{...drop,is_published:true}),()=>setDrop({week_label:"",theme:"",newsletter_label:"",newsletter_url:"",newsletter_notes:"",dev_title:"",dev_description:"",dev_email_url:"",dev_brochure_url:"",median_price:"",inventory_change:"",days_on_market:"",list_to_sale:"",new_listings:"",absorption_rate:"",market_notes:"",social_template_1_url:"",social_template_1_label:"",social_template_2_url:"",social_template_2_label:"",caption_1:"",caption_2:"",caption_3:"",reel_title:"",reel_idea:"",reel_hook:""}),"✓ Weekly kit published!")} disabled={saving||!drop.week_label}>{saving?<Spin/>:"Publish This Week's Kit →"}</button>
        </div>
      )}

      {tab==="videos"&&(
        <div className="card" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>Publish New Video</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
            <div><label>Title *</label><input value={vid.title} onChange={e=>setVid(f=>({...f,title:e.target.value}))} placeholder="Listing Presentation Script"/></div>
            <div><label>Category</label><input value={vid.category} onChange={e=>setVid(f=>({...f,category:e.target.value}))} placeholder="coaching, scripts, platform..."/></div>
            <div><label>Video URL</label><input value={vid.video_url} onChange={e=>setVid(f=>({...f,video_url:e.target.value}))} placeholder="https://vimeo.com/..."/></div>
            <div><label>Duration</label><input value={vid.duration_label} onChange={e=>setVid(f=>({...f,duration_label:e.target.value}))} placeholder="14:20"/></div>
          </div>
          <button className="bp" onClick={()=>save(()=>sb.insert("videos",user.token,{...vid,is_published:true}),()=>setVid({title:"",category:"",video_url:"",duration_label:""}),"✓ Video published!")} disabled={saving||!vid.title}>{saving?<Spin/>:"Publish Video →"}</button>
        </div>
      )}

      {tab==="courses"&&(
        <div className="card" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>Publish New Course</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label>Title *</label><input value={course.title} onChange={e=>setCourse(f=>({...f,title:e.target.value}))} placeholder="Listing Strategy Framework"/></div>
            <div><label>Category</label><input value={course.category} onChange={e=>setCourse(f=>({...f,category:e.target.value}))} placeholder="branding, listings, sales..."/></div>
            <div><label>Total Lessons</label><input type="number" value={course.total_lessons} onChange={e=>setCourse(f=>({...f,total_lessons:parseInt(e.target.value)||0}))} placeholder="10"/></div>
            <div><label>Duration</label><input value={course.duration_label} onChange={e=>setCourse(f=>({...f,duration_label:e.target.value}))} placeholder="2h 30m"/></div>
            <div><label>Emoji Icon</label><input value={course.thumbnail_emoji} onChange={e=>setCourse(f=>({...f,thumbnail_emoji:e.target.value}))} placeholder="📋"/></div>
          </div>
          <div style={{marginBottom:18}}><label>Description</label><textarea value={course.description} onChange={e=>setCourse(f=>({...f,description:e.target.value}))} placeholder="What agents will learn in this course..."/></div>
          <button className="bp" onClick={()=>save(()=>sb.insert("courses",user.token,{...course,is_published:true}),()=>setCourse({title:"",category:"",description:"",duration_label:"",thumbnail_emoji:"📚",total_lessons:0}),"✓ Course published!")} disabled={saving||!course.title}>{saving?<Spin/>:"Publish Course →"}</button>
        </div>
      )}

      {tab==="downloads"&&(
        <div className="card" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:20}}>Publish New Download</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label>Title *</label><input value={dl.title} onChange={e=>setDl(f=>({...f,title:e.target.value}))} placeholder="Open House Checklist"/></div>
            <div><label>Type</label><input value={dl.type} onChange={e=>setDl(f=>({...f,type:e.target.value}))} placeholder="checklist, worksheet, script, SOP..."/></div>
            <div><label>Format</label>
              <select value={dl.format} onChange={e=>setDl(f=>({...f,format:e.target.value}))}>
                <option value="PDF">PDF</option>
                <option value="Google Doc">Google Doc</option>
                <option value="Canva">Canva</option>
                <option value="Excel">Excel</option>
                <option value="Word">Word</option>
              </select>
            </div>
            <div><label>File URL</label><input value={dl.file_url} onChange={e=>setDl(f=>({...f,file_url:e.target.value}))} placeholder="https://drive.google.com/..."/></div>
          </div>
          <button className="bp" onClick={()=>save(()=>sb.insert("resource_downloads",user.token,{...dl,is_published:true}),()=>setDl({title:"",type:"",format:"PDF",file_url:""}),"✓ Download published!")} disabled={saving||!dl.title}>{saving?<Spin/>:"Publish Download →"}</button>
        </div>
      )}

      {tab==="developments"&&(
        <div className="card" style={{padding:28}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:6}}>Add Development Project</h3>
          <p style={{fontSize:13,color:t.textMuted,marginBottom:24}}>Each development gets its own permanent page with all assets. Update anytime.</p>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>Project Details</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div><label>Development Name *</label><input value={dev.name} onChange={e=>setDev(f=>({...f,name:e.target.value}))} placeholder="The Guild"/></div>
            <div><label>Status</label>
              <select value={dev.status} onChange={e=>setDev(f=>({...f,status:e.target.value}))}>
                <option value="coming_soon">Coming Soon</option>
                <option value="active">Active</option>
                <option value="limited">Limited Availability</option>
                <option value="sold_out">Sold Out</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div><label>Tagline</label><input value={dev.tagline} onChange={e=>setDev(f=>({...f,tagline:e.target.value}))} placeholder="Boutique urban living in the heart of the city"/></div>
            <div><label>Location</label><input value={dev.location} onChange={e=>setDev(f=>({...f,location:e.target.value}))} placeholder="Boston, MA"/></div>
            <div><label>Price Range</label><input value={dev.price_range} onChange={e=>setDev(f=>({...f,price_range:e.target.value}))} placeholder="From $650,000"/></div>
            <div><label>Total Units</label><input value={dev.total_units} onChange={e=>setDev(f=>({...f,total_units:e.target.value}))} placeholder="48"/></div>
            <div><label>Units Remaining</label><input value={dev.units_remaining} onChange={e=>setDev(f=>({...f,units_remaining:e.target.value}))} placeholder="12"/></div>
            <div style={{display:"flex",alignItems:"center",gap:10,paddingTop:20}}>
              <input type="checkbox" checked={dev.is_featured} onChange={e=>setDev(f=>({...f,is_featured:e.target.checked}))} style={{width:"auto"}}/>
              <label style={{margin:0}}>Mark as Featured</label>
            </div>
          </div>
          <div style={{marginBottom:20}}><label>Description</label><textarea value={dev.description} onChange={e=>setDev(f=>({...f,description:e.target.value}))} placeholder="Full description of the development for agents to reference..."/></div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>Highlights (bullet points)</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {dev.highlights.map((h,i)=>(
              <input key={i} value={h} onChange={e=>setDev(f=>({...f,highlights:f.highlights.map((x,j)=>j===i?e.target.value:x)}))} placeholder={`Highlight ${i+1} — e.g. Rooftop terrace with city views`}/>
            ))}
            <button className="bg" style={{fontSize:12,width:"fit-content"}} onClick={()=>setDev(f=>({...f,highlights:[...f.highlights,""]}))}>+ Add Highlight</button>
          </div>

          <div style={{fontSize:12,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${t.border}`}}>Marketing Assets</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
            <div><label>Email Template URL</label><input value={dev.email_url} onChange={e=>setDev(f=>({...f,email_url:e.target.value}))} placeholder="https://canva.com/..."/></div>
            <div><label>Brochure URL</label><input value={dev.brochure_url} onChange={e=>setDev(f=>({...f,brochure_url:e.target.value}))} placeholder="https://drive.google.com/..."/></div>
            <div><label>Project Website URL</label><input value={dev.website_url} onChange={e=>setDev(f=>({...f,website_url:e.target.value}))} placeholder="https://theguildboston.com"/></div>
          </div>

          <button className="bp" onClick={()=>save(()=>sb.insert("developments",user.token,{...dev,highlights:dev.highlights.filter(h=>h.trim())}),()=>setDev({name:"",tagline:"",description:"",status:"active",price_range:"",location:"",total_units:"",units_remaining:"",email_url:"",brochure_url:"",website_url:"",highlights:["","",""],is_featured:false}),"✓ Development published!")} disabled={saving||!dev.name}>{saving?<Spin/>:"Publish Development →"}</button>
        </div>
      )}
    </div>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser] = useState(null);
  const [active,setActive] = useState("dashboard");

  if(!user)return <Login onLogin={setUser}/>;

  const render = () => {
    switch(active){
      case "dashboard": return <Dashboard user={user} setActive={setActive}/>;
      case "marketing_weekly": return <WeeklyDrop user={user}/>;
      case "developments": return <DevelopmentsPage user={user}/>;
      case "marketing_email": return <TemplateLib type="email" user={user}/>;
      case "marketing_print": return <TemplateLib type="print" user={user}/>;
      case "marketing_social": return <TemplateLib type="social" user={user}/>;
      case "marketing_ideas": return <ContentIdeas user={user}/>;
      case "listing_services": return <ListingServices user={user}/>;
      case "assets": return <AssetDelivery user={user}/>;
      case "training": case "training_courses": return <Courses user={user}/>;
      case "training_videos": return <Videos user={user}/>;
      case "training_resources": return <Resources user={user}/>;
      case "billing": return <Billing user={user}/>;
      case "admin": return user.role==="admin"?<Admin user={user}/>:<Dashboard user={user} setActive={setActive}/>;
      default: return <Dashboard user={user} setActive={setActive}/>;
    }
  };

  return(
    <div style={{display:"flex",minHeight:"100vh",background:t.bg}}>
      <style>{G}</style>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={async()=>{await sb.signOut(user.token);setUser(null);}}/>
      <main style={{marginLeft:220,flex:1,padding:"36px 40px",overflowY:"auto",maxWidth:"calc(100vw - 220px)"}}>
        {render()}
      </main>
    </div>
  );
}
