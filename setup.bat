@echo off
echo ============================================
echo   Smart Habit Tracker - Full Stack Setup
echo ============================================
echo.
echo [1/3] Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
echo.
echo [2/3] Installing frontend dependencies...
cd /d "%~dp0"
call npm install
echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo Now run these in TWO separate terminals:
echo.
echo   Terminal 1 (Backend):
echo     cd backend
echo     npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     npm run dev
echo.
echo Make sure MongoDB is running first!
echo ============================================
pause
