@echo off
set "ROOT=%~dp0"
title MEMOPIX ? 5 TB Private Memory Cloud (Permanent Runner)

echo ======================================================================
echo           MEMOPIX - 5 TB PRIVATE PHOTO, VIDEO & AUDIO CLOUD
echo ======================================================================
echo.
echo [1/3] Starting Backend Server (Port 5000)...
start "MEMOPIX-Backend" cmd /k "cd /d "%~dp0backend" & npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server (Port 5173)...
start "MEMOPIX-Frontend" cmd /k "cd /d "%~dp0frontend" & npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Public Tunnel (Worldwide Access)...
start "MEMOPIX-Tunnel" cmd /k "title MEMOPIX Public Tunnel & echo Connecting Public Tunnel... & :loop & ssh -R 80:localhost:5173 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 nokey@localhost.run & echo Tunnel disconnected, reconnecting in 5s... & timeout /t 5 & goto loop"

echo.
echo ======================================================================
echo                     OPEN ON YOUR ANDROID PHONE
echo ======================================================================
echo.
echo  [A] ON HOME WI-FI (RECOMMENDED - ULTRA FAST 5 TB SPEED, NEVER EXPIRES):
echo      ==^> http://192.168.29.61:5173
echo.
echo  [B] OUTSIDE ON MOBILE DATA:
echo      ==^> Look at the "MEMOPIX-Tunnel" window for your https:// link!
echo.
echo  You can now CLOSE Antigravity! These servers run independently in Windows.
echo ======================================================================
echo.
pause
