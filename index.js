var path = require('path'),
    convert = require('./lib/convert');

(function() {
    'use strict';

    var argv = process.argv;

    if (argv.length < 4) {
        process.stderr.write('Converts a Outlook contacts CSV file into a Google CSV file.');
        process.stderr.write('Usage: node ' + path.relative('.', argv[1]) + ' ./OutlookContacts.csv ./google.csv\n');
        process.exit(1);
    }

    // convert the CSV file
    convert(argv[2], argv[3]);
})();
