#!/bin/sh
export IS_GRUNT=true
start=`date +%s`
convertsecs() {
 ((m=(${1}%3600)/60))
 ((s=${1}%60))
 printf "%d minutes and %d seconds\n" $m $s
}
checkStatus(){
    if [ $1 -ne 0 ]; then
    echo "failure!";
    exit 1
    fi
}
echo running build task
rm -rf grunt ../dist
node render-requirejs/render-requirejs.js &
P1=$!
node preBuildChecks.js --verbose &
P2=$!
node eslint-jsdoc.js &
P3=$!
wait $P2
checkStatus $?
node --max_old_space_size=5120 $(which grunt) && node component.js && node integrity-generator.js
checkStatus $?
node resource-bundle.js &
P4=$!
npm run jsdoc-nix &
P5=$!
wait $P4 $P5
checkStatus $?
end=`date +%s`
printf "\n\nTotal time taken by ./build.sh: %s %s %s %s %s %s\n\n" $(convertsecs $((end-start)))