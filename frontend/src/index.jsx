import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const API_URL = "http://127.0.0.1:8000/api";

const demoColumns = [
  {
    id: "backlog",
    title: "Backlog",
    color: "gray",
    tasks: [
      {
        id: "demo-1",
        title: "Design onboarding experience",
        description: "Create a simple and delightful first-time user journey.",
        priority: "High",
        tag: "Design",
        assignee: "AR",
        due: "Jul 28",
      },
      {
        id: "demo-2",
        title: "Define product roadmap",
        description: "Align the next quarter goals and milestones.",
        priority: "Medium",
        tag: "Planning",
        assignee: "SK",
        due: "Aug 02",
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "blue",
    tasks: [
      {
        id: "demo-3",
        title: "Create analytics dashboard",
        description: "Build a clean overview of key product metrics.",
        priority: "High",
        tag: "Development",
        assignee: "MR",
        due: "Jul 26",
      },
      {
        id: "demo-4",
        title: "Prepare user research",
        description: "Finalize questions for upcoming user interviews.",
        priority: "Low",
        tag: "Research",
        assignee: "AR",
        due: "Jul 30",
      },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    color: "purple",
    tasks: [
      {
        id: "demo-5",
        title: "Build authentication flow",
        description: "Implement secure login and registration experience.",
        priority: "High",
        tag: "Development",
        assignee: "SK",
        due: "Today",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "orange",
    tasks: [],
  },
  {
    id: "done",
    title: "Done",
    color: "green",
    tasks: [
      {
        id: "demo-8",
        title: "Project kickoff",
        description: "Successfully aligned the team on project goals.",
        priority: "Low",
        tag: "Planning",
        assignee: "SK",
        due: "Jul 20",
      },
    ],
  },
];

const priorityOrder = {
  High: 1,
  Medium: 2,
  Low: 3,
};

function convertBackendBoard(board) {
  const colors = ["gray", "blue", "purple", "orange", "green"];

  return (board.lists || []).map((list, index) => ({
    id: list.id,
    title: list.name,
    color: colors[index % colors.length],
    tasks: (list.cards || []).map((card) => ({
      id: card.id,
      backendId: card.id,
      title: card.title,
      description: card.description || "No description added.",
      priority: card.priority || "Medium",
      tag: card.tag || "Development",
      assignee: card.assignee || "YOU",
      due: card.due_date || "No date",
      listId: list.id,
    })),
  }));
}

function App() {
  const [columns, setColumns] = useState(demoColumns);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("My Workspace");
  const [activeView, setActiveView] = useState("board");

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Default");

  const [toast, setToast] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    tag: "Development",
    due: "",
    columnId: "todo",
  });

  useEffect(() => {
    loadBackendData();
  }, []);

  async function loadBackendData() {
    try {
      const response = await fetch(`${API_URL}/boards`);

      if (!response.ok) {
        throw new Error("Backend unavailable");
      }

      const boards = await response.json();

      if (boards.length > 0 && boards[0].lists?.length > 0) {
        setColumns(convertBackendBoard(boards[0]));
        setBackendConnected(true);
        showToast("Backend connected successfully");
      } else {
        setBackendConnected(true);
        showToast("Backend connected — no data found");
      }
    } catch (error) {
      console.error(error);
      setBackendConnected(false);
      showToast("Backend offline — using local demo data");
    } finally {
      setLoading(false);
    }
  }

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  const allTasks = columns.flatMap((column) => column.tasks);

  const totalTasks = allTasks.length;

  const completedTasks =
    columns.find((column) => column.id === "done")?.tasks.length || 0;

  const inProgressTasks =
    columns.find((column) => column.id === "progress")?.tasks.length || 0;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const filteredColumns = useMemo(() => {
    const query = search.toLowerCase().trim();

    return columns.map((column) => {
      let tasks = [...column.tasks];

      if (query) {
        tasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.tag.toLowerCase().includes(query)
        );
      }

      if (priorityFilter !== "All") {
        tasks = tasks.filter(
          (task) => task.priority === priorityFilter
        );
      }

      if (sortBy === "Priority") {
        tasks.sort(
          (a, b) =>
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
        );
      }

      if (sortBy === "Title") {
        tasks.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      }

      return {
        ...column,
        tasks,
      };
    });
  }, [columns, search, priorityFilter, sortBy]);

  function openCreateModal(columnId = "todo") {
    setEditingTask(null);

    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      tag: "Development",
      due: "",
      columnId,
    });

    setShowModal(true);
  }

  function openEditModal(task, columnId) {
    setEditingTask({
      ...task,
      columnId,
    });

    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      tag: task.tag,
      due: task.due === "No date" ? "" : task.due,
      columnId,
    });

    setShowModal(true);
  }

  async function saveTask(e) {
    e.preventDefault();

    if (!newTask.title.trim()) {
      showToast("Please enter a task title");
      return;
    }

    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        title: newTask.title,
        description:
          newTask.description || "No description added.",
        priority: newTask.priority,
        tag: newTask.tag,
        due: newTask.due || "No date",
      };

      if (backendConnected && editingTask.backendId) {
        try {
          await fetch(
            `${API_URL}/cards/${editingTask.backendId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                title: updatedTask.title,
                description: updatedTask.description,
                priority: updatedTask.priority,
                tag: updatedTask.tag,
                due_date: updatedTask.due,
              }),
            }
          );
        } catch (error) {
          console.error(error);
        }
      }

      setColumns((currentColumns) =>
        currentColumns.map((column) => ({
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === editingTask.id
              ? updatedTask
              : task
          ),
        }))
      );

      showToast("Task updated successfully");
    } else {
      const task = {
        id: `local-${Date.now()}`,
        title: newTask.title,
        description:
          newTask.description || "No description added.",
        priority: newTask.priority,
        tag: newTask.tag,
        assignee: "YOU",
        due: newTask.due || "No date",
      };

      setColumns((currentColumns) =>
        currentColumns.map((column) =>
          column.id === newTask.columnId
            ? {
                ...column,
                tasks: [task, ...column.tasks],
              }
            : column
        )
      );

      if (backendConnected) {
        showToast("Task created in workspace");
      } else {
        showToast("Task created locally");
      }
    }

    setShowModal(false);
    setEditingTask(null);
  }

  async function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    const task = allTasks.find((item) => item.id === taskId);

    if (backendConnected && task?.backendId) {
      try {
        await fetch(`${API_URL}/cards/${task.backendId}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    setColumns((currentColumns) =>
      currentColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter(
          (item) => item.id !== taskId
        ),
      }))
    );

    setShowDetails(false);
    setSelectedTask(null);

    showToast("Task deleted");
  }

  function handleDrop(targetColumnId) {
    if (!draggedTask) return;

    const { task, sourceColumnId } = draggedTask;

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns((currentColumns) => {
      const removedTask = currentColumns.map((column) =>
        column.id === sourceColumnId
          ? {
              ...column,
              tasks: column.tasks.filter(
                (item) => item.id !== task.id
              ),
            }
          : column
      );

      return removedTask.map((column) =>
        column.id === targetColumnId
          ? {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  ...task,
                  listId: targetColumnId,
                },
              ],
            }
          : column
      );
    });

    setDraggedTask(null);

    showToast("Task moved successfully");
  }

  function openTaskDetails(task, columnId) {
    setSelectedTask({
      ...task,
      columnId,
    });

    setShowDetails(true);
  }

  function resetFilters() {
    setSearch("");
    setPriorityFilter("All");
    setSortBy("Default");
  }

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">F</div>
          <span>ForgePilot</span>
        </div>

        <div className="workspace-selector">
          <div className="workspace-icon">FP</div>

          <div>
            <strong>ForgePilot</strong>
            <span>Personal workspace</span>
          </div>

          <span className="chevron">⌄</span>
        </div>

        <div className="connection-status">
          <span
            className={
              backendConnected
                ? "status-online"
                : "status-offline"
            }
          />

          {loading
            ? "Connecting..."
            : backendConnected
            ? "Backend connected"
            : "Offline mode"}
        </div>

        <div className="nav-section">

          <p className="nav-label">WORKSPACE</p>

          {[
            ["⌂", "My Workspace"],
            ["▦", "All Projects"],
            ["✓", "My Tasks"],
            ["⚙", "Settings"],
          ].map(([icon, label]) => (
            <button
              key={label}
              className={`nav-item ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => {
                setActiveNav(label);
                showToast(`${label} selected`);
              }}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}

        </div>

        <div className="nav-section projects">

          <div className="projects-heading">
            <p className="nav-label">PROJECTS</p>

            <button
              onClick={() =>
                showToast("Project creation coming soon")
              }
            >
              +
            </button>
          </div>

          <button className="project-item active-project">
            <span className="project-dot purple-dot" />
            Product Launch
          </button>

          <button
            className="project-item"
            onClick={() =>
              showToast("Mobile App project selected")
            }
          >
            <span className="project-dot blue-dot" />
            Mobile App
          </button>

          <button
            className="project-item"
            onClick={() =>
              showToast(
                "Website Redesign project selected"
              )
            }
          >
            <span className="project-dot orange-dot" />
            Website Redesign
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>

            <strong>Unlock more with Pro</strong>

            <p>
              Get unlimited projects and advanced tools.
            </p>

            <button
              onClick={() =>
                showToast("Upgrade flow coming soon")
              }
            >
              Upgrade plan
            </button>
          </div>

          <div className="user-profile">

            <div className="avatar avatar-purple">
              RR
            </div>

            <div>
              <strong>Rishika Rajora</strong>
              <span>rishika@example.com</span>
            </div>

            <span className="more">•••</span>

          </div>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div className="breadcrumbs">
            <span>Projects</span>
            <b>/</b>
            <strong>Product Launch</strong>
          </div>

          <div className="top-actions">

            <div className="search-box">

              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search tasks..."
              />

              <kbd>⌘ K</kbd>

            </div>

            <button
              className="icon-button"
              onClick={() =>
                showToast("ForgePilot Help Center")
              }
            >
              ?
            </button>

            <button
              className="icon-button notification"
              onClick={() =>
                showToast(
                  backendConnected
                    ? "No new notifications"
                    : "Backend is offline"
                )
              }
            >
              ♧
              <i />
            </button>

            <div className="avatar avatar-purple">
              RR
            </div>

          </div>

        </header>

        <section className="page-header">

          <div>

            <div className="title-row">

              <h1>Product Launch</h1>

              <span className="private-badge">
                Private
              </span>

            </div>

            <p>
              Plan, build, and launch something people love.
            </p>

          </div>

          <div className="header-actions">

            <button
              className="secondary-button"
              onClick={() =>
                showToast(
                  "More project options coming soon"
                )
              }
            >
              ⋯
            </button>

            <button
              className="primary-button"
              onClick={() =>
                openCreateModal("todo")
              }
            >
              <span>+</span>
              Add task
            </button>

          </div>

        </section>

        <section className="stats-row">

          <div className="stat-card">

            <div className="stat-icon purple-bg">
              ◈
            </div>

            <div>
              <span>Total tasks</span>
              <strong>{totalTasks}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue-bg">
              ◷
            </div>

            <div>
              <span>In progress</span>
              <strong>{inProgressTasks}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green-bg">
              ✓
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedTasks}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange-bg">
              ⚡
            </div>

            <div>
              <span>Completion</span>
              <strong>
                {completionPercentage}%
              </strong>
            </div>

          </div>

        </section>

        <div className="board-toolbar">

          <div className="view-tabs">

            <button
              className={`view-tab ${
                activeView === "board"
                  ? "active-tab"
                  : ""
              }`}
              onClick={() =>
                setActiveView("board")
              }
            >
              ▦ Board
            </button>

            <button
              className={`view-tab ${
                activeView === "list"
                  ? "active-tab"
                  : ""
              }`}
              onClick={() =>
                setActiveView("list")
              }
            >
              ☷ List
            </button>

          </div>

          <div className="toolbar-actions">

            <select
              className="filter-button"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="All">
                All priorities
              </option>
              <option value="High">
                High priority
              </option>
              <option value="Medium">
                Medium priority
              </option>
              <option value="Low">
                Low priority
              </option>
            </select>

            <select
              className="filter-button"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="Default">
                Sort
              </option>
              <option value="Priority">
                By priority
              </option>
              <option value="Title">
                By title
              </option>
            </select>

            <button
              className="filter-button"
              onClick={resetFilters}
            >
              Reset
            </button>

          </div>

        </div>

        {activeView === "board" ? (

          <section className="kanban-board">

            {filteredColumns.map((column) => (

              <div
                className="kanban-column"
                key={column.id}
                onDragOver={(e) =>
                  e.preventDefault()
                }
                onDrop={() =>
                  handleDrop(column.id)
                }
              >

                <div className="column-header">

                  <div className="column-title">

                    <span
                      className={`status-dot ${column.color}`}
                    />

                    <strong>
                      {column.title}
                    </strong>

                    <span className="task-count">
                      {column.tasks.length}
                    </span>

                  </div>

                  <button
                    className="column-menu"
                    onClick={() =>
                      showToast(
                        `${column.title} column options`
                      )
                    }
                  >
                    •••
                  </button>

                </div>

                <div className="task-list">

                  {column.tasks.map((task) => (

                    <article
                      className="task-card"
                      key={task.id}
                      draggable
                      onDragStart={() =>
                        setDraggedTask({
                          task,
                          sourceColumnId:
                            column.id,
                        })
                      }
                      onClick={() =>
                        openTaskDetails(
                          task,
                          column.id
                        )
                      }
                    >

                      <div className="task-top">

                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                        <button
                          className="task-menu"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(
                              task,
                              column.id
                            );
                          }}
                        >
                          •••
                        </button>

                      </div>

                      <h3>{task.title}</h3>

                      <p>{task.description}</p>

                      <div className="task-tag">
                        {task.tag}
                      </div>

                      <div className="task-footer">

                        <div className="mini-avatar">
                          {task.assignee}
                        </div>

                        <span className="due-date">
                          ◷ {task.due}
                        </span>

                      </div>

                    </article>

                  ))}

                  {column.tasks.length === 0 && (

                    <div className="empty-column">
                      <span>☷</span>
                      <p>No tasks here</p>
                    </div>

                  )}

                </div>

                <button
                  className="add-column-task"
                  onClick={() =>
                    openCreateModal(column.id)
                  }
                >
                  + Add task
                </button>

              </div>

            ))}

          </section>

        ) : (

          <section className="list-view">

            {filteredColumns.flatMap((column) =>
              column.tasks.map((task) => (

                <article
                  className="list-task"
                  key={task.id}
                  onClick={() =>
                    openTaskDetails(
                      task,
                      column.id
                    )
                  }
                >

                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                  </div>

                  <span
                    className={`priority ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  <span className="task-tag">
                    {task.tag}
                  </span>

                  <span className="list-status">
                    {column.title}
                  </span>

                  <button
                    className="edit-list-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(
                        task,
                        column.id
                      );
                    }}
                  >
                    Edit
                  </button>

                </article>

              ))
            )}

          </section>

        )}

      </main>

      {showModal && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="modal-eyebrow">
                  {editingTask
                    ? "EDIT TASK"
                    : "NEW TASK"}
                </span>

                <h2>
                  {editingTask
                    ? "Edit task"
                    : "Create a new task"}
                </h2>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={saveTask}>

              <label>
                Task title

                <input
                  autoFocus
                  placeholder="e.g. Design landing page"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value,
                    })
                  }
                />

              </label>

              <label>
                Description

                <textarea
                  placeholder="What needs to be done?"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      description:
                        e.target.value,
                    })
                  }
                />

              </label>

              <div className="form-row">

                <label>
                  Priority

                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority:
                          e.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>

                </label>

                <label>
                  Category

                  <select
                    value={newTask.tag}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        tag: e.target.value,
                      })
                    }
                  >
                    <option>
                      Development
                    </option>
                    <option>
                      Design
                    </option>
                    <option>
                      Research
                    </option>
                    <option>
                      Planning
                    </option>
                  </select>

                </label>

              </div>

              <label>
                Due date

                <input
                  placeholder="e.g. Jul 30"
                  value={newTask.due}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      due: e.target.value,
                    })
                  }
                />

              </label>

              {!editingTask && (

                <label>
                  Add to column

                  <select
                    value={newTask.columnId}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        columnId:
                          e.target.value,
                      })
                    }
                  >

                    {columns.map((column) => (

                      <option
                        key={column.id}
                        value={column.id}
                      >
                        {column.title}
                      </option>

                    ))}

                  </select>

                </label>

              )}

              <div className="modal-actions">

                {editingTask && (

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      deleteTask(
                        editingTask.id
                      )
                    }
                  >
                    Delete
                  </button>

                )}

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingTask
                    ? "Save changes"
                    : "Create task"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {showDetails && selectedTask && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setShowDetails(false)
          }
        >

          <div
            className="modal task-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="modal-eyebrow">
                  TASK DETAILS
                </span>

                <h2>
                  {selectedTask.title}
                </h2>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowDetails(false)
                }
              >
                ×
              </button>

            </div>

            <div className="details-content">

              <p>
                {selectedTask.description}
              </p>

              <div className="details-grid">

                <div>
                  <span>Priority</span>

                  <strong
                    className={`priority ${selectedTask.priority.toLowerCase()}`}
                  >
                    {selectedTask.priority}
                  </strong>
                </div>

                <div>
                  <span>Category</span>

                  <strong>
                    {selectedTask.tag}
                  </strong>
                </div>

                <div>
                  <span>Assignee</span>

                  <strong>
                    {selectedTask.assignee}
                  </strong>
                </div>

                <div>
                  <span>Due date</span>

                  <strong>
                    {selectedTask.due}
                  </strong>
                </div>

              </div>

            </div>

            <div className="modal-actions">

              <button
                className="delete-button"
                onClick={() =>
                  deleteTask(
                    selectedTask.id
                  )
                }
              >
                Delete task
              </button>

              <button
                className="primary-button"
                onClick={() => {

                  setShowDetails(false);

                  openEditModal(
                    selectedTask,
                    selectedTask.columnId
                  );

                }}
              >
                Edit task
              </button>

            </div>

          </div>

        </div>

      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

    </div>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);