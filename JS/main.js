const baseUrl = "http://localhost:5000/api";

const dialog = document.getElementById("dialog");
const createButton = document.getElementById("createButton");
const closeButton = document.getElementById("closeBtn");
const tasksContainer = document.getElementById("tasksContainer");

async function handleSubmit(event) {
  event.preventDefault();
  const data = {};
  for (const [key, value] of new FormData(
    document.getElementById("form")
  ).entries()) {
    data[key] = value;
  }
  try {
    const res = await (
      await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    ).json();

    if (res?.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "login.html";
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const data = {};
  for (const [key, value] of new FormData(
    document.getElementById("form")
  ).entries()) {
    data[key] = value;
  }
  try {
    const res = await (
      await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    ).json();

    if (res.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

async function createTask(event) {
  event.preventDefault();
  const data = {};
  for (const [key, value] of new FormData(
    document.getElementById("form")
  ).entries()) {
    data[key] = value;
  }
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await (
      await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
    ).json();
    console.log("res: ", res);
  } catch (error) {
    console.log("error: ", error);
  }
}

if (createButton) {
  createButton.addEventListener("click", () => {
    dialog.showModal();
  });
}

if (closeButton) {
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    dialog.close();
  });
}

async function displayTasks() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await (
      await fetch(`${baseUrl}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();
    if (res?.length) {
      tasksContainer.innerHTML = `
            ${res
              .map(
                ({ _id, deadline, description, priority, title }) => `
                  <div class="task" data-id="${_id}">
                   <div class="details">
                      <p><strong>Deadline:</strong> ${new Date(
                        deadline
                      ).toDateString()}</p>
                      <p><strong>Description:</strong> ${description}</p>
                      <p><strong>Priority:</strong> ${priority}</p>
                      <p><strong>Title:</strong> ${title}</p>
                      <p class="hidden">${_id}</p>
                    </div>
                   <div class="actions">
                      <p class="editBtn">Edit</p>
                      <p class="deleteBtn">Delete</p>
                   </div>
                  </div>
                `
              )
              .join("")}
          `;
    }
    return res;
  } catch (error) {
    console.log("error: ", error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const res = await displayTasks();

  // search
  document.getElementById("search").addEventListener("input", (event) => {
    let searchTerm = event.target.value;
    console.log("searchTerm: ", searchTerm);
    const filteredTasks = filterTasks(searchTerm, res);
    tasksContainer.innerHTML = `
            ${filteredTasks
              .map(
                ({ _id, deadline, description, priority, title }) => `
                  <div class="task" data-id="${_id}">
                   <div class="details">
                      <p><strong>Deadline:</strong> ${new Date(
                        deadline
                      ).toDateString()}</p>
                      <p><strong>Description:</strong> ${description}</p>
                      <p><strong>Priority:</strong> ${priority}</p>
                      <p><strong>Title:</strong> ${title}</p>
                      <p class="hidden">${_id}</p>
                    </div>
                   <div class="actions">
                      <p class="editBtn">Edit</p>
                      <p class="deleteBtn">Delete</p>
                   </div>
                  </div>
                `
              )
              .join("")}
          `;
  });
});

const filterTasks = (searchTerm, tasks) =>
  tasks?.filter(({ description, title, priority }) => {
    let rgx = new RegExp(`^${searchTerm}`, "ig");
    return description.match(rgx) || title.match(rgx) || priority.match(rgx);
  });

// get started button on landing page
document.getElementById("startBtn").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "dashboard.html";
  } else {
    window.location.href = "login.html";
  }
});

// const handleTaskAction = async (event) => {
//   console.log("handling...");
//   const targetButton = event.target;
//   const token = localStorage.getItem("token");

//   if (
//     (!targetButton.classList.contains("editBtn") &&
//       !targetButton.classList.contains("deleteBtn")) ||
//     !token
//   )
//     return;

//   const taskElement = targetButton.closest(".task");
//   const taskId = taskElement.dataset.id;

//   if (targetButton.classList.contains("deleteBtn")) {
//     // Handle delete action
//     console.log("deleting....");
//     // try {
//     //   const res = await fetch(`${baseUrl}/tasks/${taskId}`, {
//     //     method: "DELETE",
//     //     headers: {
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //   });
//     //   if (res.ok) {
//     //     console.log("Task deleted successfully");
//     //     taskElement.remove(); // Remove the task from the DOM
//     //   } else {
//     //     console.error("Failed to delete task");
//     //   }
//     // } catch (error) {
//     //   console.error("Error deleting task:", error);
//     // }
//   } else if (targetButton.classList.contains("editBtn")) {
//     // Handle edit action
//     console.log("editing....");

//     const token = localStorage.getItem("token");
//     if (!token) return;

//     // Example: Fetch current task data and open a form to edit
//     try {
//       const res = await fetch(`${baseUrl}/tasks/${taskId}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // if (res.ok) {
//       //   const taskData = await res.json();
//       //   console.log("Task data for editing:", taskData);

//       //   // Example: Pre-fill an edit form
//       //   document.getElementById("editFormTitle").value = taskData.title;
//       //   document.getElementById("editFormDescription").value = taskData.description;
//       //   document.getElementById("editFormDeadline").value = new Date(taskData.deadline).toISOString().slice(0, 16); // For input[type="datetime-local"]
//       //   document.getElementById("editFormPriority").value = taskData.priority;
//       //   document.getElementById("editFormId").value = taskId; // Store task ID for updating later

//       //   // Show the edit form
//       //   document.getElementById("editFormContainer").classList.remove("hidden");
//       // } else {
//       //   console.error("Failed to fetch task data for editing");
//       // }
//     } catch (error) {
//       console.error("Error fetching task data:", error);
//     }
//   }
// };
tasksContainer.addEventListener("click", handleTaskAction);
