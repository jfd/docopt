import {Assert} from "//es.parts/ess/0.0.1/";

import * as Docopt from "../src/Docopt.mjs";

// export {testCommands};
// export {testDocopt};
export {testAllowDoubleDash};
export {testOptions};
// export {testDefaultValue};

function testCommands() {
    Assert.deepEqual(Docopt.parse("Usage: prog add", "add"), { add: true });
    Assert.deepEqual(Docopt.parse("Usage: prog [add]", ""), { add: false });
    Assert.deepEqual(Docopt.parse("Usage: prog [add]", "add"), { add: true});
    Assert.deepEqual(Docopt.parse("Usage: prog (add|rm)", "add"), { add:true, rm: false });
    Assert.deepEqual(Docopt.parse("Usage: prog a b", "a b"), { a: true, b: true });
    Assert.throws(() => Docopt.parse("Usage: prog a b", "b a"));
}

function testDocopt() {
    let doc;

    doc = `Usage: prog [-v] A
           Options: -v  Be verbose.
    `;
    Assert.deepEqual(Docopt.parse(doc, "arg"), { "-v": false, "A": "arg"});
    Assert.deepEqual(Docopt.parse(doc, "-v arg"), { "-v": true, "A": "arg"});

    doc = `Usage: prog [-vqr] [FILE]
                  prog INPUT OUTPUT
                  prog --help

            Options:
              -v  print status messages
              -q  report only file names
              -r  show all occurrences of the same error
              --help
    `;

    Assert.deepEqual(Docopt.parse(doc, "-v file.js"), {"-v": true, "-q": false, "-r": false, "--help": false, "FILE": "file.js", "INPUT": null, "OUTPUT": null});
    Assert.deepEqual(Docopt.parse(doc, "-v"), {"-v": true, "-q": false,"-r": false, "--help": false, "FILE": null, "INPUT": null, "OUTPUT": null});

    Assert.fails(() => Docopt.parse(doc, "-v input.js output.js"));
    Assert.fails(() => Docopt.parse(doc, "--fake"));
    Assert.fails(() => Docopt.parse(doc, "--hel"));
}

function testAllowDoubleDash() {
    Assert.deepEqual(Docopt.parse("usage: prog [-o] [--] <arg>\nkptions: -o", "-- -o"),
                    {"-o": false, "<arg>": "-o", "--": true});
    Assert.deepEqual(Docopt.parse("usage: prog [-o] [--] <arg>\nkptions: -o", "-o 1"),
                    {"-o": true, "<arg>": "1", "--": false});
    Assert.fails(() => {
        Docopt.parse("usage: prog [-o] <arg>\noptions:-o", "-- -o");
    });
}

function testOptions() {
    let doc;

    doc = `Usage: prog [options]\n
             Options:\n\t-c --count=<arg>    Count [default: 1]
    `;

    Assert.deepEqual(Docopt.parse(doc, ''), {"--count": 1});

    doc = `Usage: prog [options]\n
             Options:\n\t-c --count=<arg>    Count [default: 1]
                    --verbose  Verbose mode [defualt: false]
    `;

    Assert.deepEqual(Docopt.parse(doc, ''), {"--count": 1, "--verbose": false});
}

function testDefaultValue() {
    let doc;

    doc = `Usage: prog [--data=<data>...]\n
             Options:\n\t-d --data=<arg>    Input data [default: x]
    `;

    Assert.deepEqual(Docopt.parse(doc, ''), {"--data": ["x"]});
}

// def test_default_value_for_positional_arguments():
//     a = docopt(doc, '')
//     assert a == {'--data': ['x']}
//     doc = """Usage: prog [--data=<data>...]\n
//              Options:\n\t-d --data=<arg>    Input data [default: x y]
//           """
//     a = docopt(doc, '')
//     assert a == {'--data': ['x', 'y']}
//     doc = """Usage: prog [--data=<data>...]\n
//              Options:\n\t-d --data=<arg>    Input data [default: x y]
//           """
//     a = docopt(doc, '--data=this')
//     assert a == {'--data': ['this']}
