const form = document.getElementById('journalForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const entriesContainer = document.getElementById('entries');
const searchInput = document.getElementById('searchInput');
const journalContainer = document.getElementById('journalContainer');
const loginContainer = document.getElementById('loginContainer');

let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
const PIN = "1234"; // Set your access PIN here

// Save entries to localStorage
function saveEntries() {
  localStorage.setItem('journalEntries', JSON.stringify(entries));
}

// Show entries on screen
function renderEntries(filtered = null) {
  entriesContainer.innerHTML = '';
  const list = filtered || entries;

  list.forEach((entry, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry';
    entryDiv.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.content}</p>
      <small>${entry.date}</small>
      <div class="entry-actions">
        <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;
    entriesContainer.appendChild(entryDiv);
  });
}

// Delete entry
function deleteEntry(index) {
  if (confirm("Are you sure you want to delete this entry?")) {
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
  }
}

// Edit entry
function editEntry(index) {
  const entry = entries[index];
  titleInput.value = entry.title;
  contentInput.value = entry.content;
  entries.splice(index, 1); // remove old version
  saveEntries();
  renderEntries();
}

// Add new entry
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newEntry = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    date: new Date().toLocaleString("en-GB", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'

    })
  };
  if (!newEntry.title || !newEntry.content) return;

  entries.unshift(newEntry); // add to start of list
  saveEntries();
  renderEntries();
  form.reset();
});

// Search function
function searchEntries() {
  const term = searchInput.value.toLowerCase();
  const filtered = entries.filter(entry =>
    entry.title.toLowerCase().includes(term) ||
    entry.content.toLowerCase().includes(term)
  );
  renderEntries(filtered);
}

// Export entries to .txt
function exportEntries() {
  if (entries.length === 0) return alert("No entries to export.");
  const text = entries.map(e =>
    `Title: ${e.title}\nDate: ${e.date}\n\n${e.content}\n\n---\n`
  ).join("");
  
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "My_Journal.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Login function
function login() {
  const input = document.getElementById('pinInput').value;
  if (input === PIN) {
    loginContainer.classList.add('hidden');
    journalContainer.classList.remove('hidden');
    renderEntries();
  } else {
    alert("Incorrect PIN. Try again.");
  }
}
