# System Architecture

## Overview

This project follows a multi-agent architecture where a human collaborates with two AI agents through Slack.

- **Hermes** acts as the Product Owner and Orchestrator.
- **OpenClaw** acts as the Coding Agent.
- **Slack** is the communication layer where every interaction remains transparent and human-auditable.
- **GitHub** stores all generated code.
- **GitHub Actions** validates every commit before deployment.

---

# Architecture Diagram

```
                        Human
                          │
                          ▼
                    Slack Workspace
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
      Hermes                          OpenClaw
(Product Owner)                   (Coding Agent)

        │                                   │
        └──────────────┬────────────────────┘
                       ▼
                GitHub Repository
                       │
                       ▼
                GitHub Actions
                       │
                       ▼
                 Health Checks
                       │
                       ▼
                  Live Deployment
```

---

# Agent Responsibilities

## Hermes (Brain)

Responsibilities:

- Understand the user's request.
- Break the project into smaller tasks.
- Assign tasks to OpenClaw.
- Track project progress.
- Maintain persistent memory.
- Execute reusable skills.
- Generate structured status reports.
- Wait for human approval before major decisions.

Hermes never writes application code directly.

---

## OpenClaw (Hands)

Responsibilities:

- Receive coding tasks from Hermes.
- Generate application code.
- Modify existing files.
- Run tests.
- Fix build failures.
- Commit changes to GitHub.
- Report results back through Slack.

OpenClaw does not make product decisions.

---

# Slack Communication

Three Slack channels are used.

## #sprint-main

Purpose

- Human ↔ Hermes
- Planning
- Decisions
- Status Reports

---

## #agent-coder

Purpose

- Hermes ↔ OpenClaw
- Task Assignment
- Coding Progress
- Build Status

---

## #agent-log

Purpose

- Autonomous Runs
- Error Logs
- Agent Activity
- Audit Trail

---

# Workflow

1. Human posts a goal in **#sprint-main**.
2. Hermes creates a task plan.
3. Hermes assigns a coding task in **#agent-coder**.
4. OpenClaw generates code.
5. GitHub receives the commit.
6. GitHub Actions run automated tests.
7. Test results are posted back to Slack.
8. Hermes summarizes progress.
9. Human approves the final merge.
10. Application is deployed.

---

# Persistent Memory

Hermes stores:

- Repository Name
- Project Goals
- Completed Tasks
- Pending Tasks
- Human Decisions
- Frequently Repeated Errors

Memory persists across sessions.

---

# Skills

Hermes includes reusable skills.

Current Skill:

- status-report

Output Format:

- What I Did
- What's Left
- What Needs Your Call

---

# Model Routing

| Component | Model |
|-----------|-------|
| Hermes | Gemini 2.5 Flash |
| OpenClaw | Qwen2.5-Coder (Ollama) |

Planning is handled by a stronger reasoning model while code generation is handled by a lightweight coding model.

---

# CI/CD Pipeline

Every commit triggers:

- Laravel Tests
- React Build
- Lint Checks
- Health Verification

Only passing builds are eligible for deployment.

---

# Human in the Loop

No deployment or final merge occurs automatically.

The human builder always has the final approval before production.

---

# Health Monitoring

The system verifies:

- Backend Availability
- Frontend Availability
- API Status
- Build Success
- Test Results

---

# Deployment

Frontend

- Vercel

Backend

- Railway / Render

```

---

## ✅ Ab next step **`.gitignore`** hoga (2 minutes ka kaam), uske baad hum **actual Hermes setup** start karenge. Ye wahi point hai jahan se real qualifier implementation shuru hoti hai.