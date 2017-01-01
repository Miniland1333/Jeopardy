@echo off
set ip_address_string="IP Address"
rem Uncomment the following line when using Windows 7 (with removing "rem")!
set ip_address_string="IPv4 Address"
echo Network Connection Test
for /f "usebackq tokens=2 delims=:" %%f in (`ipconfig ^| findstr /c:%ip_address_string%`) do echo Use this IP Address to access the game: %%f

rem NETSH WLAN SHOW INTERFACE | findstr /r "^....SSID"

meteor --port 3000
