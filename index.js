'use strict';


const express = require('express');
const app = express();
app.listen(5000, () => console.log('listening on port 5000'));

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

app.get('/data', (req, res) => { // new
processFile('log.txt').then(function (data) {
    console.log(data);
    res.send(data);
  });
});


/**
 * Process the specified filename line by line and output results
 * @param {String} filepath - filepath of log file.
 */
const processFile = (filepath) => {

  const fs = require('fs');
  const readline = require('readline');

  let data = {};
  let errorTimeSeriesHourData = {};
  let errorsByServiceStats = {};
  let errorsByInstanceStats = {};
  let lineData = [];

  return new Promise((resolve, reject) => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(filepath)
    });

    lineReader.on('line', (line) => {
      const errorLine = line.match( /\[error\]/i);
      if (errorLine) {
        const serviceAndInstance = line.match(/\[([ab-z-0-9|\-]+)\s+([ab-z-0-9|\-]+)\]\:/i);
        if (serviceAndInstance && serviceAndInstance.length == 3) {
          lineData.push(line);
          const serviceName = serviceAndInstance[1];
          const instanceName = serviceAndInstance[2];
          errorsByServiceStats[serviceName] = (errorsByServiceStats[serviceName]) ? errorsByServiceStats[serviceName] + 1 : 1;
          errorsByInstanceStats[instanceName] = (errorsByInstanceStats[instanceName]) ? errorsByInstanceStats[instanceName] + 1 : 1;

          // Get UTC timestamp and add error to time series array
          const ISODateTime = line.match(/(.*?)\s/i)[0];
          const hour = 'H' + ISODateTime.match(/T(\d+):/i)[1];
          errorTimeSeriesHourData[hour] = (errorTimeSeriesHourData[hour]) ? errorTimeSeriesHourData[hour] + 1 : 1;
        }
      }
    });
    lineReader.on('close', () => {
      const nodeInstanceWithMostErrors = getItemWithHighestErrorCount(errorsByInstanceStats);
      const nodeInstanteWIthMostErrorsCount =  errorsByInstanceStats[nodeInstanceWithMostErrors];
      data = {
              errorsByServiceName: errorsByServiceStats, 
              errorsByInstance: errorsByInstanceStats, 
              mostProblematicnode: {node: nodeInstanceWithMostErrors, 
              errorCount: nodeInstanteWIthMostErrorsCount},
              errorTimeSeriesHourData: errorTimeSeriesHourData,
              rawData: lineData
              };
      resolve(data);
    });
  });
};


/**
 * Return name of item / property with the highest count / value.
 * @param {Object} oValues - Values.
 */
const getItemWithHighestErrorCount = (oValues) => {
  let count = -1;
  let maxProp = '';
  for (let property in oValues) {
    maxProp = oValues[property] > count ? property : maxProp;
    count = oValues[property] > count ? oValues[property] : count;
  }
  return maxProp;
};

// Process log file
processFile('log.txt').then(function (data) {
  console.log(data);
});


