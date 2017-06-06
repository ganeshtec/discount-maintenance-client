/* eslint-disable no-console */
var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpSequence = require('gulp-sequence');
var ngHtml2Js = require('gulp-ng-html2js');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var karma = require('karma').Server;
var flatten = require('gulp-flatten');
var eslint = require('gulp-eslint');;
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

var input = {
        'source_html': [
            'src/include/*.html',
            'src/js/**/*.html'
        ],
        'source_js': [
            'src/js/**/*.js'
        ],
        'source_css': [
            'src/**/*.css'
        ],
        'vendor_css': [
            'node_modules/angular-material/angular-material.min.css',
            'node_modules/font-awesome/css/font-awesome.min.css'
        ],
        'static_assets': [
            'src/**/*'
        ],
        'js_lib': [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/angular/angular.min.js',
            'node_modules/angular-animate/angular-animate.min.js',
            'node_modules/angular-aria/angular-aria.min.js',
            'node_modules/angular-material/angular-material.min.js',
            'node_modules/angular-cookies/angular-cookies.min.js',
            'node_modules/angular-route/angular-route.min.js',
            'node_modules/moment/moment.js'
        ],
        'fonts': [
            'node_modules/font-awesome/fonts/*'
        ],
        'cleanup_items': [
            'public/**/*'
        ]
    },
    output = {
        'css': 'public/assets/css',
        'javascript': 'public/assets/js',
        'images': 'public/assets/images',
        'fonts': 'public/assets/fonts',
        'html': 'public'
    }

/* Pre-build clean */
gulp.task('prebuild:clean', function () {
    return del(input.cleanup_items);
});

/* Copy fonts */
gulp.task('copy:fonts', function () {
    return gulp.src(input.fonts)
        .pipe(gulp.dest(output.fonts));
});

/* Copy fonts */
gulp.task('copy:html', function () {
    return gulp.src(input.source_html)
        .pipe(flatten())
        .pipe(gulp.dest(output.html));
});
/* Copy fonts */
gulp.task('copy:index', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('public'));
});
gulp.task('copy:devUrls', function () {
    return gulp.src('env_config/dev/urls.js')
        .pipe(gulp.dest('public/assets/js'));
});
gulp.task('copy:adUrls', function () {
    return gulp.src('env_config/ad/urls.js')
        .pipe(gulp.dest('public/assets/js'));
});
gulp.task('copy:qaUrls', function () {
    return gulp.src('env_config/qa/urls.js')
        .pipe(gulp.dest('public/assets/js'));
});
gulp.task('copy:prodUrls', function () {
    return gulp.src('env_config/prod/urls.js')
        .pipe(gulp.dest('public/assets/js'));
});
/* Concat js files */
gulp.task('concat:js', function () {
    return gulp.src(input.source_js)
        .pipe(concat('source.min.js'))
        .pipe(gulp.dest(output.javascript));
});

/* Concat js files */
gulp.task('concat:vendor-js', function () {
    return gulp.src(input.js_lib)
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(output.javascript));
});

/* Lint js files in /src */
gulp.task('lint', function () {
    return gulp.src(['src/js/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/* Build vendor css */
gulp.task('build:vendor-css', function () {
    return gulp.src(input.vendor_css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(output.css));
});

/* Compile scss to css */
gulp.task('build:css', function () {
    return gulp.src(input.source_css)
        .pipe(sass())
        .pipe(concat('source.css'))
        .pipe(gulp.dest(output.css));
});

/* Convert html to js */
gulp.task('html2js', function () {
    return gulp.src(input.source_html)
        .pipe(ngHtml2Js({
            moduleName: 'component-templates'
        }))
        .pipe(concat('templates.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(output.javascript));
});
/* Watch files w/o server */
gulp.task('watch', ['srcbuild'], function () {
    browserSync({
        server: {
            baseDir: 'public'
        }
    });
    gulp.watch(['src/**/*'], ['serve']);
});

gulp.task('develop', function () {
    nodemon({
        script: 'server.js',
        ext: 'html js scss css',
        ignore: [
            'node_modules/',
            'public/',
            'test/',
            'gulpfile.js',
            'server.js',
            'karma.conf.js'
        ],
        tasks: ['build-dev']
    })
    .on('restart', function () {
        console.log('restarted!')
    })
})


/* Start browser-sync */
gulp.task('browser-sync', function () {
    browserSync({
        proxy: 'localhost:8001',
        port: 8002,
        notify: false,
        host: 'localhost.homedepot.com',
        open: 'external'
    });
});

/* Run unit tests, but run build first */
gulp.task('test', ['srcbuild'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
    }, function (code) {
        if (code === 1) {
            done('karma: tests failed with code ' + code);
        } else {
            done();
        }
    });
});

gulp.task('buildArtifact', () =>
    gulp.src(['!./node_modules/**', 'node_modules','**' ])
        .pipe(tar('archive.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('public'))
);

gulp.task('srcbuild', [ 'concat:vendor-js', 'concat:js', 'build:vendor-css', 'build:css', 'copy:index', 'copy:html', 'copy:fonts']);
gulp.task('build-prod', gulpSequence('prebuild:clean', 'srcbuild', 'copy:prodUrls'));
gulp.task('build-qa', gulpSequence('prebuild:clean', 'srcbuild', 'copy:qaUrls'));
gulp.task('build-ad', gulpSequence('prebuild:clean', 'srcbuild', 'copy:adUrls'));
gulp.task('build-dev', gulpSequence('prebuild:clean', 'srcbuild', 'copy:devUrls'));
gulp.task('package', gulpSequence('build-dev', 'buildArtifact'));
gulp.task('dev', gulpSequence('prebuild:clean', 'srcbuild', 'copy:devUrls', 'develop', 'browser-sync'));
gulp.task('serve', ['srcbuild'], reload);
gulp.task('default', gulpSequence('prebuild:clean', 'srcbuild'));
