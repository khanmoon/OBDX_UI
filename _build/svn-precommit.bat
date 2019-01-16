@echo off
PushD %~dp0
node preBuildChecks.js %~1 --precommit --verbose 1>&2
eslint ../components/ ../framework/elements ../framework/js/view-model ../resources ../framework/js/base-models ../framework/js/constants ../framework/js/pages ../lzn/ -c .eslintrc.json --cache 1>&2
node eslint-jsdoc.js; grunt eslint:jsdoc 1>&2
if %errorlevel% neq 0 (
echo couldn't complete all checks! 1>&2
exit 1
) else (
echo all checks passed 1>&2
exit 0
)
