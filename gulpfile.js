let gulp = require('gulp');
let browserSync = require('browser-sync');


gulp.task('browser-sync', function() {
    browserSync({
        // Using a localhost address with a port
        proxy: "pndmoni.local",

        files: [
            "public/build/js/*.*",
            "public/build/css/*.*",
            "templates/*.twig"
        ]
    }, function(err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });
});


gulp.task('default', ['browser-sync']);