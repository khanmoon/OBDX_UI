#!/bin/bash
######################## very important instruction ###################################
#if you abort the build anyway in between when the build is running remove the "mylock" file from the /var/tmp directory
#you can use this command below to remove it

rm -rf /var/tmp/mylock
################################# ios build part ###########################################
removing_and_copying_directories_for_ios(){
	rm -rf ./apps/ios/workspace/obdx/platforms/ios/www/{components,framework,images,index,resources,partials,index.html,pages,sw.js,manifest.json,extensions,build.fingerprint,json}
	rm -rf ./mobilebuild/dist/{build.txt,pages}
	cp -rf ./mobilebuild/dist/* ./apps/ios/workspace/obdx/platforms/ios/www/
}


checking_out_base_project_for_ios(){
	echo "checking out base project"
	cd ./apps/ios/workspace
	rm ./obdx/platforms/ios/app.plist
	##svn update
	cd ../../../
}


################################start of the ios build ###################
ios_build(){
	updating_exporting_ui
	export IS_GRUNT=true
	/usr/local/bin/node render-requirejs/render-requirejs.js mobile && /usr/local/bin/node --max_old_space_size=5120 /usr/local/bin/grunt mobilebuild --platform=ios
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ../..
	#checking_out_base_project_for_ios
	removing_and_copying_directories_for_ios
	cd apps/ios/workspace/obdx/platforms/ios
	set_ios_url
	xcodebuild -scheme obdx archive -archivePath ./obdx.xcarchive && xcodebuild -exportArchive -archivePath ./obdx.xcarchive -exportPath ../obdx.ipa -exportOptionsPlist ./exportOptionPlist.plist
    xcode_build_status=$?
	if [ $xcode_build_status -ne 0 ]
	then
	    echo "xcode build faild"
	    rm $LOCK
	    exit 1
	fi
	rm app.plist
    cd ..
	curl -T ./obdx.ipa/obdx.ipa ftp://10.180.33.218/OBDX182/ios/ --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
    copy_ipa=$?
	if [ $copy_ipa -ne 0 ]
	then
	    echo "copying ipa failed"
	    rm $LOCK
	    exit 1
	fi

	cd ../../../
	#rm -rf ios

	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi

}



###################################### android build part #########################################################
###################################################################################################################
updating_exporting_ui()
{
	cd ../
	rm -rf dist destInt
	#svn update
	cd ./_build
	rm -rf grunt
	echo running build task
}

removing_and_copying_directories_for_android()
{
	rm -rf ./apps/android/obdx/platforms/android/assets/www/{components,corporate,framework,images,index,retail,resources,partials,index.html,pages,sw.js,manifest.json,extensions,build.fingerprint,json}
	rm -rf ./mobilebuild/dist/{build.txt,pages}
	cp -rf ./mobilebuild/dist/* ./apps/android/obdx/platforms/android/assets/www/
}

checking_out_base_project_for_android(){
	echo "checking out base project"
	rm -rf ./apps/android/obdx/platforms/android/build
	cd ./apps/android/obdx
	rm ./platforms/android/customizations/src/main/res/values/app.properties.xml
  	svn up
	cd ../../../
}

####################################### android build starts from here ########################################################
android_build(){
	updating_exporting_ui
	export IS_GRUNT=true
	node render-requirejs/render-requirejs.js mobile && node --max_old_space_size=5120 $(which grunt) mobilebuild --platform=android
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ../..
	checking_out_base_project_for_android
	removing_and_copying_directories_for_android
	cd ./apps/android/obdx/platforms/android
	set_android_url
	chmod 777 ./gradlew
	./gradlew clean
	./gradlew assembleRelease && curl -T ./build/outputs/apk/release/android-release.apk ftp://10.180.33.218/OBDX182/android/ --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
	curl -T ./obdxwear/build/outputs/apk/release/obdxwear-release.apk ftp://10.180.33.218/OBDX182/android/obdxwear-release.apk --user obdxuser:welcome1
	echo "OBDXWEAR OAM BUILD UPLOADED"
	gradle_build_status=$?
	if [ $gradle_build_status -ne 0 ]
	then
	    echo "gradle build faild"
	    exit 1
	fi
	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi
}
####################################### android build ends here ########################################################

####################################### android dev build starts from here ################################################
android_dev(){
	updating_exporting_ui
	node component-sass.js
	node --max_old_space_size=5120 $(which grunt) mobile-dev --platform=android
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ..
	mv "destInt" "dist"
	cd ..
	checking_out_base_project_for_android
	removing_and_copying_directories_for_android
	cd ./apps/android/obdx/platforms/android
	set_android_url
	chmod 777 ./gradlew
	./gradlew clean
	./gradlew assembleDebug && curl -T ./build/outputs/apk/debug/android-debug.apk ftp://10.180.33.218/OBDX182/android/ --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
	curl -T ./obdxwear/build/outputs/apk/debug/obdxwear-debug.apk ftp://10.180.33.218/OBDX182/android/obdxwear-debug.apk --user obdxuser:welcome1
	echo "OBDXWEAR OAM BUILD UPLOADED"
	gradle_build_status=$?
	if [ $gradle_build_status -ne 0 ]
	then
	    echo "gradle build faild"
	    exit 1
	fi
	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi
}
####################################### android dev build ends here #######################################################

####################################### android dev ui build starts from here ################################################
android_dev_ui(){
	updating_exporting_ui
	node component-sass.js
	node --max_old_space_size=5120 $(type -p grunt) mobile-dev --platform=android
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
		cd ..
		mv "destInt" "dist"
		echo "done!";
		rm $LOCK
		exit 0
	else
		echo "failure!";
		rm $LOCK
		exit 1
	fi
}
####################################### android dev ui build ends here #######################################################



####################################### android dev build starts from here ################################################
test_dev(){
	updating_exporting_ui
	export IS_GRUNT=true
	node render-requirejs/render-requirejs.js mobile && node --max_old_space_size=5120 $(which grunt) mobilebuild --platform=android
	EXIT_CODE=$?
	if [ $EXIT_CODE -eq 0 ]; then
	cd ../..
	checking_out_base_project_for_android
	removing_and_copying_directories_for_android
	cd ./apps/android/obdx/platforms/android
	set_android_url
	chmod 777 ./gradlew
	./gradlew clean
	./gradlew assembleDebug && curl -T ./build/outputs/apk/debug/android-debug.apk ftp://10.180.33.218/OBDX182/android/android-test.apk --user obdxuser:welcome1
	echo "OAM BUILD UPLOADED"
	curl -T ./obdxwear/build/outputs/apk/debug/obdxwear-debug.apk ftp://10.180.33.218/OBDX182/android/obdxwear-test.apk --user obdxuser:welcome1
	echo "OBDXWEAR OAM BUILD UPLOADED"
	gradle_build_status=$?
	if [ $gradle_build_status -ne 0 ]
	then
	    echo "gradle build faild"
	    exit 1
	fi
	echo "done!";
	rm $LOCK
	exit 0
	else
	echo "failure!";
	rm $LOCK
	exit 1
	fi
}
####################################### android dev build ends here #######################################################


########################### Utility functions to read from mobile_properties.json and modify app.properties.xml(android) and app.plist(ios) ##########################



## common utilities

set_ios_url() {
	sed "s|@@SERVER_TYPE|${SERVER_TYPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@KEY_SERVER_URL|${KEY_SERVER_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@KEY_OAM_URL|${KEY_OAM_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@WEB_URL|${WEB_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@CHATBOT_ID|${CHATBOT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@CHATBOT_URL|${CHATBOT_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@KEY_OAUTH_PROVIDER_URL|${KEY_OAUTH_PROVIDER_URL}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@LOGIN_SCOPE|${LOGIN_SCOPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@OFFLINE_SCOPE|${OFFLINE_SCOPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@X_TOKEN_TYPE|${X_TOKEN_TYPE}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@APP_CLIENT_ID|${APP_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@APP_DOMAIN|${APP_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@EXTENSION_CLIENT_ID|${EXTENSION_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@EXTENSION_DOMAIN|${EXTENSION_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@WATCH_CLIENT_ID|${WATCH_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@WATCH_DOMAIN|${WATCH_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist

	sed "s|@@SNAPSHOT_CLIENT_ID|${SNAPSHOT_CLIENT_ID}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
	sed "s|@@SNAPSHOT_DOMAIN|${SNAPSHOT_DOMAIN}|g" ./app.plist > ./temp.plist && mv ./temp.plist ./app.plist
}

set_android_url() {
	cd ./customizations/src/main/res/values
	sed "s|@@SERVER_TYPE|${SERVER_TYPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@KEY_SERVER_URL|${KEY_SERVER_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@KEY_OAM_URL|${KEY_OAM_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@WEB_URL|${WEB_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@CHATBOT_ID|${CHATBOT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@CHATBOT_URL|${CHATBOT_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@KEY_OAUTH_PROVIDER_URL|${KEY_OAUTH_PROVIDER_URL}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@LOGIN_SCOPE|${LOGIN_SCOPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@OFFLINE_SCOPE|${OFFLINE_SCOPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@X_TOKEN_TYPE|${X_TOKEN_TYPE}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@APP_CLIENT_ID|${APP_CLIENT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@APP_DOMAIN|${APP_DOMAIN}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@WATCH_CLIENT_ID|${WATCH_CLIENT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@WATCH_DOMAIN|${WATCH_DOMAIN}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml

	sed "s|@@SNAPSHOT_CLIENT_ID|${SNAPSHOT_CLIENT_ID}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	sed "s|@@SNAPSHOT_DOMAIN|${SNAPSHOT_DOMAIN}|g" ./app.properties.xml > ./temp.properties.xml && mv ./temp.properties.xml ./app.properties.xml
	cd ../../../../../
}

removeQuotes(){
	argument1=$1
	temp="${argument1#\"}"
	temp="${temp%\,}"
	temp="${temp%\"}"
	echo $temp
}

getKey(){
	key=$1
	VALUE=$(cat mobile_properties.json | grep $key | cut -d ":" -f2-)
	temp=$(removeQuotes $VALUE)
	echo $temp
}

###################################################################################################################################################################

## first block

LOCK=/var/tmp/mylock
if [ -f $LOCK ]; then            # 'test' -> race begin
  echo "Job is already running"
  echo "if the job is not running this means that the previous build was aborted. please remove the mylock file from /var/tmp directory"
  exit 6
fi
touch $LOCK                      # 'set'  -> race end
if [ $1 == ios ]; then
	ios_build
elif [ $1 == android ]; then
	android_build
elif [ $1 == android-dev ]; then
	android_dev		
elif [ $1 == android-dev-ui ]; then
	android_dev_ui
elif [ $1 == test ]; then
	test_dev
else
	echo "type the right argument"
fi
rm $LOCK
