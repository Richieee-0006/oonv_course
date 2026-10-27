@echo off
title C# ^& OONV Interaktivni Kurz - Windows Launcher
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-windows.ps1" %*
