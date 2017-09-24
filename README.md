# Phone Book

## Overview

_The phone book should allow listing available contacts and searching through them. Listed contacts should be sorted alphabetically by Name. A user should be able to search for a contact using a query that represents either a contact name or a contact phone number. A user should also be able to remove a contact from the phone book. The phone book can hold up to 10,000 contacts_

## Notes

- I used Vanilla Javascript in this task because i didn't add any transpiler or polyfill.
- I added comments with "ES6" to provide alternative way to handle in ES6.
- You can use http-server by installing it with npm to be able to load JSON file.

## Complexities

- Searching: I used O(nk) algorithm n represents number of contacts, k represents number of characters in string, I didn't use Binary search because we need to search with both on phone and name "like based". 
- Adding: I used O(nlogn) Binary Insertion to insert item in sorted array.

## Future Work

I will try hard to create react app to handle this task with an interface if I was lucky and have enough time :)


![alt text](https://preview.ibb.co/cza4g5/Screen_Shot_2017_09_24_at_11_25_38_PM.png)
