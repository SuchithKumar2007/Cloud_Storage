Set WshShell = CreateObject("WScript.Shell")
Dim projectPath
projectPath = "d:\Suchith\Project\Cloud 5TB"

' 1. Start Backend silently (0 = completely hidden)
WshShell.Run "cmd.exe /c cd /d """ & projectPath & "\backend"" && npm.cmd run dev", 0, False

WScript.Sleep 3000

' 2. Start Frontend silently (0 = completely hidden)
WshShell.Run "cmd.exe /c cd /d """ & projectPath & "\frontend"" && npm.cmd run dev", 0, False

WScript.Sleep 3000

' 3. Start Cloudflare Tunnel silently (0 = completely hidden, logs to tunnel.log)
WshShell.Run "cmd.exe /c cd /d """ & projectPath & """ && cloudflared.exe tunnel --url http://localhost:5173 --no-autoupdate > tunnel.log 2>&1", 0, False
