# 🔀 Startup Scripts Comparison

## Quick Decision Guide

**Just want to start developing?**  
→ Use `./start-dev-fg.sh` (Linux/Mac) or `start-dev.bat` (Windows)

---

## Script Comparison Table

| Feature | start-dev-fg.sh | start-dev.sh | start-dev.bat |
|---------|----------------|--------------|---------------|
| **Platform** | Linux/Mac | Linux/Mac | Windows |
| **Mode** | Foreground | Background | Background (separate windows) |
| **Live Logs** | ✅ Yes (real-time) | ⚠️ Partial (tail) | ❌ No (separate windows) |
| **One-Command Stop** | ✅ Ctrl+C | ❌ Need `./stop-dev.sh` | ❌ Close windows manually |
| **Log Files** | ❌ No (stdout only) | ✅ Yes (logs/*.log) | ❌ No |
| **Background Operation** | ❌ Blocks terminal | ✅ Terminal free | ✅ Terminal free |
| **Debugging** | ✅ Excellent | 🟡 Good | 🟡 Good |
| **Recommended For** | Active development | Background services | Windows users |

---

## Detailed Comparison

### start-dev-fg.sh (Foreground Mode) ⭐ RECOMMENDED

**When to use**:
- You're actively developing
- You want to see all logs immediately
- You prefer simple Ctrl+C to stop everything

**Pros**:
- ✅ Real-time logs from both services
- ✅ Color-coded output `[BACKEND]` and `[FRONTEND]`
- ✅ Single Ctrl+C stops everything cleanly
- ✅ No orphan processes
- ✅ Best for debugging

**Cons**:
- ❌ Terminal is blocked (can't run other commands)
- ❌ No persistent log files

**Usage**:
```bash
./start-dev-fg.sh
# Press Ctrl+C when done
```

---

### start-dev.sh (Background Mode)

**When to use**:
- You need terminal for other commands
- You want to keep services running while working
- You prefer persistent log files

**Pros**:
- ✅ Terminal remains free
- ✅ Persistent log files (logs/*.log)
- ✅ PID tracking for clean shutdown
- ✅ Can tail logs separately

**Cons**:
- ❌ Need separate stop command
- ❌ Logs not immediately visible
- ⚠️ Updated version now shows tailed logs (may still exit - see bug fix)

**Usage**:
```bash
./start-dev.sh
# Work in terminal
./stop-dev.sh  # When done
```

**View Logs**:
```bash
tail -f logs/backend.log
tail -f logs/frontend.log
# Or both:
tail -f logs/*.log
```

---

### start-dev.bat (Windows)

**When to use**:
- You're on Windows
- Standard Windows development workflow

**Pros**:
- ✅ Native Windows support
- ✅ Separate windows for backend/frontend
- ✅ Can close windows individually

**Cons**:
- ❌ No unified log view
- ❌ Manual window management

**Usage**:
```cmd
start-dev.bat
REM Close terminal windows when done
```

---

## 🎯 Recommendation by Use Case

### "I just want to start coding now"
→ `./start-dev-fg.sh` (Linux/Mac) or `start-dev.bat` (Windows)

### "I'm debugging a backend issue"
→ `./start-dev-fg.sh` (see backend logs immediately)

### "I'm debugging a frontend issue"
→ `./start-dev-fg.sh` (see frontend logs immediately)

### "I want services running while I do other terminal work"
→ `./start-dev.sh` (background mode)

### "I prefer traditional separate windows"
→ `start-dev.bat` (Windows) or manual terminal tabs

---

## 🔧 Troubleshooting

### start-dev-fg.sh closes immediately
This should NOT happen with the foreground script. If it does:
1. Check for errors in output
2. Verify Node.js installed: `node --version`
3. Check ports free: `lsof -i :5000` and `lsof -i :5173`

### start-dev.sh closes after showing logs
**This is the bug you reported!** Use `start-dev-fg.sh` instead, or:
- Manually run: `cd backend && npm run dev` in one terminal
- And: `cd frontend && npm run dev` in another terminal

### Processes don't stop
```bash
# Kill by port (nuclear option)
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 📊 Performance Impact

| Script | CPU Usage | Memory | Startup Time |
|--------|-----------|--------|--------------|
| start-dev-fg.sh | Same | Same | ~5s |
| start-dev.sh | Same | +5MB (logs) | ~5s |
| start-dev.bat | Same | Same | ~7s |

All scripts have identical performance once services are running.

---

## 💡 Pro Tips

### Tip 1: Create an alias (Linux/Mac)
```bash
# Add to ~/.bashrc or ~/.zshrc
alias clarify='cd /path/to/clarify_site && ./start-dev-fg.sh'

# Now just type:
clarify
```

### Tip 2: Use tmux for better control
```bash
tmux new -s clarify
./start-dev-fg.sh
# Detach: Ctrl+B then D
# Reattach: tmux attach -t clarify
```

### Tip 3: Create a VS Code task
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Servers",
      "type": "shell",
      "command": "./start-dev-fg.sh",
      "problemMatcher": []
    }
  ]
}
```

---

**Updated**: January 06, 2026  
**Bug Fix**: Added `start-dev-fg.sh` for reliable foreground operation
