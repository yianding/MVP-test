
# requirements:
## 1,run windows system.
## 2,install curl first
## 3,install python 3.11.8
## 4,install MSVC v143 - VS 2022 C++ x64/x86 Build Tools,Include Windows 10/11 SDK
## 5,node version 20.19.0
# How to use
```bash
npm install

npm start
```


# API TEST on windows cmd terminal

## create (POST)

curl -X POST http://localhost:3002/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"task 1 \",\"description\":\"test on windows\",\"status\":\"pending\"}"

## Get all tasks (GET)

d:\curl\bin\curl http://localhost:3002/api/tasks

## Get single task (GET with ID)

curl http://localhost:3002/api/tasks/1

## Update task (PUT)

curl -X PUT http://localhost:3002/api/tasks/1 -H "Content-Type: application/json" -d "{\"status\":\"in-progress\"}"

## Delete Task (DELETE)

curl -X DELETE http://localhost:3002/api/tasks/1