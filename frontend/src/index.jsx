import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const initialColumns = [
  {
    id: "backlog",
    title: "Backlog",
    color: "gray",
    tasks: [
      {
        id: 1,
        title: "Design onboarding experience",
        description: "Create a simple and delightful first-time user journey.",
        priority: "High",
        tag: "Design",
        assignee: "AR",
        due: "Jul 28",
      },
      {
        id: 2,
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
        id: 3,
        title: "Create analytics dashboard",
        description: "Build a clean overview of key product metrics.",
        priority: "High",
        tag: "Development",
        assignee: "MR",
        due: "Jul 26",
      },
      {
        id: 4,
        title: "Prepare user research",
        description: "Finalize questions for the upcoming user interviews.",
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
        id: 5,
        title: "Build authentication flow",
        description: "Implement secure login and registration experience.",
        priority: "High",
        tag: "Development",
        assignee: "SK",
        due: "Today",
      },
      {
        id: 6,
        title: "Mobile responsive layout",
        description: "Optimize the dashboard for smaller screens.",
        priority: "Medium",
        tag: "Design",
        assignee: "MR",
        due: "Jul 25",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "orange",
    tasks: [
      {
        id: 7,
        title: "Update brand guidelines",
        description: "Review the latest typography and visual system.",
        priority: "Medium",
        tag: "Design",
        assignee: "AR",
        due: "Jul 24",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "green",
    tasks: [
      {
        id: 8,
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

function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("My Workspace");
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    tag: "Development",
  });

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);

  const filteredColumns = useMemo(() => {
    if (!search.trim()) return columns;

    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.tag.toLowerCase().includes(search.toLowerCase())
      ),
    }));
  }, [columns, search]);

  function addTask(e) {
    e.preventDefault();

    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description || "New task added to the workspace.",
      priority: newTask.priority,
      tag: newTask.tag,
      assignee: "YOU",
      due: "No date",
    };

    setColumns((current) =>
      current.map((column) =>
        column.id === "todo"
          ? { ...column, tasks: [task, ...column.tasks] }
          : column
      )
    );

    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      tag: "Development",
    });
    setShowModal(false);
  }

  function handleDrop(targetColumnId) {
    if (!draggedTask) return;

    const { task, sourceColumnId } = draggedTask;

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns((current) => {
      const withoutTask = current.map((column) =>
        column.id === sourceColumnId
          ? {
              ...column,
              tasks: column.tasks.filter((item) => item.id !== task.id),
            }
          : column
      );

      return withoutTask.map((column) =>
        column.id === targetColumnId
          ? { ...column, tasks: [...column.tasks, task] }
          : column
      );
    });

    setDraggedTask(null);
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
              className={`nav-item ${activeNav === label ? "active" : ""}`}
              onClick={() => setActiveNav(label)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="nav-section projects">
          <div className="projects-heading">
            <p className="nav-label">PROJECTS</p>
            <button>+</button>
          </div>

          <button className="project-item active-project">
            <span className="project-dot purple-dot" />
            Product Launch
          </button>
          <button className="project-item">
            <span className="project-dot blue-dot" />
            Mobile App
          </button>
          <button className="project-item">
            <span className="project-dot orange-dot" />
            Website Redesign
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>Unlock more with Pro</strong>
            <p>Get unlimited projects and advanced tools.</p>
            <button>Upgrade plan</button>
          </div>

          <div className="user-profile">
            <div className="avatar avatar-purple">RR</div>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
              />
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button">?</button>
            <button className="icon-button notification">
              ♧
              <i />
            </button>
            <div className="avatar avatar-purple">RR</div>
          </div>
        </header>

        <section className="page-header">
          <div>
            <div className="title-row">
              <h1>Product Launch</h1>
              <span className="private-badge">Private</span>
            </div>
            <p>Plan, build, and launch something people love.</p>
          </div>

          <div className="header-actions">
            <button className="secondary-button">⋯</button>
            <button
              className="primary-button"
              onClick={() => setShowModal(true)}
            >
              <span>+</span> Add task
            </button>
          </div>
        </section>

        <section className="stats-row">
          <div className="stat-card">
            <div className="stat-icon purple-bg">◈</div>
            <div>
              <span>Total tasks</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue-bg">◷</div>
            <div>
              <span>In progress</span>
              <strong>
                {columns.find((c) => c.id === "progress")?.tasks.length || 0}
              </strong>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green-bg">✓</div>
            <div>
              <span>Completed</span>
              <strong>
                {columns.find((c) => c.id === "done")?.tasks.length || 0}
              </strong>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange-bg">⚡</div>
            <div>
              <span>Completion</span>
              <strong>12%</strong>
            </div>
          </div>
        </section>

        <div className="board-toolbar">
          <div className="view-tabs">
            <button className="view-tab active-tab">▦ Board</button>
            <button className="view-tab">☷ List</button>
          </div>

          <div className="toolbar-actions">
            <button className="filter-button">☷ Filter</button>
            <button className="filter-button">↕ Sort</button>
            <button className="filter-button">⚙ View</button>
          </div>
        </div>

        <section className="kanban-board">
          {filteredColumns.map((column) => (
            <div
              className="kanban-column"
              key={column.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="column-header">
                <div className="column-title">
                  <span className={`status-dot ${column.color}`} />
                  <strong>{column.title}</strong>
                  <span className="task-count">{column.tasks.length}</span>
                </div>
                <button className="column-menu">•••</button>
              </div>

              <div className="task-list">
                {column.tasks.map((task) => (
                  <article
                    className="task-card"
                    key={task.id}
                    draggable
                    onDragStart={() =>
                      setDraggedTask({ task, sourceColumnId: column.id })
                    }
                  >
                    <div className="task-top">
                      <span className={`priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <button className="task-menu">•••</button>
                    </div>

                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <div className="task-tag">{task.tag}</div>

                    <div className="task-footer">
                      <div className="mini-avatar">{task.assignee}</div>
                      <span className="due-date">◷ {task.due}</span>
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
                onClick={() => setShowModal(true)}
              >
                + Add task
              </button>
            </div>
          ))}
        </section>
      </main>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">NEW TASK</span>
                <h2>Create a new task</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={addTask}>
              <label>
                Task title
                <input
                  autoFocus
                  placeholder="e.g. Design landing page"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  placeholder="What needs to be done?"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </label>

              <div className="form-row">
                <label>
                  Priority
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
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
                      setNewTask({ ...newTask, tag: e.target.value })
                    }
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Research</option>
                    <option>Planning</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);