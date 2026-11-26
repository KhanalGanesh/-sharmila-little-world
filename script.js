
const STORE_KEY = "sharmilaLittleWorld_v2";

const sections = {
  fashion: [
    ["Your style mood", ["Quiet minimal","Soft elegance","Modern street","Soft romantic","Classic chic","Cute & playful","Vintage","Streetwear","Korean style","Old money","Bohemian"]],
    ["Favourite colours", ["Pink","White","Black","Beige","Blue","Pastel shades","Earth tones","Lavender","Red","Green","Brown"]],
    ["Clothing you love", ["Dresses","Jeans","Skirts","Wide-leg trousers","Oversized tops","Traditional outfits","Crop tops","Cardigans","Blazers","Jumpsuits"]],
    ["Shoes & accessories", ["Sneakers","Heels","Flats","Boots","Handbags","Minimal jewellery","Hair accessories","Sunglasses","Watches","Cute bags"]],
    ["Beauty interests", ["Natural makeup","Bold makeup","Skincare","Haircare","Perfume","Simple everyday look","Lip gloss","Nail art","Soft glam"]]
  ],
  hobbies: [
    ["Music", ["Pop","K-pop","Hindi songs","Nepali songs","English songs","Classical","Lo-fi","Rock","R&B","Jazz","EDM"]],
    ["Screen & stories", ["K-drama","Movies","Anime","Romance","Comedy","Thriller","Documentaries","Reality shows","Fantasy","Mystery"]],
    ["Creative hobbies", ["Photography","Drawing","Dancing","Singing","Writing","Crafts","Cooking","Painting","Fashion design","Making videos"]],
    ["Free-time mood", ["Reading","Shopping","Travel","Cafes","Nature walks","Gaming","Fitness","Trying new things","Gardening","Baking","Yoga"]]
  ],
  dreams: [
    ["Places to explore", ["Japan","South Korea","Switzerland","Italy","France","Maldives","Nepal","Australia","London","Dubai","Somewhere new"]],
    ["Dream lifestyle", ["Cozy home","Travel often","Own business","Creative career","Financial freedom","Peaceful slow life","City lifestyle","Life near the sea","Beautiful apartment"]],
    ["Personal goals", ["Learn a new skill","Build confidence","Career growth","Save money","Stay healthy","Help my family","Learn languages","Become independent"]],
    ["Dream experiences", ["See the northern lights","Live near the sea","Road trip","Favourite artist concert","Solo trip","Beautiful home studio","Hot air balloon ride","World tour"]]
  ],
  dating: [
    ["Your ideal first date", ["Cute cafe","Dinner date","Picnic","Beach or sunset walk","Movie night","Adventure date","Amusement park","Bookstore date","Shopping date"]],
    ["Your date atmosphere", ["Romantic","Funny & playful","Calm & cozy","Spontaneous","Elegant","Simple & genuine","A little adventurous"]],
    ["What matters most", ["Honesty","Respect","Good communication","Kindness","Loyalty","Sense of humour","Trust","Emotional support"]],
    ["Little things you love", ["Thoughtful messages","Remembering details","Quality time","Small surprises","Deep conversations","Laughing together","Flowers","Handwritten notes"]]
  ],
  play: [
    ["Choose your perfect day", ["Beach day","Mountain escape"]],
    ["Pick a little treat", ["Coffee date","Dessert date"]],
    ["Your evening mood", ["Movie & blanket","Night drive"]],
    ["Choose a getaway", ["Busy city","Quiet countryside"]],
    ["Your happy place", ["Bookstore","Flower shop"]]
  ]
};

function loadState(){
  try{
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {
      answers:{},results:{},shares:{},memories:[],diary:[],mood:""
    };
  }catch(e){
    return {answers:{},results:{},shares:{},memories:[],diary:[],mood:""};
  }
}

const state = loadState();

function saveState(){
  localStorage.setItem(STORE_KEY,JSON.stringify(state));
}

function esc(value){
  return String(value).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

/* NAVIGATION */

function navigate(id){
  document.querySelectorAll(".page").forEach(page=>{
    page.classList.toggle("active",page.id===id);
  });

  document.querySelectorAll(".nav-link").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.page===id);
  });

  document.querySelector(".nav")?.classList.remove("open");

  window.scrollTo({top:0,behavior:"smooth"});

  if(id==="share") renderShare();
}

document.querySelectorAll("[data-page]").forEach(el=>{
  el.addEventListener("click",()=>{
    navigate(el.dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach(el=>{
  el.addEventListener("click",()=>{
    navigate(el.dataset.go);
  });
});

/* MENU TOGGLE REMOVED HERE
   appearance.js now controls the mobile menu.
*/

document.getElementById("openShare").addEventListener("click",()=>{
  navigate("share");
});

/* SELECTIONS: MAXIMUM FOUR PER CATEGORY */

function renderFields(id){
  const host=document.getElementById(id+"Fields");
  if(!host || !sections[id]) return;

  host.innerHTML=sections[id].map((group,gi)=>`
    <div class="field-group">
      <h3>${esc(group[0])} <span class="muted">(max 4)</span></h3>
      <div class="options">
        ${group[1].map(option=>{
          const checked=(state.answers[id]?.[gi]||[]).includes(option);
          return `
            <label class="choice">
              <input type="${id==="play"?"radio":"checkbox"}"
                name="${id}-${gi}" value="${esc(option)}"
                ${checked?"checked":""}>
              <span>${esc(option)}</span>
            </label>`;
        }).join("")}
      </div>
    </div>
  `).join("");

  host.querySelectorAll("input").forEach(input=>{
    input.addEventListener("change",()=>{
      const groupIndex=Number(input.name.split("-").pop());

      const checkedInputs=[...host.querySelectorAll(
        `input[name="${id}-${groupIndex}"]:checked`
      )];

      if(id!=="play" && checkedInputs.length>4){
        input.checked=false;
        alert("You can choose a maximum of 4 options in this category ♡");
      }

      collectAnswers(id);
    });
  });
}

function collectAnswers(id){
  state.answers[id]=sections[id].map((group,gi)=>{
    return [...document.querySelectorAll(
      `#${id}Fields input[name="${id}-${gi}"]:checked`
    )].map(input=>input.value);
  });

  saveState();
}

/* RESULT GENERATOR */

function showResult(id){
  collectAnswers(id);

  const chosen=state.answers[id].flat();
  const box=document.getElementById(id+"Result");

  if(!chosen.length){
    box.innerHTML="<p>Please choose some options first ♡</p>";
    box.classList.remove("hidden");
    return;
  }

  const names={
    fashion:"Your Personal Style",
    hobbies:"Your Interest Profile",
    dreams:"Your Dream Board",
    dating:"Your Ideal Date Plan",
    play:"Your Little Vibe"
  };

  const descriptions={
    fashion:"Your style is a mix of the things that make you feel confident and comfortable.",
    hobbies:"These are the little interests that bring colour to your everyday life.",
    dreams:"Your dreams are yours to shape, one small step at a time.",
    dating:"Here is a little plan inspired by your date preferences.",
    play:"Your choices make a fun little snapshot of your current vibe."
  };

  let extra="";

  if(id==="dating"){
    const date=document.getElementById("datePlan").value;
    const time=document.getElementById("dateTime").value;
    const place=document.getElementById("datePlace").value;

    if(date) extra+=`<p><strong>📅 Date:</strong> ${esc(date)}</p>`;
    if(time) extra+=`<p><strong>🕒 Time:</strong> ${esc(time)}</p>`;
    if(place) extra+=`<p><strong>📍 Place:</strong> ${esc(place)}</p>`;
  }

  box.innerHTML=`
    <p class="eyebrow">YOUR PERSONAL RESULT</p>
    <h3>${names[id]} ♡</h3>
    <p>${descriptions[id]}</p>
    ${extra}
    <div class="result-tags">${chosen.map(x=>`<span>${esc(x)}</span>`).join("")}</div>
  `;

  box.classList.remove("hidden");

  state.results[id]={
    title:names[id],
    description:descriptions[id],
    choices:chosen,
    date:id==="dating"?document.getElementById("datePlan").value:"",
    time:id==="dating"?document.getElementById("dateTime").value:"",
    place:id==="dating"?document.getElementById("datePlace").value:"",
    updated:new Date().toISOString()
  };

  saveState();
}

document.querySelectorAll("[data-result]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    showResult(btn.dataset.result);
  });
});

function resetSection(id){
  state.answers[id]=[];
  delete state.results[id];
  saveState();
  renderFields(id);

  const box=document.getElementById(id+"Result");
  if(box) box.classList.add("hidden");

  if(id==="dating"){
    document.getElementById("datePlan").value="";
    document.getElementById("dateTime").value="";
    document.getElementById("datePlace").value="";
  }
}

document.querySelectorAll("[data-reset]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    resetSection(btn.dataset.reset);
  });
});

/* SHARE CHECKBOXES */

document.querySelectorAll("[data-share]").forEach(cb=>{
  cb.checked=!!state.shares[cb.dataset.share];

  cb.addEventListener("change",()=>{
    state.shares[cb.dataset.share]=cb.checked;
    saveState();
  });
});

/* MEMORIES: SAVE AND DELETE */

function renderMemories(){
  const host=document.getElementById("memoryList");

  host.innerHTML=state.memories.map((m,i)=>`
    <article class="memory-item">
      <strong>${esc(m.title)}</strong>
      <small>${esc(m.date||"Date not set")}</small>
      <p>${esc(m.text)}</p>
      <button class="delete-btn" data-delete-memory="${i}">🗑 Delete memory</button>
    </article>
  `).join("") || '<p class="muted">No memories saved yet. Add your first memory ♡</p>';

  host.querySelectorAll("[data-delete-memory]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const index=Number(btn.dataset.deleteMemory);

      if(confirm("Are you sure you want to delete this memory?")){
        state.memories.splice(index,1);
        saveState();
        renderMemories();
      }
    });
  });
}

document.getElementById("saveMemory").addEventListener("click",()=>{
  const title=document.getElementById("memoryTitle").value.trim();
  const date=document.getElementById("memoryDate").value;
  const text=document.getElementById("memoryText").value.trim();

  if(!title||!text){
    alert("Please enter a title and memory note.");
    return;
  }

  state.memories.unshift({title,date,text});
  saveState();

  document.getElementById("memoryTitle").value="";
  document.getElementById("memoryDate").value="";
  document.getElementById("memoryText").value="";

  renderMemories();
});

/* PRIVATE DIARY: SAVE AND DELETE */

let selectedMood=state.mood;

document.querySelectorAll("[data-mood]").forEach(btn=>{
  btn.classList.toggle("selected",btn.dataset.mood===selectedMood);

  btn.addEventListener("click",()=>{
    selectedMood=btn.dataset.mood;

    document.querySelectorAll("[data-mood]").forEach(item=>{
      item.classList.toggle("selected",item===btn);
    });
  });
});

function renderDiary(){
  const host=document.getElementById("diaryList");

  host.innerHTML=state.diary.map((entry,i)=>`
    <article class="memory-item">
      <small>${esc(entry.date)} · ${esc(entry.mood)}</small>
      <p>${esc(entry.text)}</p>
      <button class="delete-btn" data-delete-diary="${i}">🗑 Delete entry</button>
    </article>
  `).join("") || '<p class="muted">Your private diary entries will appear here.</p>';

  host.querySelectorAll("[data-delete-diary]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const index=Number(btn.dataset.deleteDiary);

      if(confirm("Delete this private diary entry?")){
        state.diary.splice(index,1);
        saveState();
        renderDiary();
      }
    });
  });
}

document.getElementById("saveDiary").addEventListener("click",()=>{
  const text=document.getElementById("diaryText").value.trim();

  if(!text){
    alert("Write a little note first.");
    return;
  }

  state.diary.unshift({
    text,
    mood:selectedMood||"No mood selected",
    date:new Date().toLocaleDateString()
  });

  saveState();
  document.getElementById("diaryText").value="";
  renderDiary();
});

/* SURPRISE BOX */

const surprises=[
  {
    emoji:"🌸",
    title:"A little reminder for you",
    message:"You are allowed to grow at your own pace. Your journey is yours, and that is what makes it special. ♡"
  },
  {
    emoji:"💌",
    title:"A tiny happy note",
    message:"I hope something unexpectedly beautiful happens to you today. Keep smiling and keep being yourself. ✨"
  },
  {
    emoji:"⭐",
    title:"Your next little adventure",
    message:"Choose one new thing to try this week. A new cafe, a new song, a new place or a new hobby. Make a memory!"
  }
];

document.querySelectorAll("[data-surprise]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const item=surprises[Number(btn.dataset.surprise)];

    document.getElementById("surpriseBox").textContent=item.emoji;
    document.getElementById("surpriseTitle").textContent=item.title;
    document.getElementById("surpriseMessage").textContent=item.message;
  });
});

/* SHARE PREVIEW AND EXPORT */

function renderShare(){
  const host=document.getElementById("sharePreview");
  const selected=Object.keys(state.shares).filter(k=>state.shares[k]);

  host.innerHTML=selected.map(k=>`
    <div class="share-line">
      <span>${esc(k[0].toUpperCase()+k.slice(1))}</span>
      <span>${state.results[k]?"Result ready to share":"No generated result yet"}</span>
    </div>
  `).join("") || '<p class="muted">No sections selected for sharing yet.</p>';
}

document.getElementById("prepareShare").addEventListener("click",()=>{
  const selected=Object.keys(state.shares).filter(k=>state.shares[k]);
  const box=document.getElementById("shareStatus");

  if(!selected.length){
    box.innerHTML="<p>Select at least one section to share first.</p>";
    box.classList.remove("hidden");
    return;
  }

  const payload={
    createdAt:new Date().toISOString(),
    sharedSections:selected.map(k=>({
      section:k,
      result:state.results[k]||null,
      memories:k==="moments"?state.memories:undefined
    }))
  };

  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");

  link.href=url;
  link.download="sharmila-shared-results.json";
  link.click();

  URL.revokeObjectURL(url);

  box.innerHTML="<h3>Your sharing file is ready ♡</h3><p>Only the sections you selected have been included. Your diary is excluded. This demo downloads a file; it does not send it online yet.</p>";
  box.classList.remove("hidden");
});

/* START */

Object.keys(sections).forEach(renderFields);
renderMemories();
renderDiary();
renderShare();
