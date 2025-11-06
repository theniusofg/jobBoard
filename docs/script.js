// Configuration
const DATA_URL = "sheets_data.json";
let modal = null;
let allJobs = []; // Store jobs globally

// Initialize when page loads
window.addEventListener("DOMContentLoaded", init);

function init() {
  modal = new bootstrap.Modal(document.getElementById("jobModal"));
  loadJobs();
}

// Fetch and display jobs
async function loadJobs() {
  try {
    const jobs = await fetchJobsFromSheet();
    const activeJobs = filterActiveJobs(jobs);
    allJobs = activeJobs; // Store for later use
    displayJobs(activeJobs);
  } catch (err) {
    console.error("Error loading jobs:", err);
    showError();
  }
}

// Convert Google Sheets data to job objects
async function fetchJobsFromSheet() {
  const response = await fetch(DATA_URL);
  const data = await response.json();
  
  // Skip header row and map to objects
  const [headers, ...rows] = data;
  
  return rows.map(row => ({
    id: row[0],
    title: row[1],
    short_desc: row[2],
    long_desc: row[3],
    close_date: row[4],
    contact_email: row[5]
  }));
}

// Filter out jobs past their close date
function filterActiveJobs(jobs) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return jobs.filter(job => {
    const closeDate = new Date(job.close_date);
    return closeDate >= today;
  });
}

// Render jobs to the page
function displayJobs(jobs) {
  const container = document.getElementById("jobs-container");
  
  if (jobs.length === 0) {
    container.innerHTML = "<p class='text-muted'>No active listings.</p>";
    return;
  }
  
  container.innerHTML = jobs.map((job, index) => createJobCard(job, index)).join("");
  attachCardListeners();
}

// Create HTML for a single job card
function createJobCard(job, index) {
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${escapeHtml(job.title)}</h5>
          <p class="card-text flex-grow-1">${escapeHtml(job.short_desc)}</p>
          <p class="text-muted mb-2"><small>Close: ${job.close_date}</small></p>
          <button class="btn btn-outline-primary mt-auto" 
                  data-job-index="${index}">
            Details
          </button>
        </div>
      </div>
    </div>
  `;
}

// Add click handlers to all job cards
function attachCardListeners() {
  document.querySelectorAll('button[data-job-index]').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = parseInt(e.currentTarget.getAttribute('data-job-index'));
      const job = allJobs[index];
      openModal(job);
    });
  });
}

// Show job details in modal
function openModal(job) {
  document.getElementById("jobModalLabel").textContent = job.title;
  document.getElementById("modalBody").innerHTML = `
    <p>${escapeHtml(job.long_desc)}</p>
    <p class="text-muted"><small>Close date: ${job.close_date}</small></p>
  `;
  
  document.getElementById("applyBtn").href = createMailtoLink(job);
  modal.show();
}

// Generate mailto link for application
function createMailtoLink(job) {
  const subject = `Application for ${job.title}`;
  const body = `Job Number: ${job.id}\nJob Title: ${job.title}\n\nIMPORTANT: To ensure a response you must ATTACH YOUR RESUME to this email.`;
  
  return `mailto:${job.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show error message
function showError() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "<p class='text-danger'>Unable to load job listings. Please try again later.</p>";
}