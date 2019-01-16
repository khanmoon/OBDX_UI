const glob = require('multi-glob').glob;
const requirejs = require('requirejs');
const fs = require('fs');
const path = require('path');

requirejs.config({
    paths: {
        'resources': '../resources',
        'ojL10n': '../framework/js/libs/oraclejet/js/libs/oj/v5.0.0/ojL10n'
    },
    nodeRequire: require
});
glob(['../resources/**/*.js'],
    function(err, files) {
        if (err) {
            throw err;
        }
        // process.argv.forEach(function (val, index, array) {
        //   console.log(index + ': ' + val);
        // });
        console.log('files ',files.length);
        for (var i = 0; i < files.length; i++) {
            var resource, updated_file,temp,temp2,data;
            var outFile = path.join('../resources/nls/', path.parse(files[i]).base);
            //files to exclude
            if( (files[i].indexOf('data-types') > -1) || (files[i].indexOf('obdx-locale')> -1) || (files[i].indexOf('generic')> -1)){
              continue;
            }
            try {
                resource = requirejs(files[i]);
                data = fs.readFileSync(files[i], 'utf8');
            } catch (e) {
                console.log('Couldn\'t require the file', files[i]);
                console.log(e);
                continue;
            }
			if(i<2 && i>0){
			//console.log('37',resource);
			//console.log('38',data);
            }
            if (!resource.root) {
                throw new Error(`Invalid resource bundle: ${files[i]}`);
            } else {
                resource[process.argv[2]] = (process.argv[3].toLowerCase() == 'true');
                //console.log("45",resource);
                delete resource.root;
                //console.log("47",resource);
                //console.log("data",data);
                try {
                    temp=data;
                    var search2=true,brackets2=[],newStart2=0;
                        while(search2){
                          if(newStart2>-1){
                            brackets2.push(newStart2=temp.indexOf('}',newStart2+1));
                          }else{
                            search2=false;brackets2.pop();
                          }
                        }
                    //console.log(brackets2);
                    Object.keys(resource).forEach(function(item,index){

                      if(temp.indexOf(item+':',brackets2[brackets2.length-4])>-1){
                        const current_location=temp.indexOf(item+':',brackets2[brackets2.length-4]);
                        temp2=temp.substring(0,current_location+(item.length+1));
                        temp2=temp2+resource[item].toString();
                        if(temp.indexOf(",",current_location)==-1){
                          temp2=temp2+temp.substring(temp.indexOf("}",current_location));
                        }else{
                          temp2=temp2+temp.substring(temp.indexOf(",",current_location));
                        }
                        temp=temp2;
                      }else if(temp.indexOf('"'+item+'"'+':')>-1){
                        temp2=temp.substring(0,temp.indexOf('"'+item+'"'+':')+(item.length+3));
                        temp2=temp2+resource[item].toString();
                        if(temp.indexOf(",",temp.indexOf('"'+item+'"'+':'))==-1){
                          temp2=temp2+temp.substring(temp.indexOf("}",temp.indexOf('"'+item+'"'+':')));
                        }else{
                          temp2=temp2+temp.substring(temp.indexOf(",",temp.indexOf('"'+item+'"'+':')));
                        }
                        temp=temp2;
                      }else{
                        //code for adding new language code in resource bundle
                        var search=true,brackets=[],newStart=0;
                        while(search){
                          if(newStart>-1){
                            brackets.push(newStart=temp.indexOf('}',newStart+1));
                          }else{
                            search=false;brackets.pop();
                          }
                        }

                        temp2=temp.substring(0,brackets[brackets.length-3])+','+item+': '+resource[item].toString()+temp.substring(brackets[brackets.length-3]);
                        temp=temp2;
                      }
                    });

                    try {
                        fs.writeFileSync(files[i], temp2, 'utf8');
                    } catch (error) {
                        console.log('Couldn\'t write the fixed resource bundle file11');
                    }
                } catch (e) {
                    console.log('Wrong Couldn\'t read the original file', files[i]);
                }

            }

        }

    });
