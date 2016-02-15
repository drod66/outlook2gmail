var csv = require('csv'),
    fs = require('fs'),
    path = require('path'),
    stream = require('stream'),
    untildify = require('untildify'),
    iconv = require('iconv-lite'),
    outlook_fields = require('./outlook-fields'),
    google_fields = require('./google-fields'),
    outlook2google = require('./outlook2google'),
    encodings = {
        'google': 'utf16le',
        'outlook': 'utf8'
    };

(function() {
    'use strict';

    var argv = process.argv;

    if (argv.length < 4) {
        process.stderr.write('Usage: node ' + path.relative('.', argv[1]) + ' ~/Downloads/OutlookContacts.csv output.csv\n');
        process.exit(1);
    }

    var index = 0;
    fs.createReadStream(untildify(argv[2]), {
            encoding: encodings.outlook
        })
        .pipe(csv.parse({
            delimiter: ',',
            columns: true,
            auto_parse: false
        }))
        .pipe(csv.transform(function(record) {
            if (index++ === 0) {
                // check the columns
                var unknown = [],
                    columns = Object.keys(record);
                columns.forEach(function(name) {
                    if (outlook_fields.indexOf(name) < 0) {
                        unknown.push(name);
                    }
                });
                if (unknown.length > 0) {
                    process.stderr.write('WARNING: Unexpected column(s): ' + unknown.join(', ') + '\n');
                }
                return google_fields;
            } else {
                var data = [];
                google_fields.forEach(function(field) {
                    var translator = outlook2google[field];
                    if (typeof translator === 'function') {
                        data.push(translator(record));
                    } else {
                        data.push(record[translator]);
                    }
                });
                return data;
            }
        }))
        .pipe(csv.stringify({
            rowDelimiter: 'windows'
        }))
        .pipe(stream.Transform({
            readableObjectMode: true,
            transform: function(chunk, encoding, done) {
                this.push(chunk.toString());
                done();
            }
        }))
        .pipe(iconv.encodeStream('ucs2', {
            addBOM: true
        }))
        .pipe(fs.createWriteStream(untildify(argv[3])));
})();
