@echo off
set errorlevel=
set IS_GRUNT=true
echo running build task
node render-requirejs/render-requirejs.js && node preBuildChecks.js --verbose && for /f "usebackq tokens=*" %%a in (`where grunt.cmd`) do  %%a && node component.js && node integrity-generator.js && node resource-bundle.js
if %errorlevel% neq 0 (
echo failure!
exit 1
) else (
echo done!
exit 0
)
