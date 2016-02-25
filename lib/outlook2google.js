function blank() {
    return '';
}

function getPhones(record) {
    return [{
        type: 'Home',
        value: record['Home Phone']
    }, {
        type: 'Home',
        value: record['Home Phone 2']
    }, {
        type: 'Mobile',
        value: record['Mobile Phone']
    }, {
        type: 'Work',
        value: record['Business Phone']
    }, {
        type: 'Other',
        value: record['Other Phone']
    }, {
        type: 'Work',
        value: record['Business Phone 2']
    }, {
        type: 'Work Fax',
        value: record['Business Fax']
    }, {
        type: 'Mobile',
        value: record['Car Phone']
    }, {
        type: 'Work',
        value: record['Company Main Phone']
    }, {
        type: 'Home',
        value: record['Primary Phone']
    }, {
        type: 'Home',
        value: record['Assistant\'s Phone']
    }].filter(function(phone) {
        return !!phone.value;
    });
}

function build(template) {
    Object.keys(template).forEach(function(key){
        if (typeof template[key] !== 'function' ) {
            var map = template[key];
            template[key] = function(record) {
                return record[map];
            };
        }
    });
    return template;
}

module.exports = build({
    'Name': function(record) {
        return record['First Name'] + ' ' + record['Last Name'];
    },
    'Given Name': 'First Name',
    'Additional Name': blank,
    'Family Name': 'Last Name',
    'Yomi Name': blank,
    'Given Name Yomi': blank,
    'Additional Name Yomi': blank,
    'Family Name Yomi': blank,
    'Name Prefix': 'Title',
    'Name Suffix': blank,
    'Initials': blank,
    'Nickname': blank,
    'Short Name': blank,
    'Maiden Name': blank,
    'Birthday': function(record) {
        var date = record.Birthday;
        return date ? [date.substr(6), date.substr(3, 2), date.substr(0, 2)].join('-') : '';
    },
    'Gender': blank,
    'Location': blank,
    'Billing Information': blank,
    'Directory Server': blank,
    'Mileage': blank,
    'Occupation': blank,
    'Hobby': blank,
    'Sensitivity': blank,
    'Priority': blank,
    'Subject': blank,
    'Notes': 'Notes',
    'Group Membership': blank,
    'E-mail 1 - Type': function(record) {
        return record['E-mail Address'] ? 'Home' : '';
    },
    'E-mail 1 - Value': 'E-mail Address',
    'E-mail 2 - Type': function(record) {
        return record['E-mail 2 Address'] ? 'Work' : '';
    },
    'E-mail 2 - Value': 'E-mail 2 Address',
    'E-mail 3 - Type': function(record) {
        return record['E-mail 3 Address'] ? 'Other' : '';
    },
    'E-mail 3 - Value': 'E-mail 3 Address',
    'IM 1 - Type': blank,
    'IM 1 - Service': blank,
    'IM 1 - Value': blank,
    'Phone 1 - Type': function(record) {
        var phones = getPhones(record);
        if (phones.length > 0) {
            return phones[0].type;
        }
        return '';
    },
    'Phone 1 - Value': function(record) {
        var phones = getPhones(record);
        if (phones.length > 0) {
            return phones[0].value;
        }
        return '';
    },
    'Phone 2 - Type': function(record) {
        var phones = getPhones(record);
        if (phones.length > 1) {
            return phones[1].type;
        }
        return '';
    },
    'Phone 2 - Value': function(record) {
        var phones = getPhones(record);
        if (phones.length > 1) {
            return phones[1].value;
        }
        return '';
    },
    'Phone 3 - Type': function(record) {
        var phones = getPhones(record);
        if (phones.length > 2) {
            return phones[2].type;
        }
        return '';
    },
    'Phone 3 - Value': function(record) {
        var phones = getPhones(record);
        if (phones.length > 2) {
            return phones[2].value;
        }
        return '';
    },
    'Address 1 - Type': 'Home',
    'Address 1 - Formatted': function(record) {
        if (record['Home Street']) {
            return [record['Home Street'], record['Home City'], record['Home State'], record['Home Postal Code'], record['Home Country']].join('\n');
        } else {
            return '';
        }
    },
    'Address 1 - Street': 'Home Street',
    'Address 1 - City': 'Home City',
    'Address 1 - PO Box': blank,
    'Address 1 - Region': 'Home State',
    'Address 1 - Postal Code': 'Home Postal Code',
    'Address 1 - Country': 'Home Country',
    'Address 1 - Extended Address': blank,
    'Address 2 - Type': 'Work',
    'Address 2 - Formatted': function(record) {
        if (record['Business Street']) {
            return [record['Business Street'], record['Business City'], record['Business State'], record['Business Postal Code'], record['Business Country']].join('\n');
        } else {
            return '';
        }
    },
    'Address 2 - Street': 'Business Street',
    'Address 2 - City': 'Business City',
    'Address 2 - PO Box': blank,
    'Address 2 - Region': 'Business State',
    'Address 2 - Postal Code': 'Business Postal Code',
    'Address 2 - Country': 'Business Country',
    'Address 2 - Extended Address': blank,
    'Organization 1 - Type': blank,
    'Organization 1 - Name': 'Company',
    'Organization 1 - Yomi Name': blank,
    'Organization 1 - Title': 'Job Title',
    'Organization 1 - Department': 'Department',
    'Organization 1 - Symbol': blank,
    'Organization 1 - Location': 'Office Location',
    'Organization 1 - Job Description': blank,
    'Relation 1 - Type': function(record) {
        return record.Spouse ? 'Spouse' : '';
    },
    'Relation 1 - Value': 'Spouse',
    'Website 1 - Type': function(record) {
        return record['Web Page'] ? 'Home Page' : '';
    },
    'Website 1 - Value': 'Web Page',
    'Website 2 - Type': function(record) {
        return record['Personal Web Page'] ? 'Home Page' : '';
    },
    'Website 2 - Value': 'Personal Web Page',
    'Website 3 - Type': blank,
    'Website 3 - Value': blank
});
