
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let editId = null;

const form = document.getElementById("jobForm");

function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function displayJobs() {
    const list = document.getElementById("jobList");
    list.innerHTML = "";

    const search = document.getElementById("search").value.toLowerCase();

    jobs.filter(job =>
        job.company.toLowerCase().includes(search) ||
        job.position.toLowerCase().includes(search)
    ).forEach(job => {

        const row = document.createElement("tr");

        [job.company, job.position, job.date, job.status]
            .forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.onclick = () => editJob(job.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => deleteJob(job.id);

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        list.appendChild(row);
    });

    document.getElementById("totalJobs").textContent = jobs.length;

    document.getElementById("totalInterviews").textContent =
        jobs.filter(j => j.status === "Interview").length;

    document.getElementById("totalSelected").textContent =
        jobs.filter(j => j.status === "Selected").length;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const company = document.getElementById("company").value.trim();
    const position = document.getElementById("position").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;

    if (!company || !position || !date) {
        alert("Please fill all details!");
        return;
    }

    if (editId !== null) {
        const job = jobs.find(j => j.id === editId);
        job.company = company;
        job.position = position;
        job.date = date;
        job.status = status;
        editId = null;
        document.getElementById("submitBtn").textContent = "Add Job";
    } else {
        jobs.push({
            id: Date.now(),
            company,
            position,
            date,
            status
        });
    }

    saveJobs();
    displayJobs();
    form.reset();

    alert("Job saved successfully!");
});

function editJob(id) {
    const job = jobs.find(j => j.id === id);

    document.getElementById("company").value = job.company;
    document.getElementById("position").value = job.position;
    document.getElementById("date").value = job.date;
    document.getElementById("status").value = job.status;

    editId = id;
    document.getElementById("submitBtn").textContent = "Update Job";
}

function deleteJob(id) {
    if (confirm("Are you sure you want to delete this job?")) {
        jobs = jobs.filter(job => job.id !== id);
        saveJobs();
        displayJobs();
    }
}

document.getElementById("search").addEventListener("input", displayJobs);

displayJobs();
