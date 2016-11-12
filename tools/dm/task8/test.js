var fs = require('fs');
var exec = require("child_process").exec;

var tests_in = [];
var tests_out = {};
var tests_ok = [];
var tests_er = [];

var bin = "node " + process.argv[2];
var test_dir = "./test/";

fs.readdirSync(test_dir).map(file=>{
    if(/^.*\.in$/.test(file))
        tests_in.push(file);
    else{
        var m = file.match(/^(.*)\.out$/);
        if(m!==null){
            tests_out[m[1]+".in"]=fs.readFileSync(test_dir+file).toString().replace(/[\n\r]/g,'');
        }
    }
});

function loop(n){
    test = tests_in[n];
    var output="";
    output+="\033[36m";
    output+=' '.repeat(15).substr(0,15-test.length);
    output+=test;
    output+='...';
    output+=' '.repeat(5);
    output+="\033[0m";
    process.stdout.write(output);

    exec(`${bin} ${test_dir}/${test}`,(code,stdout,stderr)=>{
        var out = stdout.split("\n");
        var r = {
            name:test,
            time:out.length>=2?out[0]:null,
            passed:out.length>=2?out[1]===tests_out[test]:out[0]===tests_out[test]
        };
        if(r.passed)tests_ok.push(test);
        else        tests_er.push(test);
        var output="";
        output+=r.passed?"\033[32m":"\033[31m";
        output+=r.passed?"OK":"ERROR";
        if(r.time!==null)
        output+=` [${r.time+'0'.repeat(8).substr(0,8-(r.time+"").length)}]`;
        output+="\033[0m\n";
        process.stdout.write(output);
        if(++n<tests_in.length)
            setTimeout(()=>loop(n),0);
        else{
            process.stdout.write("\033[36m");
            console.log("-".repeat(50));
            console.timeEnd("All tests");
            process.stdout.write("\033[32m");
            console.log(`OK: ${tests_ok.length}`);
            if(tests_er.length)process.stdout.write("\033[31m");
            console.log(`ERROR: ${tests_er.length}`);
            process.stdout.write("\033[36m");
            console.log("-".repeat(50));
            process.stdout.write("\033[0m");
        }
    })
};
console.time("All tests");
process.stdout.write("\033[36m");
console.log("-".repeat(50));
console.log(`Running ${tests_in.length} tests.`);
console.log("-".repeat(50));
process.stdout.write("\033[0m");
loop(0);
