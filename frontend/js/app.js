
let CACHE = [];

auth.onAuthStateChanged(u=>{
  if(!u) location.href='../login.html';
  else init();
});

async function init(){
  await loadEntries();
  render();
}

async function loadEntries(){
  const snap = await db.collection("entries").orderBy("createdAt","desc").limit(500).get();
  CACHE = snap.docs.map(d=>({id:d.id,...d.data()}));
}

function render(){
  const stats = computeStats(CACHE);
  document.getElementById("stats").innerHTML = stats.map(s=>
    `<div>${s.userId} | ${s.total} entries | ${s.successRate}%</div>`
  ).join("");
}

async function addEntry(){
  const user = auth.currentUser;
  await db.collection("entries").add({
    clientName: client.value,
    position: role.value,
    status: status.value,
    userId: user.uid,
    createdAt: new Date()
  });
  await loadEntries();
  render();
}

function logout(){ auth.signOut(); }
