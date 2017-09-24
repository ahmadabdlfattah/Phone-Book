//**************************************************************************************************************************************************************************
//* Description: This javascript file represents a phone book with basic functions to manipulate contacts through (Add, remove, search and list) functions
//* Using:
//* Vanilla Javascript - We don't use ES6 as we don't add any transpiler or polyfill, but I mention to ES6 code through comments inside code
//**************************************************************************************************************************************************************************

//**************************************************************************************************************************************************************************
//* PHONE BOOK CLASS
//**************************************************************************************************************************************************************************

//ES6: we can create this as class with constructor function
var PhoneBook = function() {
    // constructor code
    //Initialize contacts list with empty array
    this.contacts = [];

    //Load JSON mock data
    loadJSON((function(data) {
        if (data && data.length > 0) {
            //sort returned data by name alphabetically
            this.contacts = data.sort(compareContactsAlphabet);
            console.log(this.contacts);
        } else {
            //error handling
            console.log("Returned empty contacts list!");
        }
    }).bind(this));
    //ES6: Instead of using bind function, we can use arrow function in ES6 ()=> to take surrounding context by default.
};

//**************************************************************************************************************************************************************************
//* PHONE BOOK MAIN FUNCTIONS (Add, Remove, Search and List)
//**************************************************************************************************************************************************************************

PhoneBook.prototype = {
    //Add new contact to contacts list
    //**contactInfo: object: {name: string, phone: number, email: string}
    add: function(contactInfo) {
        //validate contacts info first
        if (validateContactInfo(contactInfo)) {
            //Binary Insert
            var position = binaryInsert(contactInfo, this.contacts);

            return "New contact is inserted in the contacts list. contacts count: " + this.contacts.length;
        } else {
            return "Failed to add new contact, Please review contact details.";
        }
    },

    //Remove contact from contacts list
    //**index: number: index of contact in array
    remove: function(index) {
        if (typeof(index) === 'number') {
            //remove contact
            this.contacts.splice(index, 1);
            return "this contact is deleted from contacts list. contacts count: " + this.contacts.length;
        } else {
            return "Please pass valid arguments.";
        }
    },
    //Search for contact in contacts list
    //**query: string: may be name or phone (like based)
    search: function(query) {

        var fieldName = '';
        var excludedChar;

        if (query) {
            //remove '-' char from phone string
            query = query.replace(/-/g, '');
            //check query type
            if (query && isNaN(query)) {
                fieldName = "name";
            } else {
                fieldName = "phone";
                excludedChar = /-/g;
            }
            //find all matched contacts with this query
            return findAllMatchedContacts(this.contacts, fieldName, query, excludedChar);
        } else {
            return "Please pass valid arguments";
        }
    },
    //List array of contacts based on number of items in page
    //**contactsPerPage: number: contacts per page
    //**page: number: page number
    list: function(contactsPerPage, page) {
        var viewContacts = [];

        if (!contactsPerPage && !page) {
            viewContacts = this.contacts;
        } else if (typeof(contactsPerPage) === 'number' && typeof(page) === 'number') {
            var firstPoition = contactsPerPage * page;
            var secondPoition = contactsPerPage + firstPoition;
            viewContacts = this.contacts.slice(firstPoition, secondPoition);
        } else {
            //error handling
            console.log("Please pass valid arguments");
        }

        return viewContacts;
    },
};

//**************************************************************************************************************************************************************************
//* HELPER FUNCTIONS
//**************************************************************************************************************************************************************************

//Load JSON File (mock-data)
//**callback: function: callback when JSON file is loaded
function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/mock-data.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

//Compare contacts alphabetically
//**a: string: first element
//**b: string: second element
function compareContactsAlphabet(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
}

//Validate all contacts info (name, email, phone)
//**contactInfo: object: {name: string, phone: number, email: string}
function validateContactInfo(contactInfo) {
    var testPassed = true;
    if (contactInfo) {

        if (contactInfo.name && typeof(contactInfo.name) === "string" && contactInfo.name.length < 100) {
            testPassed = testPassed && true;
        } else {
            console.log("Invalid name. it must be less than 100 characters");
            testPassed = testPassed && false;
        }

        var phoneNumberRegex = /\d{2}-\d{3}-\d{4}/;
        if (contactInfo.phone && contactInfo.phone.match(phoneNumberRegex)) {
            testPassed = testPassed && true;
        } else {
            console.log("Invalid phone number. it must matches xx-xxx-xxxx");
            testPassed = testPassed && false;
        }

        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (contactInfo.email && contactInfo.email.match(emailRegex)) {
            testPassed = testPassed && true;
        } else {
            console.log("Invalid email address.");
            testPassed = testPassed && false;
        }

    }
    return testPassed;
}

//Find all matched array
//**arr: array: contacts list
//**fieldName: string: field name (phone or name)
//**value: string: query
//**excludedChar: string: excluded chars to ignor while searching e.g. '-'
function findAllMatchedContacts(arr, fieldName, value, excludedChar) {
    var matchedItems = [];
    var target = value.toLowerCase();
    for (var i = 0; i < arr.length; i++) {
        var contact = (arr[i][fieldName] && excludedChar) ? arr[i][fieldName].replace(excludedChar, '') : arr[i][fieldName];
        if (contact.toLowerCase().indexOf(target) != -1) {
            matchedItems.push(arr[i]);
        }
    }

    return matchedItems;
}

//Insert in contacts list using Binary insert (sorted array)
//**value: object: contacts info
//**array: array: contacts list
//**startVal: number: iterator 1
//**endVal: number: iterator 2
function binaryInsert(value, array, startVal, endVal) {
    //don't insert duplicates
    var length = array.length;
    var start = typeof(startVal) != 'undefined' ? startVal : 0;
    var end = typeof(endVal) != 'undefined' ? endVal : length - 1;
    var m = start + Math.floor((end - start) / 2);

    if (length === 0) {
        array.push(value);
        return array.length;
    }

    if (value.name > array[end].name) {
        array.splice(end + 1, 0, value);
        return end + 1;
    }

    if (value.name < array[start].name) {
        array.splice(start, 0, value);
        return start;
    }

    if (start >= end) {
        return;
    }

    if (value.name < array[m].name) {
        binaryInsert(value, array, start, m - 1);
        return m - 1;
    }

    if (value.name > array[m].name) {
        binaryInsert(value, array, m + 1, end);
        return m + 1;
    }
}

//**************************************************************************************************************************************************************************
//* OBJECT CREATION
//**************************************************************************************************************************************************************************

var myPhoneBook = new PhoneBook();
