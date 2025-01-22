const fs = require('fs');

const info = (req, res, next, data) => {
    const date = new Date()
    const log = `${date.toISOString()} | INFO | ${req.method} | ${req.originalUrl} | ${data}\n`
    fs.appendFileSync(__dirname + "/logs/info.log",log)
    
};

const error = (req, res, next, data) => {
    const date = new Date()
    const log = `${date.toISOString()} | ERROR | ${req.method} | ${req.originalUrl} | ${data}\n`
    fs.appendFileSync(__dirname + "/logs/info.log",log)
    
};

const warning = (req, res, next, data) => {
    const date = new Date()
    const log = `${date.toISOString()} | WARNING | ${req.method} | ${req.originalUrl} | ${data}\n`
    fs.appendFileSync(__dirname + "/logs/info.log",log)
    
};

const debug = (req, res, next, data) => {
    const date = new Date()
    const log = `${date.toISOString()} | DEBUG | ${req.method} | ${req.originalUrl} | ${data}\n`
    fs.appendFileSync(__dirname + "/logs/debug.log",log)
    
};

module.exports = {info,error,warning,debug}