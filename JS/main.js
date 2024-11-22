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
                ({ deadline, description, priority, title }) => `
                  <div class="task">
                   <div class="details">
                      <p><strong>Deadline:</strong> ${new Date(
                        deadline
                      ).toDateString()}</p>
                      <p><strong>Description:</strong> ${description}</p>
                      <p><strong>Priority:</strong> ${priority}</p>
                      <p><strong>Title:</strong> ${title}</p>
                    </div>
                   <div class="actions">
                      <p>Edit</p>
                      <p>Delete</p>
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

displayTasks();

document.getElementById("startBtn").addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "login.html";
});
