# Dev Challenge

Create a program in Node.js where the input defined in input.csv is parsed and organized into the content shown in output.json. (see examples on section Examples)

## Requiriments

1. Write your program in only one file (like index.js) and write the output to a file (output.json) instead of printing it to logs or on the screen.

2. JSON order is not important, but its content is. The program should output the same content (not necessarily the same order) if column order is changed.

3. Don't hard code the tags shown, meaning tags could be changed to "email Responsible Parent Pedagogical Financial" and it should still parse accordingly.

## Examples
Here are two examples of inputs and the outputs your code should generate for each one:

## Tips
1. Some libraries that may be useful, but not required:
https://lodash.com/
https://www.npmjs.com/package/google-libphonenumber

2. Code considering all your files are on the same directory, like below:
```sh
├── challenge
│   ├── index.js
│   ├── input.csv
│   ├── output.json
```

3. Using a package.json file for this test is not mandatory but it is a good practice, if you don't, consider providing the exact versions of node and any other lib used in some other way

## What will we consider?

* Succinct code
* Great and descriptive methods and variables
* Clear thinking skills
* Efficient code
* Code documentation is not really important if your code is simple, easy to read and understand