var csv = require('csv'),
    fs = require('fs'),
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

function convert(inputFile, outputFile) {
    'use strict';

    var index = 0;
    fs.createReadStream(untildify(inputFile), {
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
                    process.stderr.write('WARNING: Unexpected column(s):\n - ' + unknown.join('\n - ') + '\n');
                }
                return google_fields;
            } else {
                var data = [];
                google_fields.forEach(function(field) {
                    var value = outlook2google[field](record);
                    data.push(value ? value.replace(/\n/g, ' ') : '');
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
        .pipe(iconv.encodeStream(encodings.google, {
            addBOM: true
        }))
        .pipe(fs.createWriteStream(untildify(outputFile)));
}

module.exports = convert;
