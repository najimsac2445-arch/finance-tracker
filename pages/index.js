import { useState, useEffect, useCallback, useMemo } from "react";

const CATEGORIES = ["Food", "Housing", "Transport", "Health", "Entertainment", "Shopping", "Education", "Other"];
const INCOME_CATS = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const COLORS = ["#FF6B9D", "#C084FC", "#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#2DD4BF"];

const CURRENCIES = [
  { code:"USD", symbol:"$",    name:"US Dollar" },
  { code:"EUR", symbol:"€",    name:"Euro" },
  { code:"GBP", symbol:"£",    name:"British Pound" },
  { code:"PKR", symbol:"₨",    name:"Pakistani Rupee" },
  { code:"NGN", symbol:"₦",    name:"Nigerian Naira" },
  { code:"INR", symbol:"₹",    name:"Indian Rupee" },
  { code:"AED", symbol:"د.إ",  name:"UAE Dirham" },
  { code:"SAR", symbol:"﷼",    name:"Saudi Riyal" },
  { code:"KES", symbol:"KSh",  name:"Kenyan Shilling" },
  { code:"GHS", symbol:"₵",    name:"Ghanaian Cedi" },
  { code:"EGP", symbol:"E£",   name:"Egyptian Pound" },
  { code:"ZAR", symbol:"R",    name:"South African Rand" },
  { code:"MAD", symbol:"MAD",  name:"Moroccan Dirham" },
  { code:"ETB", symbol:"Br",   name:"Ethiopian Birr" },
  { code:"TZS", symbol:"TSh",  name:"Tanzanian Shilling" },
  { code:"UGX", symbol:"USh",  name:"Ugandan Shilling" },
  { code:"XOF", symbol:"CFA",  name:"West African CFA" },
  { code:"JPY", symbol:"¥",    name:"Japanese Yen" },
  { code:"CNY", symbol:"¥",    name:"Chinese Yuan" },
  { code:"KRW", symbol:"₩",    name:"South Korean Won" },
  { code:"IDR", symbol:"Rp",   name:"Indonesian Rupiah" },
  { code:"MYR", symbol:"RM",   name:"Malaysian Ringgit" },
  { code:"THB", symbol:"฿",    name:"Thai Baht" },
  { code:"BDT", symbol:"৳",    name:"Bangladeshi Taka" },
  { code:"LKR", symbol:"Rs",   name:"Sri Lankan Rupee" },
  { code:"NPR", symbol:"रू",   name:"Nepalese Rupee" },
  { code:"PHP", symbol:"₱",    name:"Philippine Peso" },
  { code:"VND", symbol:"₫",    name:"Vietnamese Dong" },
  { code:"SGD", symbol:"S$",   name:"Singapore Dollar" },
  { code:"HKD", symbol:"HK$",  name:"Hong Kong Dollar" },
  { code:"TWD", symbol:"NT$",  name:"Taiwan Dollar" },
  { code:"CAD", symbol:"CA$",  name:"Canadian Dollar" },
  { code:"AUD", symbol:"A$",   name:"Australian Dollar" },
  { code:"NZD", symbol:"NZ$",  name:"New Zealand Dollar" },
  { code:"MXN", symbol:"MX$",  name:"Mexican Peso" },
  { code:"BRL", symbol:"R$",   name:"Brazilian Real" },
  { code:"ARS", symbol:"$",    name:"Argentine Peso" },
  { code:"CLP", symbol:"$",    name:"Chilean Peso" },
  { code:"COP", symbol:"$",    name:"Colombian Peso" },
  { code:"PEN", symbol:"S/",   name:"Peruvian Sol" },
  { code:"CHF", symbol:"Fr",   name:"Swiss Franc" },
  { code:"SEK", symbol:"kr",   name:"Swedish Krona" },
  { code:"NOK", symbol:"kr",   name:"Norwegian Krone" },
  { code:"DKK", symbol:"kr",   name:"Danish Krone" },
  { code:"PLN", symbol:"zł",   name:"Polish Zloty" },
  { code:"CZK", symbol:"Kč",   name:"Czech Koruna" },
  { code:"HUF", symbol:"Ft",   name:"Hungarian Forint" },
  { code:"RON", symbol:"lei",  name:"Romanian Leu" },
  { code:"TRY", symbol:"₺",    name:"Turkish Lira" },
  { code:"RUB", symbol:"₽",    name:"Russian Ruble" },
  { code:"UAH", symbol:"₴",    name:"Ukrainian Hryvnia" },
  { code:"ILS", symbol:"₪",    name:"Israeli Shekel" },
  { code:"QAR", symbol:"QR",   name:"Qatari Riyal" },
  { code:"KWD", symbol:"KD",   name:"Kuwaiti Dinar" },
  { code:"BHD", symbol:"BD",   name:"Bahraini Dinar" },
  { code:"OMR", symbol:"OMR",  name:"Omani Rial" },
  { code:"JOD", symbol:"JD",   name:"Jordanian Dinar" },
  { code:"IQD", symbol:"IQD",  name:"Iraqi Dinar" },
  { code:"AFN", symbol:"؋",    name:"Afghan Afghani" },
  { code:"MMK", symbol:"K",    name:"Myanmar Kyat" },
  { code:"KHR", symbol:"៛",    name:"Cambodian Riel" },
];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada",
  "Chile","China","Colombia","Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece",
  "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya","Malaysia",
  "Mexico","Morocco","Netherlands","New Zealand","Nigeria","Norway","Pakistan","Peru","Philippines",
  "Poland","Portugal","Romania","Russia","Saudi Arabia","Singapore","South Africa","South Korea",
  "Spain","Sweden","Switzerland","Thailand","Turkey","UAE","Ukraine","United Kingdom","United States","Vietnam","Other"
];

const DEFAULT_PROFILE = { name:"", username:"", country:"", gender:"", bio:"", currencyCode:"USD" };

const G = {
  card: { background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:22 },
  heroCard: { background:"linear-gradient(135deg,rgba(255,107,157,0.18),rgba(192,132,252,0.15),rgba(96,165,250,0.12))", backdropFilter:"blur(30px)", WebkitBackdropFilter:"blur(30px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:28 },
  input: { width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"13px 16px", color:"#E8EAF0", fontSize:14, fontFamily:"inherit" },
  btn: { background:"linear-gradient(135deg,#FF6B9D,#C084FC)", border:"none", borderRadius:16, color:"#fff", fontWeight:700, cursor:"pointer", boxShadow:"0 6px 20px rgba(255,107,157,0.3)" },
  btnGhost: { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, color:"rgba(255,255,255,0.5)", fontWeight:600, cursor:"pointer" },
  label: { display:"block", color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:600, letterSpacing:1.2, textTransform:"uppercase", marginBottom:8 },
  heading: { fontSize:22, fontWeight:800, background:"linear-gradient(90deg,#fff,rgba(255,255,255,0.7))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
};

// ── SCREEN IDs ─────────────────────────────────────────────────────────────────
// Each unique screen state is a string: "dashboard" | "transactions" | "history" | "profile" | "budget" | "savings" | "investments" | "guide"
// Navigation is a stack: push to go forward, pop to go back

function getTitle(screen, profile) {
  switch(screen) {
    case "dashboard":    return profile.name ? `Hi, ${profile.name.split(" ")[0]} 👋` : "My Finances ✨";
    case "transactions": return "Transactions";
    case "history":      return "History";
    case "profile":      return "Profile";
    case "budget":       return "🎯 Budgets";
    case "savings":      return "💰 Savings";
    case "investments":  return "📈 Portfolio";
    case "guide":        return "📖 Guide";
    default:             return "My Finances";
  }
}

// ── Charts ────────────────────────────────────────────────────────────────────
function BarChart({ data, color="#FF6B9D", height=80 }) {
  const max=Math.max(...data.map(d=>d.value),1);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height,paddingTop:8}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:"100%",background:"rgba(255,255,255,0.06)",borderRadius:6,height:height-20,display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
            <div style={{width:"100%",height:`${(d.value/max)*100}%`,background:typeof color==="string"?color:`linear-gradient(180deg,${color[0]},${color[1]})`,borderRadius:6,transition:"height 0.8s cubic-bezier(0.16,1,0.3,1)",minHeight:d.value>0?4:0}}/>
          </div>
          <span style={{fontSize:9,color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap",overflow:"hidden",maxWidth:"100%",textAlign:"center"}}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size=110 }) {
  const total=segments.reduce((a,b)=>a+b.value,0)||1;
  const radius=45,cx=60,cy=60,sw=14,circ=2*Math.PI*radius;
  let offset=0;
  const slices=segments.map(s=>{ const pct=s.value/total,dash=pct*circ,slice={...s,dashArray:`${dash} ${circ-dash}`,dashOffset:-offset*circ}; offset+=pct; return slice; });
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/>
      {slices.map((s,i)=>(
        <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={s.color} strokeWidth={sw}
          strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} style={{transition:"all 0.8s ease"}}/>
      ))}
      <text x={cx} y={cy-5} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{segments.length}</text>
      <text x={cx} y={cy+8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">cats</text>
    </svg>
  );
}

function LineChart({ series, height=90 }) {
  const allValues=series.flatMap(s=>s.data.map(d=>d.value));
  const max=Math.max(...allValues,1);
  const w=300,h=height,pad=8;
  const toX=(i,len)=>pad+(i/(len-1||1))*(w-pad*2);
  const toY=(v)=>h-pad-((v)/(max||1))*(h-pad*2);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{overflow:"visible"}}>
      {[0,0.5,1].map((p,i)=><line key={i} x1={pad} x2={w-pad} y1={toY(max*p)} y2={toY(max*p)} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
      {series.map((s,si)=>{
        if(s.data.length<2) return null;
        const pts=s.data.map((d,i)=>`${toX(i,s.data.length)},${toY(d.value)}`).join(" ");
        const area=`${toX(0,s.data.length)},${h} ${pts} ${toX(s.data.length-1,s.data.length)},${h}`;
        return (
          <g key={si}>
            <polygon points={area} fill={s.color} opacity="0.08"/>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {s.data.map((d,i)=><circle key={i} cx={toX(i,s.data.length)} cy={toY(d.value)} r="3" fill={s.color} stroke="rgba(5,11,46,0.8)" strokeWidth="1.5"/>)}
          </g>
        );
      })}
      {series[0]?.data.map((d,i)=>(
        <text key={i} x={toX(i,series[0].data.length)} y={h+2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7">{d.label}</text>
      ))}
    </svg>
  );
}

function getMonthKey(date){ return date.toISOString().slice(0,7); }
function getMonthLabel(key){ const [y,m]=key.split("-"); return new Date(+y,+m-1).toLocaleDateString("en-US",{month:"short",year:"2-digit"}); }
function getLast6Months(){ const months=[]; for(let i=5;i>=0;i--){ const d=new Date(); d.setDate(1); d.setMonth(d.getMonth()-i); months.push(getMonthKey(d)); } return months; }

// ── App ───────────────────────────────────────────────────────────────────────
export default function FinanceTracker() {
  // ── Navigation Stack ──────────────────────────────────────────────────────
  // Stack stores the full history. Current screen = stack[stack.length - 1]
  const [navStack, setNavStack] = useState(["dashboard"]);
  const currentScreen = navStack[navStack.length - 1];
  const canGoBack = navStack.length > 1;

  // Push a new screen onto the stack
  const navigate = (screen) => {
    setNavStack(prev => {
      // If tapping a bottom nav tab, reset stack to just that screen
      const bottomNavScreens = ["dashboard", "transactions", "history", "profile"];
      if (bottomNavScreens.includes(screen)) {
        return [screen];
      }
      // Otherwise push on top (going into a section)
      return [...prev, screen];
    });
  };

  // Pop back one step
  const goBack = () => {
    setNavStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };

  // ── Data & State ──────────────────────────────────────────────────────────
  const [data, setData] = useState({ transactions:[], budgets:[], savings:[], investments:[] });
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  // Derive currency reactively from profile — recalculates on every profile change
  const currencyCode = profile.currencyCode || "USD";
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const fmt = useCallback((n) =>
    `${currency.symbol}${Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`,
  [currency.symbol]);

  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get("financeData"); if(r?.value) setData(JSON.parse(r.value));
        const p=await window.storage.get("financeProfile"); if(p?.value) setProfile(JSON.parse(p.value));
      }catch{}
      setLoaded(true);
    })();
  },[]);

  const save=useCallback(async(nd)=>{ setData(nd); try{await window.storage.set("financeData",JSON.stringify(nd));}catch{} },[]);
  // saveProfile updates state immediately so fmt re-derives from new currencyCode right away
  const saveProfile=useCallback(async(np)=>{ setProfile({...np}); try{await window.storage.set("financeProfile",JSON.stringify(np));}catch{} },[]);
  const showToast=(msg,color="#FF6B9D")=>{ setToast({msg,color}); setTimeout(()=>setToast(null),2500); };

  const now=new Date();
  const thisMonth=getMonthKey(now);
  const monthTxns=data.transactions.filter(t=>t.date?.startsWith(thisMonth));
  const totalIncome=monthTxns.filter(t=>t.type==="income").reduce((a,b)=>a+Number(b.amount),0);
  const totalExpense=monthTxns.filter(t=>t.type==="expense").reduce((a,b)=>a+Number(b.amount),0);
  const netBalance=totalIncome-totalExpense;
  const totalSaved=data.savings.reduce((a,b)=>a+Number(b.current||0),0);
  const totalInvested=data.investments.reduce((a,b)=>a+Number(b.value||0),0);
  const expByCat={};
  monthTxns.filter(t=>t.type==="expense").forEach(t=>{ expByCat[t.category]=(expByCat[t.category]||0)+Number(t.amount); });

  const openModal=(type,item={})=>{ setModal(type); setForm(item.id?{...item}:{date:now.toISOString().slice(0,10)}); };
  const closeModal=()=>{ setModal(null); setForm({}); };

  const handleSave=()=>{
    if(modal==="transaction"&&(!form.amount||!form.description)) return showToast("Fill required fields");
    const nd={...data};
    if(modal==="transaction"){ const t={...form,id:form.id||Date.now(),amount:Number(form.amount)}; nd.transactions=form.id?nd.transactions.map(x=>x.id===form.id?t:x):[t,...nd.transactions]; }
    else if(modal==="budget"){ const b={...form,id:form.id||Date.now(),amount:Number(form.amount)}; nd.budgets=form.id?nd.budgets.map(x=>x.id===form.id?b:x):[...nd.budgets,b]; }
    else if(modal==="saving"){ const s={...form,id:form.id||Date.now(),target:Number(form.target||0),current:Number(form.current||0)}; nd.savings=form.id?nd.savings.map(x=>x.id===form.id?s:x):[...nd.savings,s]; }
    else if(modal==="investment"){ const inv={...form,id:form.id||Date.now(),value:Number(form.value||0),cost:Number(form.cost||0)}; nd.investments=form.id?nd.investments.map(x=>x.id===form.id?inv:x):[...nd.investments,inv]; }
    save(nd); closeModal(); showToast("Saved! ✨");
  };

  const handleDelete=(type,id)=>{
    const nd={...data};
    nd[type==="transaction"?"transactions":type==="budget"?"budgets":type==="saving"?"savings":"investments"]=
      data[type==="transaction"?"transactions":type==="budget"?"budgets":type==="saving"?"savings":"investments"].filter(x=>x.id!==id);
    save(nd); showToast("Deleted","#F87171");
  };

  const initials=profile.name?profile.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase():"?";

  const navTabs=[
    {id:"dashboard",icon:"🏠",label:"Home"},
    {id:"transactions",icon:"💸",label:"Txns"},
    {id:"history",icon:"🕒",label:"History"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];

  // Which bottom tab is active (always the root of the current stack)
  const activeTab = navStack[0];

  if(!loaded) return(
    <div style={{background:"linear-gradient(135deg,#050B2E,#0D1B4B,#1A0A3E)",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#FF6B9D",fontSize:18,textAlign:"center"}}><div style={{fontSize:40,marginBottom:12}}>✨</div>Loading...</div>
    </div>
  );

  return(
    <div key={currencyCode} style={{background:"linear-gradient(160deg,#050B2E 0%,#0D1B4B 40%,#1A0A3E 70%,#050B2E 100%)",minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'DM Sans',system-ui,sans-serif",color:"#E8EAF0",position:"relative",paddingBottom:96}}>
      <div style={{position:"fixed",top:-80,left:-80,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,157,0.18) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:200,right:-100,width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,0.15) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:100,left:-60,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        input,select,textarea{outline:none;font-family:inherit;}
        select option{background:#0D1B4B;color:#E8EAF0;}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(12px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
        .card{animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards;}
        .nav-btn,.action-btn{transition:all 0.2s ease;}
        .nav-btn:active,.action-btn:active{transform:scale(0.93);}
        .tappable{transition:all 0.15s ease;cursor:pointer;}
        .tappable:active{transform:scale(0.97);opacity:0.85;}
      `}</style>

      {/* ── Header ── */}
      {currentScreen !== "profile" && (
        <div style={{padding:"52px 20px 12px",position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{flex:1}}>
              {/* Back button — shows when stack has more than 1 item */}
              {canGoBack && (
                <button onClick={goBack}
                  style={{background:"rgba(255,107,157,0.12)",border:"1px solid rgba(255,107,157,0.25)",color:"#FF6B9D",fontSize:12,fontWeight:700,cursor:"pointer",padding:"5px 14px",borderRadius:100,marginBottom:8,display:"inline-flex",alignItems:"center",gap:5}}>
                  ‹ Back to {getTitle(navStack[navStack.length-2], profile)}
                </button>
              )}
              {!canGoBack && (
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:12,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Space Grotesk'"}}>
                  {now.toLocaleDateString("en-US",{month:"long",year:"numeric"})}
                </div>
              )}
              <div style={{fontSize:22,fontWeight:800,marginTop:canGoBack?0:2,background:"linear-gradient(90deg,#fff,rgba(255,255,255,0.75))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {getTitle(currentScreen, profile)}
              </div>
            </div>
            <button onClick={()=>navigate("profile")} style={{background:"none",border:"none",padding:0,cursor:"pointer",marginLeft:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",padding:2,background:"linear-gradient(135deg,#FF6B9D,#C084FC,#60A5FA)"}}>
                <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"rgba(5,11,46,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"#fff"}}>{initials}</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{padding:"0 16px",position:"relative",zIndex:1}}>
        {currentScreen==="dashboard"    && <Dashboard {...{totalIncome,totalExpense,netBalance,totalSaved,totalInvested,expByCat,data,openModal,fmt,COLORS,now,navigate}}/>}
        {currentScreen==="transactions" && <Transactions {...{data,openModal,handleDelete,fmt}}/>}
        {currentScreen==="history"      && <History {...{data,fmt,COLORS}}/>}
        {currentScreen==="profile"      && <Profile {...{profile,saveProfile,showToast,initials,canGoBack,goBack}}/>}
        {currentScreen==="budget"       && <Budget {...{data,expByCat,openModal,handleDelete,fmt}}/>}
        {currentScreen==="savings"      && <Savings {...{data,openModal,handleDelete,fmt}}/>}
        {currentScreen==="investments"  && <Investments {...{data,openModal,handleDelete,fmt}}/>}
        {currentScreen==="guide"        && <Guide/>}
      </div>

      {/* ── Bottom Nav ── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:100,padding:"0 12px 8px"}}>
        <div style={{borderRadius:28,padding:"10px 4px 14px",display:"flex",background:"rgba(5,11,46,0.88)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",border:"1px solid rgba(255,255,255,0.1)"}}>
          {navTabs.map(t=>{
            const active=activeTab===t.id && (t.id!=="dashboard" || currentScreen==="dashboard");
            return(
              <button key={t.id} className="nav-btn" onClick={()=>navigate(t.id)}
                style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0"}}>
                <div style={{width:42,height:30,borderRadius:12,background:active?"linear-gradient(135deg,rgba(255,107,157,0.3),rgba(192,132,252,0.3))":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,transition:"all 0.25s ease"}}>
                  {t.icon}
                </div>
                <span style={{fontSize:9,fontWeight:600,color:active?"#FF6B9D":"rgba(255,255,255,0.35)"}}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Modal ── */}
      {modal&&(
        <div onClick={closeModal} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.25s ease"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(160deg,rgba(13,27,75,0.98),rgba(26,10,62,0.98))",borderRadius:"28px 28px 0 0",width:"100%",maxWidth:430,padding:"20px 24px 36px",maxHeight:"88vh",overflowY:"auto",border:"1px solid rgba(255,255,255,0.1)",borderBottom:"none",animation:"slideUp 0.35s ease"}}>
            <div style={{width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"0 auto 24px"}}/>
            <div style={{fontSize:20,fontWeight:700,marginBottom:22,background:"linear-gradient(90deg,#FF6B9D,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {form.id?"Edit":"Add"} {modal==="transaction"?"Transaction":modal==="budget"?"Budget":modal==="saving"?"Savings Goal":"Investment"}
            </div>
            <ModalForm modal={modal} form={form} setForm={setForm}/>
            <div style={{display:"flex",gap:12,marginTop:24}}>
              <button onClick={closeModal} className="action-btn" style={{...G.btnGhost,flex:1,padding:15,fontSize:15}}>Cancel</button>
              <button onClick={handleSave} className="action-btn" style={{...G.btn,flex:2,padding:15,fontSize:15}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toast&&(
        <div style={{position:"fixed",bottom:108,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,${toast.color},#C084FC)`,color:"#fff",padding:"11px 24px",borderRadius:100,fontSize:13,fontWeight:700,zIndex:300,whiteSpace:"nowrap",animation:"toastIn 0.3s ease",boxShadow:"0 8px 24px rgba(255,107,157,0.4)"}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── CALCULATOR ───────────────────────────────────────────────────────────────
function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);
  const [collapsed, setCollapsed] = useState(true);

  const press = (val) => {
    if (val === "C") {
      setDisplay("0"); setPrev(null); setOp(null); setFresh(true); return;
    }
    if (val === "⌫") {
      setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0"); return;
    }
    if (["+", "−", "×", "÷"].includes(val)) {
      setPrev(parseFloat(display));
      setOp(val);
      setFresh(true);
      return;
    }
    if (val === "=") {
      if (op === null || prev === null) return;
      const cur = parseFloat(display);
      let result;
      if (op === "+") result = prev + cur;
      else if (op === "−") result = prev - cur;
      else if (op === "×") result = prev * cur;
      else if (op === "÷") result = cur !== 0 ? prev / cur : "Err";
      const str = typeof result === "number"
        ? parseFloat(result.toFixed(10)).toString()
        : result;
      setDisplay(str);
      setPrev(null); setOp(null); setFresh(true);
      return;
    }
    if (val === "." && display.includes(".") && !fresh) return;
    setDisplay(d => {
      if (fresh) { setFresh(false); return val === "." ? "0." : val; }
      if (d === "0" && val !== ".") return val;
      return d + val;
    });
  };

  const rows = [
    ["C", "⌫", "÷", "×"],
    ["7", "8", "9", "−"],
    ["4", "5", "6", "+"],
    ["1", "2", "3", "="],
    ["0", "0", ".", "="],
  ];

  // Simplified rows for cleaner layout
  const btns = [
    [{l:"C",type:"fn"},{l:"⌫",type:"fn"},{l:"÷",type:"op"},{l:"×",type:"op"}],
    [{l:"7",type:"num"},{l:"8",type:"num"},{l:"9",type:"num"},{l:"−",type:"op"}],
    [{l:"4",type:"num"},{l:"5",type:"num"},{l:"6",type:"num"},{l:"+",type:"op"}],
    [{l:"1",type:"num"},{l:"2",type:"num"},{l:"3",type:"num"},{l:"=",type:"eq",rowSpan:2}],
    [{l:"0",type:"num",wide:true},{l:".",type:"num"}],
  ];

  const btnColor = (type) => {
    if (type === "op") return { background:"rgba(255,107,157,0.2)", color:"#FF6B9D", border:"1px solid rgba(255,107,157,0.3)" };
    if (type === "fn") return { background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.08)" };
    if (type === "eq") return { background:"linear-gradient(135deg,#FF6B9D,#C084FC)", color:"#fff", border:"none", boxShadow:"0 4px 16px rgba(255,107,157,0.35)" };
    return { background:"rgba(255,255,255,0.06)", color:"#E8EAF0", border:"1px solid rgba(255,255,255,0.08)" };
  };

  return (
    <div className="card" style={{...G.card, padding:18}}>
      {/* Header — tap to collapse/expand */}
      <div className="tappable" onClick={()=>setCollapsed(c=>!c)}
        style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:collapsed?0:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:20}}>🧮</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>Calculator</div>
        </div>
        <div style={{color:"#FF6B9D",fontSize:20,transform:collapsed?"rotate(0deg)":"rotate(90deg)",transition:"transform 0.25s"}}>›</div>
      </div>

      {!collapsed && (
        <div>
          {/* Display */}
          <div style={{background:"rgba(0,0,0,0.25)",borderRadius:16,padding:"16px 18px",marginBottom:14,textAlign:"right",minHeight:72,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
            {op && <div style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginBottom:2}}>{prev} {op}</div>}
            <div style={{fontSize:36,fontWeight:700,color:"#fff",letterSpacing:-1,wordBreak:"break-all",lineHeight:1.1}}>
              {display.length > 12 ? parseFloat(parseFloat(display).toFixed(6)).toString() : display}
            </div>
          </div>

          {/* Buttons — 4 column grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[
              {l:"C",t:"fn"},{l:"⌫",t:"fn"},{l:"÷",t:"op"},{l:"×",t:"op"},
              {l:"7",t:"num"},{l:"8",t:"num"},{l:"9",t:"num"},{l:"−",t:"op"},
              {l:"4",t:"num"},{l:"5",t:"num"},{l:"6",t:"num"},{l:"+",t:"op"},
              {l:"1",t:"num"},{l:"2",t:"num"},{l:"3",t:"num"},{l:"=",t:"eq"},
              {l:"0",t:"num",wide:true},{l:".",t:"num"},{l:"=",t:"eq"},
            ].map((b,i)=>{
              const styles=btnColor(b.t);
              return(
                <button key={i} onClick={()=>press(b.l)} className="action-btn"
                  style={{...styles,gridColumn:b.wide?"span 2":"span 1",padding:"17px 8px",borderRadius:14,fontSize:b.t==="eq"?22:18,fontWeight:700,cursor:"pointer",lineHeight:1,WebkitTapHighlightColor:"transparent"}}>
                  {b.l}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ totalIncome, totalExpense, netBalance, totalSaved, totalInvested, expByCat, data, openModal, fmt, COLORS, now, navigate }) {
  const cats=Object.entries(expByCat).sort((a,b)=>b[1]-a[1]);
  const months=getLast6Months();
  const incomeByMonth=months.map(m=>({label:getMonthLabel(m),value:data.transactions.filter(t=>t.type==="income"&&t.date?.startsWith(m)).reduce((a,b)=>a+Number(b.amount),0)}));
  const expByMonth=months.map(m=>({label:getMonthLabel(m),value:data.transactions.filter(t=>t.type==="expense"&&t.date?.startsWith(m)).reduce((a,b)=>a+Number(b.amount),0)}));

  const tiles=[
    {id:"budget",     icon:"🎯", label:"Budgets",  sub:"Monthly limits",    color:"#FF6B9D", grad:"linear-gradient(135deg,rgba(255,107,157,0.2),rgba(192,132,252,0.1))", border:"rgba(255,107,157,0.25)"},
    {id:"savings",    icon:"💰", label:"Savings",   sub:fmt(totalSaved)+" saved",  color:"#C084FC", grad:"linear-gradient(135deg,rgba(192,132,252,0.2),rgba(96,165,250,0.1))", border:"rgba(192,132,252,0.25)"},
    {id:"investments",icon:"📈", label:"Invest",    sub:fmt(totalInvested),  color:"#60A5FA", grad:"linear-gradient(135deg,rgba(96,165,250,0.2),rgba(52,211,153,0.1))", border:"rgba(96,165,250,0.25)"},
    {id:"guide",      icon:"📖", label:"Guide",     sub:"How to use",        color:"#34D399", grad:"linear-gradient(135deg,rgba(52,211,153,0.2),rgba(45,212,191,0.1))", border:"rgba(52,211,153,0.25)"},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Hero — tappable → goes to Transactions */}
      <div className="card tappable" onClick={()=>navigate("transactions")} style={{...G.heroCard,padding:"26px 22px",marginTop:4,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,157,0.2) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:16,right:18,background:"rgba(255,107,157,0.18)",border:"1px solid rgba(255,107,157,0.35)",borderRadius:100,padding:"4px 12px",display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:11,fontWeight:700,color:"#FF6B9D"}}>View Txns →</span>
        </div>
        <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Net This Month</div>
        <div style={{fontSize:40,fontWeight:800,color:netBalance>=0?"#FF6B9D":"#F87171",marginTop:5}}>{netBalance>=0?"+":""}{fmt(netBalance)}</div>
        <div style={{display:"flex",gap:24,marginTop:14}}>
          <div><div style={{color:"rgba(255,255,255,0.35)",fontSize:11}}>Income</div><div style={{color:"#34D399",fontWeight:700,fontSize:14,marginTop:2}}>{fmt(totalIncome)}</div></div>
          <div><div style={{color:"rgba(255,255,255,0.35)",fontSize:11}}>Expenses</div><div style={{color:"#F87171",fontWeight:700,fontSize:14,marginTop:2}}>{fmt(totalExpense)}</div></div>
        </div>
        <div style={{marginTop:14,color:"rgba(255,255,255,0.25)",fontSize:11}}>Tap to view all transactions</div>
      </div>

      {/* Section tiles — each navigates to its screen, pushing onto stack */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {tiles.map(tile=>(
          <div key={tile.id} className="tappable" onClick={()=>navigate(tile.id)}
            style={{background:tile.grad,border:`1px solid ${tile.border}`,borderRadius:20,padding:"16px 14px",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
            <div style={{fontSize:26,marginBottom:8}}>{tile.icon}</div>
            <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>{tile.label}</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginTop:3}}>{tile.sub}</div>
            <div style={{color:tile.color,fontSize:10,fontWeight:600,marginTop:8}}>Open →</div>
          </div>
        ))}
      </div>

      {/* Calculator */}
      <Calculator/>

      {/* 6-month trend */}
      <div className="card" style={{...G.card,padding:18}}>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>6-Month Trend</div>
        <div style={{display:"flex",gap:14,marginBottom:8}}>
          {[{c:"#34D399",l:"Income"},{c:"#F87171",l:"Expenses"}].map(s=>(
            <div key={s.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:"50%",background:s.c}}/><span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{s.l}</span></div>
          ))}
        </div>
        <LineChart series={[{data:incomeByMonth,color:"#34D399"},{data:expByMonth,color:"#F87171"}]} height={90}/>
      </div>

      {/* Spending → navigates to budget */}
      {cats.length>0&&(
        <div className="card tappable" style={{...G.card,padding:18}} onClick={()=>navigate("budget")}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>Spending</div>
            <div style={{color:"rgba(255,107,157,0.6)",fontSize:10,fontWeight:600}}>Manage →</div>
          </div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <DonutChart segments={cats.map(([cat,amt],i)=>({value:amt,color:COLORS[i%COLORS.length],label:cat}))}/>
            <div style={{flex:1}}>
              {cats.slice(0,5).map(([cat,amt],i)=>(
                <div key={cat} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>{cat}</span>
                    <span style={{fontSize:11,fontWeight:700,color:COLORS[i%COLORS.length]}}>{fmt(amt)}</span>
                  </div>
                  <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}>
                    <div style={{height:"100%",width:`${(amt/(cats[0][1]||1))*100}%`,background:COLORS[i%COLORS.length],borderRadius:2}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent transactions */}
      <div className="card" style={{...G.card,padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>Recent</div>
          <button onClick={()=>openModal("transaction")} className="action-btn" style={{background:"linear-gradient(135deg,rgba(255,107,157,0.2),rgba(192,132,252,0.2))",border:"1px solid rgba(255,107,157,0.3)",color:"#FF6B9D",borderRadius:10,padding:"5px 14px",fontSize:12,fontWeight:600}}>+ Add</button>
        </div>
        {data.transactions.slice(0,5).map(t=>(
          <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:10,background:t.type==="income"?"rgba(52,211,153,0.15)":"rgba(248,113,113,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{t.type==="income"?"↑":"↓"}</div>
              <div><div style={{fontSize:13,fontWeight:500}}>{t.description}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:1}}>{t.category} · {t.date}</div></div>
            </div>
            <div style={{fontWeight:700,color:t.type==="income"?"#34D399":"#F87171",fontSize:13}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</div>
          </div>
        ))}
        {data.transactions.length===0&&<div style={{color:"rgba(255,255,255,0.2)",textAlign:"center",padding:"18px 0",fontSize:13}}>No transactions yet ✨</div>}
      </div>
    </div>
  );
}

// ─── GUIDE ────────────────────────────────────────────────────────────────────
function Guide() {
  const [open,setOpen]=useState(null);
  const sections=[
    {icon:"🏠",title:"Home Screen",content:["The Home screen shows your Net Balance — income minus expenses for the current month.","The 4 tiles (Budgets, Savings, Invest, Guide) are quick shortcuts. Tap any to open it — you can always press back to return.","The 6-Month Trend chart shows income and expenses over the past 6 months.","The Spending Breakdown shows a donut chart of expenses by category. Tap it to manage budgets.","Recent Transactions shows your last 5 entries. Tap '+ Add' to log a new one."]},
    {icon:"💸",title:"Transactions",content:["Tap 'Txns' in the bottom nav to see your full transaction list.","Tap '+ Add': fill in Description, Amount, Type (income or expense), Category, and Date.","Income categories: Salary, Freelance, Investment, Gift. Expense: Food, Housing, Transport, Health, Entertainment, Shopping, Education, Other.","Use All / Income / Expense filters to find entries quickly.","Tap Edit to update or Del to remove. Everything saves automatically."]},
    {icon:"🎯",title:"Budgets",content:["Set a monthly spending limit per category so you never overspend.","Tap '+ Add Budget', choose a category, enter the monthly limit.","Progress bar: green (on track), yellow (over 75%), red (over budget).","Spending is pulled automatically from your transactions.","Tap back at any time to return to where you came from."]},
    {icon:"💰",title:"Savings Goals",content:["Tap '+ Add Goal': name, target amount, amount already saved, optional deadline.","Progress bar fills to 100% then shows 🎉","Tap Edit to update your saved amount as you progress.","The bar chart compares saved amounts across all goals."]},
    {icon:"📈",title:"Investments",content:["Track stocks, crypto, ETFs, real estate, bonds, or any asset.","Tap '+ Add Asset': Asset Name, Type, Cost Basis, Current Value.","Gain/loss calculated automatically in amount and percentage.","Update Current Value regularly to keep returns accurate."]},
    {icon:"🕒",title:"History",content:["Shows your finances over the last 6 months — updates automatically every month.","Bar chart shows monthly expenses.","Pick a past month to compare against the current one.","Comparison panel shows income, expenses, and net side by side.","Change section shows % differences — green = improvement, red = worse."]},
    {icon:"👤",title:"Profile",content:["Tap your initials (top right) or Profile in the nav.","Set name, username, gender, country, and bio.","Select your Currency — updates symbols across the whole app.","60+ currencies supported. Search by code, name or symbol.","Profile saves automatically."]},
    {icon:"🔙",title:"Navigation",content:["Every screen has a Back button at the top that takes you exactly one step back.","Example: Home → Budget → back takes you to Home. Not anywhere else.","Tapping a bottom nav tab (Home, Txns, History, Profile) always resets the stack to that tab.","You can navigate deep and always trace your way back step by step."]},
    {icon:"💡",title:"Tips",content:["Set your Profile and currency before adding any data.","Log transactions regularly for accurate charts.","Create a budget for every spending category you use.","Review History at month-end to compare performance.","Update investment values monthly.","All data saves automatically — nothing is lost."]},
  ];
  return(
    <div style={{paddingBottom:16}}>
      <div style={{...G.card,padding:"16px 18px",marginBottom:14}}>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",lineHeight:1.75}}>Welcome! Tap any section below to expand it.</div>
      </div>
      {sections.map((s,i)=>(
        <div key={i} style={{...G.card,marginBottom:10,overflow:"hidden"}}>
          <div className="tappable" onClick={()=>setOpen(open===i?null:i)} style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:22}}>{s.icon}</div>
              <div style={{fontWeight:600,fontSize:15,color:"#E8EAF0"}}>{s.title}</div>
            </div>
            <div style={{color:"#FF6B9D",fontSize:20,transform:open===i?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}>›</div>
          </div>
          {open===i&&(
            <div style={{padding:"0 18px 18px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
              {s.content.map((line,j)=>(
                <div key={j} style={{display:"flex",gap:10,marginTop:12,alignItems:"flex-start"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B9D,#C084FC)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"white",flexShrink:0,marginTop:1}}>{j+1}</div>
                  <div style={{color:"rgba(255,255,255,0.6)",fontSize:13,lineHeight:1.75}}>{line}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── BUDGET ───────────────────────────────────────────────────────────────────
function Budget({ data, expByCat, openModal, handleDelete, fmt }) {
  const catData=CATEGORIES.map(c=>({label:c.slice(0,3),value:expByCat[c]||0}));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 0 14px"}}>
        <button onClick={()=>openModal("budget")} className="action-btn" style={{...G.btn,padding:"9px 18px",fontSize:13,borderRadius:14}}>+ Add Budget</button>
      </div>
      {Object.keys(expByCat).length>0&&(
        <div style={{...G.card,padding:16,marginBottom:14}}>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Spending This Month</div>
          <BarChart data={catData} color={["#FF6B9D","#C084FC"]} height={90}/>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {data.budgets.map((b,idx)=>{
          const spent=expByCat[b.category]||0,pct=Math.min((spent/b.amount)*100,100),over=spent>b.amount;
          const barColor=over?"linear-gradient(90deg,#F87171,#FF6B6B)":pct>75?"linear-gradient(90deg,#FBBF24,#FCD34D)":"linear-gradient(90deg,#FF6B9D,#C084FC)";
          const accentColor=over?"#F87171":pct>75?"#FBBF24":"#FF6B9D";
          return(
            <div key={b.id} className="card" style={{...G.card,padding:18,animationDelay:`${idx*0.05}s`,border:over?"1px solid rgba(248,113,113,0.2)":"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div><div style={{fontWeight:600,fontSize:15}}>{b.category}</div><div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginTop:2}}>{b.description||"Monthly budget"}</div></div>
                <div style={{textAlign:"right"}}><div style={{color:accentColor,fontWeight:700,fontSize:14}}>{fmt(spent)}</div><div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>of {fmt(b.amount)}</div></div>
              </div>
              <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",width:`${pct}%`,background:barColor,borderRadius:3,transition:"width 0.7s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:over?"#F87171":"rgba(255,255,255,0.3)"}}>{over?`Over by ${fmt(spent-b.amount)}`:`${fmt(b.amount-spent)} remaining`}</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>openModal("budget",b)} className="action-btn" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Edit</button>
                  <button onClick={()=>handleDelete("budget",b.id)} className="action-btn" style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",color:"#F87171",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Del</button>
                </div>
              </div>
            </div>
          );
        })}
        {data.budgets.length===0&&<div style={{color:"rgba(255,255,255,0.2)",textAlign:"center",padding:40,fontSize:13}}>No budgets yet<br/><span style={{fontSize:11,opacity:0.6}}>Tap + Add Budget to get started</span></div>}
      </div>
    </div>
  );
}

// ─── SAVINGS ──────────────────────────────────────────────────────────────────
function Savings({ data, openModal, handleDelete, fmt }) {
  const chartData=data.savings.map(s=>({label:s.description?.slice(0,5)||"Goal",value:Number(s.current||0)}));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 0 14px"}}>
        <button onClick={()=>openModal("saving")} className="action-btn" style={{background:"linear-gradient(135deg,#C084FC,#60A5FA)",border:"none",borderRadius:14,padding:"9px 18px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:"0 4px 16px rgba(192,132,252,0.3)"}}>+ Add Goal</button>
      </div>
      {data.savings.length>0&&(
        <div style={{...G.card,padding:16,marginBottom:14}}>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Saved So Far</div>
          <BarChart data={chartData} color={["#C084FC","#60A5FA"]} height={80}/>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {data.savings.map((s,idx)=>{
          const pct=s.target>0?Math.min((s.current/s.target)*100,100):0,done=s.current>=s.target&&s.target>0;
          return(
            <div key={s.id} className="card" style={{...G.card,padding:20,animationDelay:`${idx*0.05}s`,border:done?"1px solid rgba(52,211,153,0.25)":"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div><div style={{fontWeight:600,fontSize:15}}>{s.description}</div>{s.deadline&&<div style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:2}}>By {s.deadline}</div>}</div>
                <div style={{textAlign:"right"}}><div style={{color:done?"#34D399":"#C084FC",fontWeight:700,fontSize:14}}>{fmt(s.current)}</div><div style={{color:"rgba(255,255,255,0.3)",fontSize:11}}>of {fmt(s.target)}</div></div>
              </div>
              <div style={{height:7,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",width:`${pct}%`,background:done?"linear-gradient(90deg,#34D399,#2DD4BF)":"linear-gradient(90deg,#C084FC,#60A5FA)",borderRadius:4,transition:"width 0.7s ease"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:12,color:done?"#34D399":"rgba(255,255,255,0.3)"}}>{done?"🎉 Goal reached!":`${pct.toFixed(0)}% complete`}</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>openModal("saving",s)} className="action-btn" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Edit</button>
                  <button onClick={()=>handleDelete("saving",s.id)} className="action-btn" style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",color:"#F87171",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Del</button>
                </div>
              </div>
            </div>
          );
        })}
        {data.savings.length===0&&<div style={{color:"rgba(255,255,255,0.2)",textAlign:"center",padding:40,fontSize:13}}>No savings goals yet<br/><span style={{fontSize:11,opacity:0.6}}>Tap + Add Goal to get started</span></div>}
      </div>
    </div>
  );
}

// ─── INVESTMENTS ──────────────────────────────────────────────────────────────
function Investments({ data, openModal, handleDelete, fmt }) {
  const totalCost=data.investments.reduce((a,b)=>a+Number(b.cost||0),0);
  const totalVal=data.investments.reduce((a,b)=>a+Number(b.value||0),0);
  const gain=totalVal-totalCost;
  const gainPct=totalCost>0?((gain/totalCost)*100).toFixed(2):0;
  const chartData=data.investments.map(inv=>({label:inv.description?.slice(0,5)||"Inv",value:Number(inv.value||0)}));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",padding:"8px 0 12px"}}>
        <button onClick={()=>openModal("investment")} className="action-btn" style={{background:"linear-gradient(135deg,#60A5FA,#C084FC)",border:"none",borderRadius:14,padding:"9px 18px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:"0 4px 16px rgba(96,165,250,0.3)"}}>+ Add Asset</button>
      </div>
      {data.investments.length>0&&(
        <>
          <div style={{background:"linear-gradient(135deg,rgba(96,165,250,0.15),rgba(192,132,252,0.12))",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:24,padding:20,marginBottom:12}}>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase"}}>Total Portfolio</div>
            <div style={{fontSize:34,fontWeight:800,color:"#60A5FA",marginTop:6}}>{fmt(totalVal)}</div>
            <div style={{color:gain>=0?"#34D399":"#F87171",fontSize:14,fontWeight:600,marginTop:6}}>{gain>=0?"▲":"▼"} {fmt(Math.abs(gain))} ({gainPct}%)</div>
          </div>
          <div style={{...G.card,padding:16,marginBottom:12}}>
            <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Asset Values</div>
            <BarChart data={chartData} color={["#60A5FA","#C084FC"]} height={80}/>
          </div>
        </>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {data.investments.map((inv,idx)=>{
          const g=Number(inv.value)-Number(inv.cost),gp=inv.cost>0?((g/inv.cost)*100).toFixed(1):0;
          return(
            <div key={inv.id} className="card" style={{...G.card,padding:16,animationDelay:`${idx*0.04}s`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>{inv.description}</div>
                  <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,marginTop:2}}>{inv.category||"Asset"}</div>
                  <div style={{color:g>=0?"#34D399":"#F87171",fontSize:13,fontWeight:600,marginTop:6}}>{g>=0?"+":""}{fmt(g)} ({gp}%)</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,color:"#60A5FA",fontSize:15}}>{fmt(inv.value)}</div>
                  <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginTop:2}}>Cost: {fmt(inv.cost)}</div>
                  <div style={{display:"flex",gap:6,marginTop:10,justifyContent:"flex-end"}}>
                    <button onClick={()=>openModal("investment",inv)} className="action-btn" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Edit</button>
                    <button onClick={()=>handleDelete("investment",inv.id)} className="action-btn" style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",color:"#F87171",borderRadius:8,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>Del</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {data.investments.length===0&&<div style={{color:"rgba(255,255,255,0.2)",textAlign:"center",padding:40,fontSize:13}}>No investments yet<br/><span style={{fontSize:11,opacity:0.6}}>Tap + Add Asset to get started</span></div>}
      </div>
    </div>
  );
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
function Transactions({ data, openModal, handleDelete, fmt }) {
  const [filter,setFilter]=useState("all");
  const filtered=data.transactions.filter(t=>filter==="all"||t.type===filter);
  const months=getLast6Months();
  const barData=months.map(m=>({label:getMonthLabel(m),value:data.transactions.filter(t=>t.date?.startsWith(m)).reduce((a,b)=>a+Number(b.amount),0)}));
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 0 14px"}}>
        <div style={G.heading}>Transactions</div>
        <button onClick={()=>openModal("transaction")} className="action-btn" style={{...G.btn,padding:"9px 18px",fontSize:13,borderRadius:14}}>+ Add</button>
      </div>
      <div style={{...G.card,padding:16,marginBottom:14}}>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Volume by Month</div>
        <BarChart data={barData} color={["#FF6B9D","#C084FC"]} height={80}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {["all","income","expense"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="action-btn" style={{padding:"8px 18px",borderRadius:100,border:filter===f?"none":"1px solid rgba(255,255,255,0.1)",background:filter===f?"linear-gradient(135deg,#FF6B9D,#C084FC)":"rgba(255,255,255,0.05)",color:filter===f?"#fff":"rgba(255,255,255,0.4)",fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((t,idx)=>(
          <div key={t.id} className="card" style={{...G.card,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",animationDelay:`${idx*0.04}s`}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:40,height:40,borderRadius:14,background:t.type==="income"?"rgba(52,211,153,0.15)":"rgba(248,113,113,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{t.type==="income"?"↑":"↓"}</div>
              <div><div style={{fontSize:14,fontWeight:500}}>{t.description}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{t.category} · {t.date}</div></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <div style={{fontWeight:700,color:t.type==="income"?"#34D399":"#F87171",fontSize:14}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>openModal("transaction",t)} className="action-btn" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",borderRadius:8,padding:"3px 10px",fontSize:11,cursor:"pointer"}}>Edit</button>
                <button onClick={()=>handleDelete("transaction",t.id)} className="action-btn" style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.2)",color:"#F87171",borderRadius:8,padding:"3px 10px",fontSize:11,cursor:"pointer"}}>Del</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div style={{color:"rgba(255,255,255,0.2)",textAlign:"center",padding:40,fontSize:13}}>No transactions found</div>}
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function History({ data, fmt, COLORS }) {
  const months=getLast6Months();
  const now=new Date();
  const thisMonth=getMonthKey(now);
  const lastMonth=getMonthKey(new Date(now.getFullYear(),now.getMonth()-1,1));
  const [compareMonth,setCompareMonth]=useState(lastMonth);
  const getStats=(m)=>{
    const txns=data.transactions.filter(t=>t.date?.startsWith(m));
    const income=txns.filter(t=>t.type==="income").reduce((a,b)=>a+Number(b.amount),0);
    const expense=txns.filter(t=>t.type==="expense").reduce((a,b)=>a+Number(b.amount),0);
    const cats={}; txns.filter(t=>t.type==="expense").forEach(t=>{ cats[t.category]=(cats[t.category]||0)+Number(t.amount); });
    return{income,expense,net:income-expense,cats};
  };
  const current=getStats(thisMonth),compare=getStats(compareMonth);
  const barData=months.map(m=>({label:getMonthLabel(m),value:data.transactions.filter(t=>t.type==="expense"&&t.date?.startsWith(m)).reduce((a,b)=>a+Number(b.amount),0)}));
  const allCats=[...new Set([...Object.keys(current.cats),...Object.keys(compare.cats)])];
  const diff=(a,b)=>{ if(b===0) return a>0?"+100%":"—"; const d=((a-b)/b*100).toFixed(0); return `${d>0?"+":""}${d}%`; };
  return(
    <div>
      <div style={{padding:"16px 0 14px"}}>
        <div style={G.heading}>History</div>
        <div style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:4}}>Compare months & track trends</div>
      </div>
      <div style={{...G.card,padding:20,marginBottom:12}}>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Monthly Expenses</div>
        <BarChart data={barData} color={["#FF6B9D","#C084FC"]} height={100}/>
      </div>
      <div style={{...G.card,padding:16,marginBottom:12}}>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Compare With</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {months.filter(m=>m!==thisMonth).map(m=>(
            <button key={m} onClick={()=>setCompareMonth(m)} className="action-btn"
              style={{padding:"6px 12px",borderRadius:100,border:"none",background:compareMonth===m?"linear-gradient(135deg,#FF6B9D,#C084FC)":"rgba(255,255,255,0.06)",color:compareMonth===m?"#fff":"rgba(255,255,255,0.4)",fontWeight:600,fontSize:12,cursor:"pointer"}}>
              {getMonthLabel(m)}
            </button>
          ))}
        </div>
      </div>
      <div style={{...G.card,padding:18,marginBottom:12}}>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>Comparison</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[{label:"This Month",month:thisMonth,color:"#FF6B9D"},{label:getMonthLabel(compareMonth),month:compareMonth,color:"#60A5FA"}].map(col=>{
            const s=getStats(col.month);
            return(
              <div key={col.month} style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:12,border:`1px solid ${col.color}22`}}>
                <div style={{color:col.color,fontSize:11,fontWeight:700,marginBottom:8}}>{col.label}</div>
                <div style={{marginBottom:6}}><div style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>Income</div><div style={{color:"#34D399",fontWeight:700,fontSize:13}}>{fmt(s.income)}</div></div>
                <div style={{marginBottom:6}}><div style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>Expenses</div><div style={{color:"#F87171",fontWeight:700,fontSize:13}}>{fmt(s.expense)}</div></div>
                <div><div style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>Net</div><div style={{color:s.net>=0?"#34D399":"#F87171",fontWeight:700,fontSize:13}}>{s.net>=0?"+":""}{fmt(s.net)}</div></div>
              </div>
            );
          })}
        </div>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Change</div>
        {[{label:"Income",curr:current.income,prev:compare.income},{label:"Expenses",curr:current.expense,prev:compare.expense},{label:"Net",curr:current.net,prev:compare.net}].map(row=>{
          const pct=diff(row.curr,row.prev);
          const good=row.label==="Expenses"?!pct.startsWith("+"):pct.startsWith("+");
          return(
            <div key={row.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <span style={{color:"rgba(255,255,255,0.5)",fontSize:13}}>{row.label}</span>
              <span style={{fontWeight:700,fontSize:13,color:pct==="—"?"rgba(255,255,255,0.3)":good?"#34D399":"#F87171"}}>{pct}</span>
            </div>
          );
        })}
      </div>
      {allCats.length>0&&(
        <div style={{...G.card,padding:18,marginBottom:12}}>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>By Category</div>
          {allCats.map((cat)=>{
            const curr=current.cats[cat]||0,prev=compare.cats[cat]||0,max=Math.max(curr,prev,1);
            return(
              <div key={cat} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>{cat}</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{fmt(curr)} vs {fmt(prev)}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3}}>
                  <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{height:"100%",width:`${(curr/max)*100}%`,background:"#FF6B9D",borderRadius:2}}/></div>
                  <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{height:"100%",width:`${(prev/max)*100}%`,background:"#60A5FA",borderRadius:2}}/></div>
                </div>
              </div>
            );
          })}
          <div style={{display:"flex",gap:16,marginTop:8}}>
            {[{c:"#FF6B9D",l:"This Month"},{c:"#60A5FA",l:getMonthLabel(compareMonth)}].map(s=>(
              <div key={s.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:4,borderRadius:2,background:s.c}}/><span style={{fontSize:10,color:"rgba(255,255,255,0.35)"}}>{s.l}</span></div>
            ))}
          </div>
        </div>
      )}
      {data.transactions.length===0&&<div style={{color:"rgba(255,255,255,0.2)",textAlign:"center",padding:40,fontSize:13}}>Add transactions to see history ✨</div>}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ profile, saveProfile, showToast, initials, canGoBack, goBack }) {
  const [editing,setEditing]=useState(!profile.name);
  const [draft,setDraft]=useState({...profile});
  const handleSave=()=>{ if(!draft.name) return showToast("Name is required"); saveProfile(draft); setEditing(false); showToast("Profile saved! ✨"); };
  const selectedCurrency=CURRENCIES.find(c=>c.code===profile.currencyCode);

  const GInput=({field,label,type="text",opts=null})=>(
    <div style={{marginBottom:16}}>
      <label style={G.label}>{label}</label>
      {opts?<select value={draft[field]||""} onChange={e=>setDraft(d=>({...d,[field]:e.target.value}))} style={G.input}><option value="">Select {label}...</option>{opts.map(o=>typeof o==="string"?<option key={o} value={o}>{o}</option>:<option key={o.code} value={o.code}>{o.symbol} — {o.name} ({o.code})</option>)}</select>
        :<input type={type} value={draft[field]||""} onChange={e=>setDraft(d=>({...d,[field]:e.target.value}))} placeholder={label} style={G.input}/>}
    </div>
  );

  return(
    <div style={{paddingTop:52}}>
      {/* Back button for profile too */}
      {canGoBack&&(
        <button onClick={goBack} style={{background:"rgba(255,107,157,0.12)",border:"1px solid rgba(255,107,157,0.25)",color:"#FF6B9D",fontSize:12,fontWeight:700,cursor:"pointer",padding:"5px 14px",borderRadius:100,marginBottom:16,display:"inline-flex",alignItems:"center",gap:5}}>
          ‹ Back
        </button>
      )}

      <div style={{textAlign:"center",marginBottom:24,position:"relative"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,157,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{width:110,height:110,borderRadius:"50%",padding:3,background:"linear-gradient(135deg,#FF6B9D,#C084FC,#60A5FA)",margin:"0 auto"}}>
          <div style={{width:"100%",height:"100%",borderRadius:"50%",background:"rgba(5,11,46,0.95)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:800,color:"#fff"}}>{initials}</div>
        </div>
        {!editing&&(
          <>
            <div style={{fontSize:26,fontWeight:800,marginTop:16,background:"linear-gradient(90deg,#fff,rgba(255,255,255,0.8))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{profile.name||"Your Name"}</div>
            {profile.username&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:14,marginTop:4}}>@{profile.username}</div>}
            <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12,flexWrap:"wrap"}}>
              {profile.country&&<span style={{background:"rgba(255,255,255,0.08)",borderRadius:100,padding:"5px 14px",fontSize:12,color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)"}}>🌍 {profile.country}</span>}
              {profile.gender&&<span style={{background:"rgba(255,255,255,0.08)",borderRadius:100,padding:"5px 14px",fontSize:12,color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.1)"}}>{profile.gender}</span>}
              {selectedCurrency&&<span style={{background:"linear-gradient(135deg,rgba(255,107,157,0.2),rgba(192,132,252,0.2))",borderRadius:100,padding:"5px 14px",fontSize:12,color:"#FF6B9D",fontWeight:600,border:"1px solid rgba(255,107,157,0.3)"}}>{selectedCurrency.symbol} {selectedCurrency.code}</span>}
            </div>
            {profile.bio&&<p style={{color:"rgba(255,255,255,0.45)",fontSize:13,marginTop:14,lineHeight:1.7,maxWidth:300,margin:"14px auto 0"}}>{profile.bio}</p>}
          </>
        )}
      </div>

      {!editing?(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4,paddingLeft:4}}>Profile Info</div>
          {[{label:"Full Name",value:profile.name},{label:"Username",value:profile.username?`@${profile.username}`:null},{label:"Gender",value:profile.gender},{label:"Country",value:profile.country},{label:"Currency",value:selectedCurrency?`${selectedCurrency.symbol} ${selectedCurrency.name} (${selectedCurrency.code})`:null}].filter(i=>i.value).map((item,idx)=>(
            <div key={item.label} className="card" style={{...G.card,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",animationDelay:`${idx*0.05}s`}}>
              <span style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>{item.label}</span>
              <span style={{color:"#E8EAF0",fontSize:13,fontWeight:500,maxWidth:"60%",textAlign:"right"}}>{item.value}</span>
            </div>
          ))}
          {profile.bio&&<div style={{...G.card,padding:"14px 18px"}}><div style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:6}}>Bio</div><div style={{color:"#E8EAF0",fontSize:13,lineHeight:1.65}}>{profile.bio}</div></div>}
          <button onClick={()=>{setDraft({...profile});setEditing(true);}} className="action-btn" style={{...G.btn,marginTop:10,padding:16,fontSize:15,width:"100%",borderRadius:18}}>✏️ Edit Profile</button>
        </div>
      ):(
        <div style={{...G.card,padding:20}}>
          <GInput field="name" label="Full Name *"/>
          <GInput field="username" label="Username"/>
          <GInput field="gender" label="Gender" opts={["Male","Female","Non-binary","Prefer not to say"]}/>
          <GInput field="country" label="Country" opts={COUNTRIES}/>
          <div style={{marginBottom:16}}>
            <label style={G.label}>Currency</label>
            <select value={draft.currencyCode||""} onChange={e=>setDraft(d=>({...d,currencyCode:e.target.value}))} style={G.input}>
              <option value="">Select currency...</option>
              {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.symbol} — {c.name} ({c.code})</option>)}
            </select>
          </div>
          <div style={{marginBottom:16}}>
            <label style={G.label}>Bio</label>
            <textarea value={draft.bio||""} onChange={e=>setDraft(d=>({...d,bio:e.target.value}))} placeholder="A short bio..." style={{...G.input,minHeight:80,resize:"none"}}/>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>setEditing(false)} className="action-btn" style={{...G.btnGhost,flex:1,padding:15,fontSize:15}}>Cancel</button>
            <button onClick={handleSave} className="action-btn" style={{...G.btn,flex:2,padding:15,fontSize:15}}>Save Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MODAL FORM ───────────────────────────────────────────────────────────────
function ModalForm({ modal, form, setForm }) {
  const inp=(field,label,type="text",opts=null)=>(
    <div style={{marginBottom:15}}>
      <label style={G.label}>{label}</label>
      {opts?<select value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={G.input}><option value="">Select...</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
        :<input type={type} value={form[field]||""} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={label} style={G.input}/>}
    </div>
  );
  if(modal==="transaction") return <>{inp("description","Description")}{inp("amount","Amount","number")}{inp("type","Type","text",["income","expense"])}{inp("category","Category","text",form.type==="income"?INCOME_CATS:CATEGORIES)}{inp("date","Date","date")}</>;
  if(modal==="budget")      return <>{inp("category","Category","text",CATEGORIES)}{inp("amount","Monthly Budget","number")}{inp("description","Notes (optional)")}</>;
  if(modal==="saving")      return <>{inp("description","Goal Name")}{inp("target","Target Amount","number")}{inp("current","Amount Saved So Far","number")}{inp("deadline","Target Date (optional)","date")}</>;
  if(modal==="investment")  return <>{inp("description","Asset Name")}{inp("category","Type","text",["Stocks","Crypto","ETF","Real Estate","Bonds","Other"])}{inp("cost","Cost Basis","number")}{inp("value","Current Value","number")}</>;
}
