var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    //.enableVersioning(Encore.isProduction())
    .addEntry('js/app', './assets/js/app.js')
    .addEntry('js/feedReader', './assets/js/feedReader.jsx')
    .enableReactPreset()
    .addStyleEntry('css/bootstrap', './assets/css/bootstrap.css')

    // uncomment if you use Sass/SCSS files
    // .enableSassLoader()

    // uncomment for legacy applications that require $/jQuery as a global variable
    // .autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
