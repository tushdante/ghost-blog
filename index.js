// # Ghost bootloader
// Orchestrates the loading of Ghost
// When run from command line.

var express,
    ghost,
    parentApp,
    errors;

// Make sure dependencies are installed and file system permissions are correct.
require('./core/server/utils/startup-check').check();

// Proceed with startup
express = require('express');
ghost = require('./core');
errors = require('./core/server/errors');


// Create our parent express app instance.
//parentApp = express();

app = express();

/*
ghost().then(function (ghostServer) {
    // Mount our ghost instance on our desired subdirectory path if it exists.
    parentApp.use(ghostServer.config.paths.subdir, ghostServer.rootApp);

    // Let ghost handle starting our server instance.
    ghostServer.start(parentApp);
}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
*/

ghost()
.then(function (app) {

    var settings = require('./core/server/api').settings;

    settings
        .read({key: 'activeTheme', context: {internal: true}})
        .then(function (result) {

            try {
                require('./content/themes/' + result.settings[0].value + '/index')();
            }
            catch (e) {
                //No custom index found, or it wasn't a proper module.
            }

        });

    //app.start was added to master, but not present in 0.5.0 initially.
    if(app.start) { app.start(); }
})
.catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
});
