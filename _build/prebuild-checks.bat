@echo off
node preBuildChecks.js --verbose && node eslint-jsdoc.js && grunt concurrent:eslint
if %errorlevel% neq 0 (
echo couldn't complete all checks, please do not commit! 1>&2
) else (
echo all checks passed, you can proceed with commit 1>&2
)
