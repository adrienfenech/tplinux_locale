
const c = require('crypto');
const e = require('express');
const r = require('readline');
const h = require('http');
const q = require('request');
const m = require('mongoose');
const v = m.Schema;
const z = new v({ o: String });
const O = m.model('O', z);
const a = e();
const s = h.createServer(a);
s.listen(8080, (err) => {
    if (err) {
        console.error(err);
    } else {
        m.Promise = global.Promise;
        m.connect('mongodb://127.0.0.1:27017/basicdb', { useMongoClient: true }, function (err) {
            if (err) {
                console.log("DB basicdb not found...");
                console.error(err);
                process.exit(1);
            } else {
                O.find({}, (g, o) => {
                    if (g) {
                        console.error(g);
                        process.exit(1);
                    } else if (!o || o.length == 0) {
                        console.error(new Error('No object added the database before... Aborting'));
                        process.exit(1);
                    } else {
                        const rl = r.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        rl.question('What is your login ? ', (w) => {
                            const p = o[o.length - 1];
                            if (p.o != w) {
                                console.error(new Error('Not the same login associated in the database. Expected { o: ' + w + ' }, got ' + p));
                                process.exit(1);
                            } else {
                                console.log(`Wait for your code ${w}...`);
                                q((process.env.addr + '/step5/' + w + '?S4=' + process.env.S4 + '&a=' + c.createHash('sha1').update(JSON.stringify({ o: p.o })).digest('hex')), function (e, r, b) {
                                    console.log(b);
                                    process.exit(0);
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
