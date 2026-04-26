let CACHE = [];
let currentUser = null;
let userRole = 'recruiter';

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUser = user;
    await ensureUserProfile(user);
    init();
  }
});

async function ensureUserProfile(user) {
  const userDoc = await db.collection("users").doc(user.uid).get();
  
  if (!userDoc.exists) {
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      role: 'recruiter',
      createdAt: new Date()
    });
    userRole = 'recruiter';
  } else {
    userRole = userDoc.data().role || 'recruiter';
  }
}

async function init() {
  document.getElementById('userEmail').textContent = currentUser.email;
  document.getElementById('userRole').textContent = userRole;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  
  await loadEntries();
  renderStats();
}

async function loadEntries() {
  showLoading(true);
  try {
    const snapshot = await db.collection("entries")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    CACHE = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Error loading entries:", e);
    showError("Failed to load entries");
  }
  showLoading(false);
}

async function addEntry() {
  const client = document.getElementById("client").value.trim();
  const role = document.getElementById("role").value.trim();
  const status = document.getElementById("status").value;

  if (!client || !role) {
    alert("Please fill all fields");
    return;
  }

  showLoading(true);
  try {
    await db.collection("entries").add({
      clientName: client,
      position: role,
      status: status,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      createdAt: new Date()
    });

    document.getElementById("client").value = "";
    document.getElementById("role").value = "";
    
    await loadEntries();
    renderStats();
  } catch (e) {
    console.error("Error adding entry:", e);
    showError("Failed to add entry");
  }
  showLoading(false);
}

function renderStats() {
  if (CACHE.length === 0) {
    document.getElementById("stats").innerHTML = "<p>No entries yet</p>";
    return;
  }

  const userStats = {};
  let totalEntries = 0;
  let totalSuccess = 0;

  CACHE.forEach(e => {
    if (!userStats[e.userId]) {
      userStats[e.userId] = { 
        email: e.userEmail || e.userId, 
        total: 0, 
        success: 0 
      };
    }

    userStats[e.userId].total++;
    totalEntries++;

    if (e.status === "Selected" || e.status === "Joined") {
      userStats[e.userId].success++;
      totalSuccess++;
    }
  });

  const overallRate = totalEntries > 0 ? Math.round((totalSuccess / totalEntries) * 100) : 0;

  let html = `
    <div class="stat-card">
      <h4>Overall Stats</h4>
      <p>Total Entries: ${totalEntries}</p>
      <p>Success Rate: ${overallRate}%</p>
    </div>
  `;

  const sortedUsers = Object.entries(userStats).sort((a, b) => b[1].total - a[1].total);
  
  sortedUsers.forEach(([userId, data]) => {
    const rate = Math.round((data.success / data.total) * 100 || 0);
    html += `
      <div class="stat-card">
        <p><strong>${data.email}</strong></p>
        <p>Entries: ${data.total} | Success: ${rate}%</p>
      </div>
    `;
  });

  document.getElementById("stats").innerHTML = html;
}

function logout() {
  auth.signOut();
}

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(msg) {
  document.getElementById('error').textContent = msg;
  document.getElementById('error').style.display = 'block';
  setTimeout(() => {
    document.getElementById('error').style.display = 'none';
  }, 3000);
}