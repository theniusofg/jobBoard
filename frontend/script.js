const API_URL = "http://127.0.0.1:5000/api/jobs";
let modal = null;

window.addEventListener("DOMContentLoaded", () => {
  // initialise Bootstrap modal once
  const modalEl = document.getElementById("jobModal");
  modal = new bootstrap.Modal(modalEl);
  loadJobs();
});

async function loadJobs() {
  try {
    const resp = await fetch(API_URL);
    const jobs = await resp.json();

    const container = document.getElementById("jobs-container");
    container.innerHTML = "";

    if (jobs.length === 0) {
      container.innerHTML = "<p class='text-muted'>No active listings.</p>";
      return;
    }

    jobs.forEach(job => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text flex-grow-1 text-truncate">${job.short_desc}</p>
            <p class="text-muted mb-2"><small>Close: ${job.close_date}</small></p>
            <button class="btn btn-outline-primary mt-auto"
                    data-job='${JSON.stringify(job)}'>Details</button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    // attach click handler to each Details button
    document.querySelectorAll('button[data-job]').forEach(btn => {
      btn.addEventListener('click', e => {
        const job = JSON.parse(e.currentTarget.getAttribute('data-job'));
        openModal(job);
      });
    });
  } catch (err) {
    console.error("Error loading jobs:", err);
  }
}

/* Populate and show the modal */
function openModal(job) {
  document.getElementById("jobModalLabel").textContent = job.title;
  document.getElementById("modalBody").innerHTML = `
    <p>${job.long_desc}</p>
    <p class="text-muted"><small>Close date: ${job.close_date}</small></p>
  `;

  const mailtoBody = `
Job Number:${job.id}
Job Title:${job.title}

IMPORTANT: To ensure a response you must ATTACH YOUR RESUME to this email.
`;

  const mailto = `mailto:${job.contact_email}?subject=${encodeURIComponent('Application for ' + job.title)}&body=${encodeURIComponent(mailtoBody)}`;
  
  document.getElementById("applyBtn").setAttribute("href", mailto);

  modal.show();
}
