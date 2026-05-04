var appRoot = require('app-root-path');
var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    new winston.transports.File({
      filename: `${appRoot}/logs/error.log`,
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: `${appRoot}/logs/exceptions.log` })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  new winston.transports.File({ filename: `${appRoot}/logs/exceptions.log` })
);

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};


module.exports = logger;
