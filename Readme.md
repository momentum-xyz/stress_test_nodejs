# Odyssey platform stress test
This is a nodejs script that will stress test the Odyssey platform. 

It will simulate the bevaiour of the users and keep given number of active dialogs sending requests and receiving responses, while printing some simple stats.

## Install

Git clone the repo and run the following commands to install the dependencies:

```
cd stress_test
npm i
```

## Run the stress test

```
node index.js [<url_base>=http://localhost] [<active_dialogs_count> = 2]
```

Example:

```
node index.js https://odyssey.org 5
```