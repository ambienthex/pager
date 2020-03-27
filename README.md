## Problem:

Given the attached logfile (log.txt), write an app that parses the log file and 
outputs the following information to `stdout`:

1. Amount of errors by service name
2. Instance id of the service instance with most errors

### Examples:

```
[api-gateway]:  17 errors
[ffd3082fe09d]: 17/17 errors
```

> **NOTE**: these are just for validation purposes, you don't have to match the format

### Hints:

Note the app log has the following format: `%DATE% [service-name instance-id]: log-trace`
Errors include the `[error]` string on the trace.

Think about how you would handle concurrent calls to you app and things like
file access and size.

### Optional:

  - Dockerize your app.
  - Expose a common API for you app so that it can be reached through HTTP,
    preferably using a RESTful approach
    
    
# Solution
    
## Basic Instructions:
1. unzip homework.zip
2. npm install
3. node index.js
4. navigate to http://localhost:5000/ to see the log stats

## Dockerization Instructions:

1. docker build -t smofo/pager-homework .
2. docker run -p 49160:5000 -d smofo/pager-homework
3. docker ps
4.navigate to http://localhost:49160

## Errors by Service Pie Chart:
![image](https://raw.githubusercontent.com/ambienthex/pager/master/images/img0001.png)

## Errors by Instance Pie Chart:
![image](https://raw.githubusercontent.com/ambienthex/pager/master/images/img0002.png)

## Aggregate Errors by Hour Line Chart:
![image](https://raw.githubusercontent.com/ambienthex/pager/master/images/img0003.png)

## Raw relevant error logs
![image](https://raw.githubusercontent.com/ambienthex/pager/master/images/img0004.png)

