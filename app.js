/* SORYVYN web PWA · Chunk 01
   Local demo interface only. No source websites are fetched in this milestone. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const STORAGE_KEY = "soryvyn.web.chunk01";
  const allowedCategories = new Set(["Manga", "Manhwa", "Manhua"]);

  const titles = [
    {id:"quiet-stars",title:"The Quiet Between Stars",category:"Manhwa",genre:"Fantasy",status:"Ongoing",rating:9.1,chapters:42,updated:8,language:"Korean",source:"Moon Archive",cover:"cover-a",coverNo:"001",kicker:"A MAP OF THE UNKNOWN",creator:"Yuna Seo",description:"A cartographer of forgotten worlds discovers a map that redraws itself every night. Every new line leads to a place no one remembers—and a memory she was never meant to recover.",tags:["Fantasy","Adventure","Mystery"],chaptersLabel:"42 chapters",featured:true},
    {id:"glass-moon",title:"Glass Moon Protocol",category:"Manga",genre:"Sci-Fi",status:"Completed",rating:8.8,chapters:26,updated:7,language:"Japanese",source:"Northstar Index",cover:"cover-b",coverNo:"002",kicker:"THE LAST TRANSMISSION",creator:"A. Moriyama",description:"On a city where night has become a subscription, a quiet repair technician receives a signal from the moon—one that should have gone dark a century ago.",tags:["Sci-Fi","Mystery","Drama"],chaptersLabel:"26 chapters"},
    {id:"lilies-sleep",title:"Where Lilies Sleep",category:"Manga",genre:"Mystery",status:"Ongoing",rating:8.6,chapters:18,updated:6,language:"Japanese",source:"Inkhouse Mirror",cover:"cover-c",coverNo:"003",kicker:"A FLOWER REMEMBERS",creator:"Natsumi Rei",description:"A new student arrives at an academy that has no graduation records. The only clue to its missing alumni is a lily pressed inside a library book.",tags:["Mystery","Drama","Supernatural"],chaptersLabel:"18 chapters"},
    {id:"paper-kingdom",title:"The Paper Kingdom",category:"Manhua",genre:"Fantasy",status:"Ongoing",rating:9.0,chapters:64,updated:5,language:"Chinese",source:"Silk Panel",cover:"cover-d",coverNo:"004",kicker:"DRAWN INTO DESTINY",creator:"Lin Yue",description:"A young mapmaker can fold paper into any place she has visited. When a forgotten empire begins to vanish, she must sketch a way back into its history.",tags:["Fantasy","Adventure","Action"],chaptersLabel:"64 chapters"},
    {id:"rainline",title:"After the Rainline",category:"Manhwa",genre:"Slice of Life",status:"Completed",rating:8.9,chapters:32,updated:4,language:"Korean",source:"Moon Archive",cover:"cover-e",coverNo:"005",kicker:"MEET ME AT PLATFORM NINE",creator:"Han Ji-woo",description:"Two strangers keep leaving notes in the same secondhand bookshop. As the seasons turn, their separate stories begin to overlap in unexpected ways.",tags:["Slice of Life","Romance","Drama"],chaptersLabel:"32 chapters"},
    {id:"zero-meridian",title:"Zero Meridian",category:"Manga",genre:"Action",status:"Ongoing",rating:8.4,chapters:51,updated:3,language:"Japanese",source:"Northstar Index",cover:"cover-f",coverNo:"006",kicker:"NO NORTH. NO RETURN.",creator:"K. Arata",description:"When every compass begins pointing toward the same empty ocean, a rookie navigator joins an expedition to find the source of the world's new magnetic pull.",tags:["Action","Adventure","Sci-Fi"],chaptersLabel:"51 chapters"},
    {id:"lanterns-deep",title:"Lanterns in the Deep",category:"Manhwa",genre:"Fantasy",status:"Ongoing",rating:9.3,chapters:29,updated:2,language:"Korean",source:"Inkhouse Mirror",cover:"cover-g",coverNo:"007",kicker:"LIGHT IS A LIVING THING",creator:"Mira Kwon",description:"In a coastal town where lanterns are lit for the lost, a young keeper learns that some lights are not guiding people home. They are keeping something asleep.",tags:["Fantasy","Mystery","Adventure"],chaptersLabel:"29 chapters"},
    {id:"fourth-seal",title:"The Fourth Seal",category:"Manhua",genre:"Action",status:"Completed",rating:8.7,chapters:38,updated:1,language:"Chinese",source:"Silk Panel",cover:"cover-h",coverNo:"008",kicker:"EVERY DOOR HAS A PRICE",creator:"Wei Chen",description:"A locksmith who can open impossible doors is asked to break the final seal beneath an abandoned city. The key fits—but the lock remembers every hand that touched it.",tags:["Action","Fantasy","Thriller"],chaptersLabel:"38 chapters"}
  ].filter(item => allowedCategories.has(item.category));

  const sourceSeed = [
    {id:"northstar",name:"Northstar Index",symbol:"N",language:"ja",languageLabel:"Japanese",categories:["Manga"],description:"A sample catalogue focused on Japanese manga metadata.",count:1824,health:"Demo connector"},
    {id:"moon",name:"Moon Archive",symbol:"M",language:"ko",languageLabel:"Korean",categories:["Manhwa"],description:"An illustrative source profile for Korean manhwa discovery.",count:946,health:"Demo connector"},
    {id:"silk",name:"Silk Panel",symbol:"S",language:"zh",languageLabel:"Chinese",categories:["Manhua"],description:"A mock source profile for Chinese manhua discovery.",count:613,health:"Demo connector"},
    {id:"inkhouse",name:"Inkhouse Mirror",symbol:"I",language:"en",languageLabel:"English",categories:["Manga","Manhwa","Manhua"],description:"A fictional multi-category source used to test filtering and layout.",count:2078,health:"Demo connector"}
  ];
  const defaultState = {
    savedIds:[], favoriteIds:[], history:[], progress:{}, enabledSources:["northstar","moon","silk","inkhouse"],
    category:"All",genre:"all",status:"all",theme:"dark",noticeDismissed:false
  };

  function loadState(){
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || typeof parsed !== "object") return structuredClone(defaultState);
      return {
        ...structuredClone(defaultState),
        ...parsed,
        savedIds:Array.isArray(parsed.savedIds)?parsed.savedIds:[],
        favoriteIds:Array.isArray(parsed.favoriteIds)?parsed.favoriteIds:[],
        history:Array.isArray(parsed.history)?parsed.history:[],
        progress:parsed.progress && typeof parsed.progress === "object"?parsed.progress:{},
        enabledSources:Array.isArray(parsed.enabledSources)?parsed.enabledSources:defaultState.enabledSources.slice()
      };
    } catch (_) {
      return structuredClone(defaultState);
    }
  }

  const state = loadState();
  let route = "discover";
  let gridView = "grid";
  let sourceTab = "discover";
  let embeddedHistory = ["discover"];
  let embeddedHistoryIndex = 0;
  let currentTitleId = null;
  let readerPage = 1;
  let readerMode = "page";
  let installPrompt = null;
  let titleQuery = "";
  let libraryQuery = "";
  let sourceQuery = "";
  let sourceLanguage = "all";

  function persist(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { toast("Browser storage is unavailable. Changes may not persist."); }
    renderCounters();
    renderRail();
  }

  function escapeHTML(value){
    return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function titleById(id){ return titles.find(item=>item.id===id); }
  function sourceById(id){ return sourceSeed.find(item=>item.id===id); }
  function isSaved(id){ return state.savedIds.includes(id); }
  function isFavorite(id){ return state.favoriteIds.includes(id); }

  function toast(message){
    const region = $("#toastRegion");
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    region.append(node);
    window.setTimeout(()=>node.remove(), 2800);
  }

  function renderCover(item, extraClass = ""){
    const classes = item.cover || "cover-a";
    return `<div class="cover-art ${classes} ${extraClass}" aria-hidden="true">
      <span class="cover-label">SORYVYN ORIGINAL / SAMPLE</span>
      <span class="cover-kicker">${escapeHTML(item.kicker || "STORIES IN MOTION")}</span>
      <i class="cover-shape one"></i><i class="cover-shape two"></i>
      <span class="cover-title">${escapeHTML(item.title)}</span>
      <span class="cover-no">${escapeHTML(item.coverNo || "SV—000")}</span>
    </div>`;
  }

  function renderTitleCard(item){
    const saved = isSaved(item.id);
    const progress = Number(state.progress[item.id] || 0);
    return `<article class="title-card" data-open-title="${escapeHTML(item.id)}" tabindex="0" role="button" aria-label="Open ${escapeHTML(item.title)} details">
      ${renderCover(item)}
      <div class="card-cardtop"><span class="card-source-mark">${escapeHTML(item.source)}</span><button class="save-button ${saved?"is-saved":""}" data-save-title="${escapeHTML(item.id)}" aria-label="${saved?"Remove from":"Add to"} library" aria-pressed="${saved}">
        <svg viewBox="0 0 24 24"><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/></svg>
      </button></div>
      <div class="card-info">
        <div class="card-category"><span>${escapeHTML(item.category)}</span><i></i><span>${escapeHTML(item.genre)}</span></div>
        <h3 title="${escapeHTML(item.title)}">${escapeHTML(item.title)}</h3>
        <div class="card-subtitle"><span>${escapeHTML(item.status)} · ${item.chapters} ch.</span><span class="card-rating">★ ${item.rating.toFixed(1)}</span></div>
        ${progress>0?`<div class="card-progress" title="Preview reading progress"><span style="width:${Math.min(100,progress/8*100)}%"></span></div>`:""}
      </div>
    </article>`;
  }

  function activeTitleFilters(items){
    const query = titleQuery.trim().toLocaleLowerCase();
    const selectedCategory = state.category;
    const result = items.filter(item=>{
      if (!allowedCategories.has(item.category)) return false;
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      if (state.genre !== "all" && item.genre !== state.genre && !item.tags.includes(state.genre)) return false;
      if (state.status !== "all" && item.status !== state.status) return false;
      if (query){
        const haystack = [item.title,item.creator,item.category,item.genre,item.source,item.language,...item.tags].join(" ").toLocaleLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    switch ($("#sortSelect")?.value || "featured"){
      case "title": result.sort((a,b)=>a.title.localeCompare(b.title)); break;
      case "rating": result.sort((a,b)=>b.rating-a.rating); break;
      case "updated": result.sort((a,b)=>b.updated-a.updated); break;
    }
    return result;
  }

  function renderDiscover(){
    const filtered = activeTitleFilters(titles);
    $("#titleGrid").classList.toggle("list-view",gridView==="list");
    $("#titleGrid").innerHTML = filtered.map(renderTitleCard).join("");
    $("#resultCount").textContent = String(filtered.length).padStart(2,"0") + (filtered.length===1?" TITLE":" TITLES");
    $$("#categoryRow .category-chip").forEach(button=>{
      button.classList.toggle("is-active",button.dataset.category===state.category);
      const category=button.dataset.category;
      const count=category==="All"?titles.length:titles.filter(item=>item.category===category).length;
      const counter=$("span",button);
      if(counter) counter.textContent=String(count).padStart(2,"0");
    });
  }

  function renderGridInto(id, items, emptyId){
    const container = $(id);
    if(!container) return;
    container.classList.toggle("list-view",gridView==="list");
    container.innerHTML = items.map(renderTitleCard).join("");
    if(emptyId) $(emptyId).hidden=items.length!==0;
  }

  function renderLibrary(){
    const items=state.savedIds.map(titleById).filter(Boolean);
    const query=libraryQuery.trim().toLocaleLowerCase();
    renderGridInto("#libraryGrid",items.filter(item=>!query||[item.title,item.creator,item.genre,item.category].join(" ").toLocaleLowerCase().includes(query)),"#libraryEmpty");
    $("#librarySummary").textContent=String(items.length).padStart(2,"0")+" SAVED "+(items.length===1?"TITLE":"TITLES");
  }

  function renderHistory(){
    const ids=[...state.history].reverse();
    const seen=new Set();
    const items=ids.map(titleById).filter(item=>item&&!seen.has(item.id)&&seen.add(item.id));
    renderGridInto("#historyGrid",items,"#historyEmpty");
  }

  function renderFavorites(){
    const items=state.favoriteIds.map(titleById).filter(Boolean);
    renderGridInto("#favoritesGrid",items,"#favoritesEmpty");
  }

  function renderCounters(){
    $("#libraryCount").textContent=String(state.savedIds.length).padStart(2,"0");
    $("#downloadCount").textContent="00";
    $("#savedStat").textContent=String(state.savedIds.length).padStart(2,"0");
    $("#historyStat").textContent=String(new Set(state.history).size).padStart(2,"0");
    $("#readStat").textContent=String(Object.values(state.progress).filter(page=>Number(page)>=8).length).padStart(2,"0");
    $("#storagePercent").textContent=Math.min(100,Math.round(state.savedIds.length/titles.length*100))+"%";
    $("#storageFill").style.width=Math.min(100,state.savedIds.length/titles.length*100)+"%";
    $("#storageLabel").textContent=state.savedIds.length?state.savedIds.length+" saved "+(state.savedIds.length===1?"title":"titles"):"Demo collection";
    $("#footerYear").textContent=new Date().getFullYear();
  }

  function renderMiniSources(){
    $("#sourceMiniList").innerHTML=sourceSeed.slice(0,3).map(source=>`<div class="source-mini"><span class="source-mini-icon">${source.symbol}</span><span class="source-mini-copy"><strong>${escapeHTML(source.name)}</strong><small>${source.languageLabel.toUpperCase()} · SAMPLE</small></span><i class="source-mini-status"></i></div>`).join("");
  }

  function renderRail(){
    const list=$("#railSourceList");
    if(!list) return;
    list.innerHTML=sourceSeed.slice(0,3).map(source=>`<div class="rail-source"><span class="rail-source-mark">${source.symbol}</span><span class="rail-source-copy"><strong>${escapeHTML(source.name)}</strong><small>${state.enabledSources.includes(source.id)?"ENABLED · DEMO":"DISABLED"}</small></span><i class="rail-source-state" style="opacity:${state.enabledSources.includes(source.id)?1:.18}"></i></div>`).join("");
    const recently=[...state.history].reverse().map(titleById).filter(Boolean).filter((item,index,list)=>list.findIndex(x=>x.id===item.id)===index).slice(0,3);
    $("#continueReading").innerHTML=recently.length?recently.map(item=>`<div class="continue-item" data-open-title="${item.id}" tabindex="0" role="button"><div class="continue-thumb">${renderCover(item,"rail-cover")}</div><div class="continue-copy"><strong>${escapeHTML(item.title)}</strong><small>PAGE ${String(state.progress[item.id]||1).padStart(2,"0")} · ${item.category.toUpperCase()}</small><div class="mini-progress"><span style="width:${Math.min(100,(Number(state.progress[item.id]||1)/8)*100)}%"></span></div></div></div>`).join(""):`<div class="rail-empty">Open a title and it will appear here.</div>`;
    $$(".rail-cover").forEach(cover=>{cover.style.aspectRatio="unset";cover.style.width="100%";cover.style.height="100%";cover.querySelectorAll(".cover-label,.cover-kicker,.cover-title,.cover-no").forEach(node=>node.remove());});
  }

  function renderSources(){
    const term=sourceQuery.trim().toLocaleLowerCase();
    let sources=sourceSeed.filter(source=>{
      if(!source.categories.some(category=>allowedCategories.has(category))) return false;
      if(sourceLanguage!=="all"&&source.language!==sourceLanguage)return false;
      if(term&&![source.name,source.languageLabel,source.description,...source.categories].join(" ").toLocaleLowerCase().includes(term))return false;
      return true;
    });
    if(sourceTab==="trending") sources=sources.slice().reverse();
    if(sourceTab==="new") sources=sources.slice().sort((a,b)=>a.name.localeCompare(b.name));
    $("#sourceCatalogue").innerHTML=sources.length?sources.map(source=>{
      const enabled=state.enabledSources.includes(source.id);
      return `<article class="source-card" data-source-card="${source.id}">
        <div class="source-card-icon">${source.symbol}</div>
        <div class="source-card-main"><div class="source-card-title"><strong>${escapeHTML(source.name)}</strong><span class="source-type">${source.categories.join(" / ").toUpperCase()}</span></div><p>${escapeHTML(source.description)}</p><div class="source-card-meta"><span>${source.languageLabel.toUpperCase()}</span><span>•</span><span>ILLUSTRATIVE INDEX</span><span>•</span><span><i></i>${enabled?"ENABLED":"DISABLED"}</span></div></div>
        <button class="source-toggle" role="switch" aria-checked="${enabled}" aria-label="${enabled?"Disable":"Enable"} ${escapeHTML(source.name)}" data-toggle-source="${source.id}"></button>
      </article>`;
    }).join(""):`<div class="empty-state"><div class="empty-symbol">⌕</div><h2>No compatible sample sources match.</h2><p>Change the search term or language filter.</p></div>`;
    $("#sourceCount").textContent=String(sourceSeed.length).padStart(2,"0");
    $("#embeddedStatus").textContent=sources.length+" SAMPLE "+(sources.length===1?"CONNECTOR":"CONNECTORS");
    $("#embeddedAddress").textContent="soryvyn://source-network/"+sourceTab;
    $("#embeddedTitle").textContent=sourceTab==="trending"?"A pulse on the pages.":sourceTab==="new"?"Recently added to the network.":"Choose a source. Find a story.";
    $$(".embedded-tab").forEach(button=>button.classList.toggle("is-active",button.dataset.sourceTab===sourceTab));
  }

  function changeRoute(next){
    if(!["discover","library","updates","downloads","sources","history","favorites"].includes(next))return;
    route=next;
    $$(".page[data-page]").forEach(page=>page.hidden=page.dataset.page!==route);
    $$(".nav-item[data-route]").forEach(button=>button.classList.toggle("is-active",button.dataset.route===route));
    const labels={discover:"Discover",library:"My library",updates:"Updates",downloads:"Downloads",sources:"Source browser",history:"Reading history",favorites:"Favorites"};
    $("#crumbCurrent").textContent=labels[route];
    if(route==="discover")renderDiscover();
    if(route==="library")renderLibrary();
    if(route==="history")renderHistory();
    if(route==="favorites")renderFavorites();
    if(route==="sources")renderSources();
    $("#scrollArea").scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
    if(location.hash!== "#"+route)history.replaceState(null,"","#"+route);
  }

  function openTitle(id){
    const item=titleById(id);if(!item)return;
    if(!state.history.includes(id))state.history.push(id);
    else { state.history=state.history.filter(entry=>entry!==id);state.history.push(id); }
    state.history=state.history.slice(-100);
    currentTitleId=id;
    persist();
    $("#titleModalContent").innerHTML=`<div class="modal-title-layout">${renderCover(item,"modal-title-cover")}<div class="modal-title-copy"><div class="eyebrow">${item.category.toUpperCase()} <span>·</span> ${item.language.toUpperCase()}</div><h2 id="modalTitle">${escapeHTML(item.title)}</h2><p>${escapeHTML(item.description)}</p><div class="modal-tags">${item.tags.map(tag=>`<span>${escapeHTML(tag)}</span>`).join("")}</div><div class="modal-actions"><button class="primary-button" data-reader-open="${item.id}">Read preview <span>→</span></button><button class="secondary-button" data-save-title="${item.id}">${isSaved(id)?"Saved ✓":"Save to library"}</button><button class="secondary-button" data-favorite-title="${item.id}">${isFavorite(id)?"Favorited ✓":"♡ Favorite"}</button></div></div></div><div class="modal-bottom-meta"><span>${escapeHTML(item.creator)}</span><span>${item.chaptersLabel.toUpperCase()}</span><span>★ ${item.rating.toFixed(1)}</span></div>`;
    showModal($("#titleModal"));
    renderRail();
  }

  function showModal(dialog){
    if(!dialog.open) {
      if(typeof dialog.showModal==="function")dialog.showModal();
      else dialog.setAttribute("open","");
    }
  }
  function closeModal(dialog){
    if(dialog.open&&typeof dialog.close==="function")dialog.close();else dialog.removeAttribute("open");
  }

  function toggleSaved(id){
    if(!titleById(id))return;
    if(isSaved(id)){state.savedIds=state.savedIds.filter(value=>value!==id);toast("Removed from your library.");}
    else {state.savedIds.push(id);toast("Saved to your library.");}
    persist();renderDiscover();renderLibrary();renderFavorites();
    if($("#titleModal").open&&currentTitleId===id)openTitleModalRefresh(id);
  }
  function toggleFavorite(id){
    if(!titleById(id))return;
    if(isFavorite(id)){state.favoriteIds=state.favoriteIds.filter(value=>value!==id);toast("Removed from favorites.");}
    else {state.favoriteIds.push(id);toast("Added to favorites.");}
    persist();renderDiscover();renderFavorites();
    if($("#titleModal").open&&currentTitleId===id)openTitleModalRefresh(id);
  }
  function openTitleModalRefresh(id){
    const item=titleById(id);if(!item)return;
    const currentScroll=$("#titleModal").scrollTop;
    $("#titleModalContent").innerHTML=`<div class="modal-title-layout">${renderCover(item,"modal-title-cover")}<div class="modal-title-copy"><div class="eyebrow">${item.category.toUpperCase()} <span>·</span> ${item.language.toUpperCase()}</div><h2 id="modalTitle">${escapeHTML(item.title)}</h2><p>${escapeHTML(item.description)}</p><div class="modal-tags">${item.tags.map(tag=>`<span>${escapeHTML(tag)}</span>`).join("")}</div><div class="modal-actions"><button class="primary-button" data-reader-open="${item.id}">Read preview <span>→</span></button><button class="secondary-button" data-save-title="${item.id}">${isSaved(id)?"Saved ✓":"Save to library"}</button><button class="secondary-button" data-favorite-title="${item.id}">${isFavorite(id)?"Favorited ✓":"♡ Favorite"}</button></div></div></div><div class="modal-bottom-meta"><span>${escapeHTML(item.creator)}</span><span>${item.chaptersLabel.toUpperCase()}</span><span>★ ${item.rating.toFixed(1)}</span></div>`;
    $("#titleModal").scrollTop=currentScroll;
  }

  function openReader(id){
    const item=titleById(id||currentTitleId);if(!item)return;
    currentTitleId=item.id;
    readerPage=Math.max(1,Math.min(8,Number(state.progress[item.id]||1)));
    readerMode="page";
    $$(".reader-mode").forEach(button=>button.classList.toggle("is-active",button.dataset.readerMode===readerMode));
    $("#readerTitle").textContent=item.title;
    renderReaderPage();
    closeModal($("#titleModal"));
    showModal($("#readerModal"));
  }

  function renderReaderPage(){
    const item=titleById(currentTitleId);if(!item)return;
    const backgrounds=["#e0e0d8","#c8cbc4","#e6e4db","#bfc3bb","#e9e6dc","#d3d7d0","#e3e0d7","#c9cec6"];
    const shapes=[
      `<i class="page-shape" style="left:13%;top:36%;width:74%;height:31%;clip-path:polygon(50% 0,100% 100%,0 100%);background:#404641"></i><i class="page-shape" style="left:28%;top:48%;width:45%;height:31%;background:#858b7d;clip-path:polygon(50% 0,100% 100%,0 100%)"></i>`,
      `<i class="page-shape" style="left:22%;top:24%;width:56%;height:40%;border-radius:50%;border:1px solid #555c54;background:#a4aaa0;box-shadow:0 0 0 12px #171a180b"></i><i class="page-shape" style="left:10%;bottom:13%;width:80%;height:3px"></i>`,
      `<i class="page-shape" style="left:15%;top:35%;width:70%;height:35%;transform:rotate(-18deg);border:1px solid #313531;background:#ffffff18"></i><i class="page-shape" style="left:27%;top:29%;width:46%;height:48%;border:1px solid #292d29;background:#ffffff18"></i>`,
      `<i class="page-shape" style="left:10%;top:39%;width:80%;height:30%;clip-path:polygon(0 25%,100% 0,100% 100%,0 75%);background:#555a51"></i>`
    ];
    $("#readerPageArt").className="reader-page-art"+(readerMode==="webtoon"?" webtoon":"");
    $("#readerCanvas").classList.toggle("webtoon-canvas",readerMode==="webtoon");
    $("#readerPageArt").style.background=backgrounds[(readerPage-1)%backgrounds.length];
    $("#readerPageArt").innerHTML=`<div class="page-heading">${escapeHTML(item.title.split(" ").slice(0,readerPage%3+1).join(" "))}<br><span style="font-size:.45em;font-weight:500;letter-spacing:.02em">CHAPTER 01 · PAGE ${String(readerPage).padStart(2,"0")}</span></div>${shapes[(readerPage-1)%shapes.length]}<div class="page-caption">${readerPage%2?"The map changes when no one is looking.":"Somewhere beyond the horizon, a new line appears."}</div><span class="page-number">SORYVYN · SAMPLE ${String(readerPage).padStart(2,"0")}</span>`;
    $("#readerPageLabel").textContent="PAGE "+String(readerPage).padStart(2,"0")+" / 08";
    $("#readerProgressFill").style.width=(readerPage/8*100)+"%";
    $("#readerPrev").disabled=readerPage<=1;
    $("#readerNext").textContent=readerPage>=8?"Finish preview ✓":"Next page →";
    state.progress[item.id]=readerPage;
    persist();renderDiscover();
  }

  function moveReader(direction){
    // RTL changes the intended reading direction in a real page engine; the preview controls still advance predictably.
    const next=readerPage+direction;
    if(next<1){toast("You're at the beginning of this preview.");return;}
    if(next>8){state.progress[currentTitleId]=8;persist();closeModal($("#readerModal"));toast("Preview complete. Your progress was saved locally.");renderDiscover();renderRail();return;}
    readerPage=next;renderReaderPage();
  }

  function toggleSource(id){
    if(!sourceById(id))return;
    if(state.enabledSources.includes(id)){
      state.enabledSources=state.enabledSources.filter(value=>value!==id);
      toast("Sample source disabled.");
    }else{
      state.enabledSources.push(id);
      toast("Sample source enabled.");
    }
    persist();renderSources();renderRail();
  }

  function navigateEmbedded(tab, record=true){
    if(!["discover","trending","new"].includes(tab))return;
    if(record){
      embeddedHistory=embeddedHistory.slice(0,embeddedHistoryIndex+1);
      embeddedHistory.push(tab);
      embeddedHistoryIndex=embeddedHistory.length-1;
    }
    sourceTab=tab;renderSources();
  }

  function renderTheme(){
    document.documentElement.dataset.theme=state.theme;
    $("#themeToggle").setAttribute("aria-label",state.theme==="dark"?"Switch to light theme":"Switch to dark theme");
    $("#themeToggle").title=state.theme==="dark"?"Switch to light theme":"Switch to dark theme";
    $("#themeToggle").innerHTML=state.theme==="dark"?'<svg viewBox="0 0 24 24"><path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>':'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    document.querySelector('meta[name="theme-color"]').content=state.theme==="dark"?"#0b0c0d":"#e9e9e5";
  }

  function toggleTheme(){state.theme=state.theme==="dark"?"light":"dark";persist();renderTheme();}

  // Global interaction delegation keeps actions consistent across card grids and modal content.
  document.addEventListener("click",event=>{
    const routeButton=event.target.closest("[data-route]");
    if(routeButton){event.preventDefault();changeRoute(routeButton.dataset.route);return;}
    const saveButton=event.target.closest("[data-save-title]");
    if(saveButton){event.preventDefault();event.stopPropagation();toggleSaved(saveButton.dataset.saveTitle);return;}
    const favButton=event.target.closest("[data-favorite-title]");
    if(favButton){event.preventDefault();event.stopPropagation();toggleFavorite(favButton.dataset.favoriteTitle);return;}
    const readerButton=event.target.closest("[data-reader-open]");
    if(readerButton){openReader(readerButton.dataset.readerOpen);return;}
    const titleButton=event.target.closest("[data-open-title]");
    if(titleButton){if(event.target.closest("button"))return;openTitle(titleButton.dataset.openTitle);return;}
    const closeButton=event.target.closest("[data-close-modal]");
    if(closeButton){closeModal(closeButton.closest("dialog"));return;}
    const sourceToggle=event.target.closest("[data-toggle-source]");
    if(sourceToggle){toggleSource(sourceToggle.dataset.toggleSource);return;}
  });

  document.addEventListener("keydown",event=>{
    const titleButton=event.target.closest?.("[data-open-title]");
    if(titleButton&&(event.key==="Enter"||event.key===" ")){event.preventDefault();openTitle(titleButton.dataset.openTitle);}
    if(event.key==="Escape"){$$("dialog[open]").forEach(dialog=>closeModal(dialog));}
    const target=event.target;
    const isTyping=target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target instanceof HTMLSelectElement||target.isContentEditable;
    if(event.key==="/"&&!isTyping){event.preventDefault();$("#globalSearch").focus();}
    if((event.metaKey||event.ctrlKey)&&/^[1-7]$/.test(event.key)){
      event.preventDefault();const routes=["discover","library","updates","downloads","sources","history","favorites"];changeRoute(routes[Number(event.key)-1]);
    }
  });

  $$(".category-chip").forEach(button=>button.addEventListener("click",()=>{
    state.category=button.dataset.category;
    if(state.category!=="All")$("#filterCategory").value=state.category;
    renderDiscover();
  }));
  $("#globalSearch").addEventListener("input",event=>{titleQuery=event.target.value;renderDiscover();});
  $("#sortSelect").addEventListener("change",renderDiscover);
  $("#filterButton").addEventListener("click",()=>showModal($("#filterModal")));
  $("#dismissNotice").addEventListener("click",()=>{$("#dismissNotice").closest(".demo-notice").remove();state.noticeDismissed=true;persist();});
  $("#applyFilters").addEventListener("click",()=>{
    state.category=$("#filterCategory").value;
    state.genre=$("#filterGenre").value;
    state.status=$("#filterStatus").value;
    closeModal($("#filterModal"));renderDiscover();toast("Discovery filters applied.");
  });
  $("#resetFilters").addEventListener("click",()=>{
    state.category="All";state.genre="all";state.status="all";titleQuery="";$("#globalSearch").value="";$("#filterCategory").value="All";$("#filterGenre").value="all";$("#filterStatus").value="all";renderDiscover();toast("Filters reset.");
  });
  $("#librarySearch").addEventListener("input",event=>{libraryQuery=event.target.value;renderLibrary();});
  $$(".view-toggle").forEach(button=>button.addEventListener("click",()=>{
    gridView=button.dataset.view;
    $$(".view-toggle").forEach(btn=>btn.classList.toggle("is-selected",btn===button));
    renderDiscover();renderLibrary();renderHistory();renderFavorites();
  }));
  $("#themeToggle").addEventListener("click",toggleTheme);
  $("#railCollapse").addEventListener("click",()=>{
    $("#app").classList.toggle("rail-collapsed");
    toast($("#app").classList.contains("rail-collapsed")?"Reading desk collapsed.":"Reading desk restored.");
  });
  $("#sourceWindowRefresh").addEventListener("click",()=>{renderMiniSources();toast("Sample source panel refreshed.");});
  $("#sourceSearch").addEventListener("input",event=>{sourceQuery=event.target.value;renderSources();});
  $("#sourceLanguage").addEventListener("change",event=>{sourceLanguage=event.target.value;renderSources();});
  $$(".embedded-tab").forEach(button=>button.addEventListener("click",()=>navigateEmbedded(button.dataset.sourceTab)));
  $("#embeddedBack").addEventListener("click",()=>{
    if(embeddedHistoryIndex>0){embeddedHistoryIndex--;navigateEmbedded(embeddedHistory[embeddedHistoryIndex],false);}
    else toast("You're at the start of the source preview.");
  });
  $("#embeddedForward").addEventListener("click",()=>{
    if(embeddedHistoryIndex<embeddedHistory.length-1){embeddedHistoryIndex++;navigateEmbedded(embeddedHistory[embeddedHistoryIndex],false);}
    else toast("No further source preview page.");
  });
  $("#embeddedReload").addEventListener("click",()=>{renderSources();toast("Demo catalogue refreshed.");});
  $("#embeddedHome").addEventListener("click",()=>navigateEmbedded("discover"));
  $("#profileButton").addEventListener("click",()=>toast("Local demo profile. Account sync is not part of Chunk 01."));
  $("#profileTop").addEventListener("click",()=>toast("SORYVYN preview · local browser storage only."));
  $("#roadmapLink").addEventListener("click",event=>{event.preventDefault();showModal($("#roadmapModal"));});
  $("#readerPrev").addEventListener("click",()=>moveReader(-1));
  $("#readerNext").addEventListener("click",()=>moveReader(1));
  $$(".reader-mode").forEach(button=>button.addEventListener("click",()=>{
    readerMode=button.dataset.readerMode;
    $$(".reader-mode").forEach(btn=>btn.classList.toggle("is-active",btn===button));
    renderReaderPage();
    if(readerMode==="rtl")toast("Right-to-left navigation enabled for this preview.");
    if(readerMode==="webtoon")toast("Vertical reader layout enabled for this preview.");
  }));
  $("#readerCanvas").addEventListener("click",event=>{
    if(event.target.closest("button"))return;
    if(readerMode==="webtoon")return;
    const bounds=event.currentTarget.getBoundingClientRect();
    moveReader(event.clientX<bounds.left+bounds.width/2?-1:1);
  });

  window.addEventListener("online",()=>{$("#connectionLabel").textContent="LOCAL PREVIEW";toast("Connection restored. Demo data remains local.");});
  window.addEventListener("offline",()=>{$("#connectionLabel").textContent="OFFLINE MODE";toast("Offline mode. Cached app shell remains available.");});
  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();installPrompt=event;$("#installButton").hidden=false;
  });
  $("#installButton").addEventListener("click",async()=>{
    if(!installPrompt){toast("Use your browser menu to install this app when PWA install is available.");return;}
    installPrompt.prompt();
    await installPrompt.userChoice.catch(()=>null);
    installPrompt=null;$("#installButton").hidden=true;
  });
  window.addEventListener("appinstalled",()=>{installPrompt=null;$("#installButton").hidden=true;toast("SORYVYN installed.");});

  // Initial application state.
  $("#footerYear").textContent=new Date().getFullYear();
  $("#demoNoticeDismissed");
  if(state.noticeDismissed)$("#dismissNotice").closest(".demo-notice").remove();
  renderTheme();renderCounters();renderMiniSources();renderDiscover();renderRail();renderSources();
  const initialRoute=location.hash.replace("#","").trim();
  if(initialRoute)changeRoute(initialRoute);
  if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost")){
    navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(()=>{}).catch(()=>{});
  }
})();