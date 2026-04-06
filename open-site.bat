@echo off
title Dev Server

if not exist C:\Users\%username%\.deno\bin\deno.exe (
   powershell -command "irm https://deno.land/install.ps1 | iex"
   deno install
)

deno task dev --port 2137
start http://localhost:2137
