# ForgePilot — Forge 2 Qualifier Multi-Agent AI System

ForgePilot is a production-style multi-agent AI orchestration system built for the **Forge 2 · Edition 2 qualifier**. The project demonstrates how a human can coordinate an AI **orchestrator agent (Hermes)** and a **coding agent (OpenClaw)** through **Slack**, while maintaining a transparent, auditable, and human-in-the-loop workflow.

The final build includes a small **Trello-style Kanban application** with a **Laravel API backend** and a **React frontend**, along with supporting evidence such as Slack communication logs, architecture documentation, agent logs, and deployment proof.

---

## Project Overview

This repository showcases a complete qualifier submission for Forge 2, where the primary focus is not only the Kanban application itself, but the **multi-agent development workflow** that produced it.

### Key Objectives

* Demonstrate a working **Hermes + OpenClaw** agent architecture.
* Use **Slack** as the communication layer for all agent-to-agent interactions.
* Maintain **human oversight** for planning, approvals, and final merges.
* Build and deploy a functional **Kanban board application**.
* Provide transparent evidence through logs, screenshots, and documentation.

---

## Architecture

```text
Human
  ↓
Slack Workspace
  ↓
Hermes (Brain / Product Owner)
  ↓
Task Planning + Memory + Skills
  ↓
OpenClaw (Hands / Coding Agent)
  ↓
GitHub Repository
  ↓
GitHub Actions (CI/CD)
  ↓
Health Checks + Deployment
  ↓
Laravel API + React Kanban UI
```

### Agent Responsibilities

| Agent        | Role                 | Responsibilities                                                                                       |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Hermes**   | Brain / Orchestrator | Planning, task decomposition, memory recall, skill execution, progress tracking, and status reporting. |
| **OpenClaw** | Hands / Coding Agent | Writing code, running tests, fixing errors, committing changes, and reporting execution status.        |

---

## Slack Workflow

All communication is intentionally visible and auditable through dedicated Slack channels.

| Channel        | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `#sprint-main` | Human ↔ Hermes communication for goals, plans, and approvals.          |
| `#agent-coder` | Hermes ↔ OpenClaw communication for coding tasks and progress reports. |
| `#agent-log`   | Automated logs, autonomous runs, and audit trail evidence.             |

This setup ensures that no agent operates privately; every instruction, response, and status update remains observable by the human operator.

---

## Model Routing

ForgePilot uses a cost-aware model routing strategy, aligning with the Forge 2 judging rubric.

| Agent        | Model                  | Purpose                                                   |
| ------------ | ---------------------- | --------------------------------------------------------- |
| **Hermes**   | Gemini 2.5 Flash       | Planning, orchestration, reasoning, and status synthesis. |
| **OpenClaw** | Qwen2.5-Coder (Ollama) | Code generation, debugging, and execution tasks.          |

This routing allows a stronger model to handle orchestration while a coding-optimized local model handles implementation tasks.

---

## Kanban Application Features

The Kanban application serves as the real output generated through the multi-agent workflow.

### Required Features

* Create and manage **Boards**.
* Create and manage **Lists** within boards.
* Create, edit, and delete **Cards**.
* Move cards between lists.
* Add **Tags / Labels** to cards.
* Assign cards to **Members**.
* Set and track **Due Dates**.
* Highlight overdue tasks visually.

---

## Repository Structure

```text
forge2-qualifier-rishika/
├── backend/                  # Laravel API
├── frontend/                 # React application
├── hermes/                   # Hermes configuration, memory, prompts, and skills
├── openclaw/                 # OpenClaw configuration, prompts, and tools
├── slack/                    # Slack integration and message handling
├── health/                   # Health check utilities
├── docs/                     # Additional documentation
├── evidence/                 # Screenshots and walkthrough assets
├── slack-export/             # Slack conversation evidence
├── .github/workflows/        # GitHub Actions CI/CD workflows
├── README.md                 # Project overview and setup
├── ARCHITECTURE.md           # Detailed system architecture
├── agent-log.md              # Human ↔ agent interaction log
└── .env.example              # Environment variable template
```

---

## Technology Stack

| Component       | Technology                      |
| --------------- | ------------------------------- |
| Backend         | Laravel (PHP 8.2+)              |
| Frontend        | React + Vite                    |
| Database        | SQLite                          |
| Orchestrator    | Hermes Agent                    |
| Coding Agent    | OpenClaw                        |
| Communication   | Slack                           |
| Version Control | GitHub                          |
| CI/CD           | GitHub Actions                  |
| Deployment      | Vercel / Render / Railway       |
| Models          | Gemini 2.5 Flash, Qwen2.5-Coder |

---

## Evidence Included

To support judging and verification, this repository will include:

* `ARCHITECTURE.md` — detailed system design and workflow.
* `agent-log.md` — recorded human ↔ agent interactions.
* `skills/status-report/SKILL.md` — reusable Hermes skill definition.
* `slack-export/` — Slack communication evidence.
* `evidence/screenshots/` — screenshots of setup and execution.
* `evidence/walkthrough/` — short project walkthrough recording.
* `.env.example` — environment variable template without secrets.

---

## Setup Instructions

### Prerequisites

* Node.js 22.19+
* PHP 8.2+
* Composer
* Git
* Slack workspace and bot configuration
* Ollama with `qwen2.5-coder` model
* Gemini API key

### Local Development

```bash
# Clone the repository
git clone https://github.com/<your-username>/forge2-qualifier-rishika.git
cd forge2-qualifier-rishika

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend setup
cd ../frontend
npm install
npm run dev
```

---

## Human-in-the-Loop Principle

A core principle of ForgePilot is that the human remains responsible for oversight and final decisions.

* The human defines goals in Slack.
* Hermes plans and assigns tasks.
* OpenClaw executes coding tasks.
* GitHub Actions verifies code quality.
* The human reviews and approves final merges.

This ensures transparency, accountability, and alignment with the Forge 2 qualifier requirements.

---

## Live URL

The deployed Kanban application URL will be added here after deployment.

**Live Demo:** `Coming soon`

---

## License

This project is created as part of the Forge 2 · Edition 2 qualifier submission and is intended for educational and evaluation purposes.
