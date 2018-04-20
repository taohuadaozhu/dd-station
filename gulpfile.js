/**
 * Created by guizhong on 15/8/4.
 */

var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var bs = require("browser-sync");
var webpack = require("webpack");
// var pngquant = require('imagemin-pngquant');
var babel = require('gulp-babel');

const minimist = require('minimist')
const gutil = require('gulp-util')
//默认development环境
var knowOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
}

var options = minimist(process.argv.slice(2), knowOptions)
//生成filename文件，存入string内容
function string_src(filename, string) {
    var src = require('stream').Readable({
        objectMode: true
    })
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }))
        this.push(null)
    }
    return src
}
gulp.task('constants', function () {
    //读入config.json文件
    var myConfig = require('./config.json')
    console.log(myConfig);
    //取出对应的配置信息
    var envConfig = myConfig[options.env]
    console.log(options.env,envConfig);
    var conConfig = 'httpUrl = ' + JSON.stringify(envConfig)
    //生成config.js文件
    return string_src("http.min.js", conConfig)
        .pipe(gulp.dest('dist/js/'))
});
gulp.task('less', function () {
    return gulp.src("src/less/*.less")
        .pipe($.less())
        .pipe($.autoprefixer('last 2 version', 'ios 7', 'android 4'))
        //.pipe($.minifyCss())
        .pipe($.rename(function (path) {
            path.dirname = path.dirname.replace('less', 'css');
            path.basename = path.basename.replace('.main', '');
        }))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function () {
    return gulp.src('src/js/**/*')
        //.pipe($.uglify())  //使用uglify进行压缩
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'));
});


gulp.task('img', function () {
    return gulp.src('src/images/**/*')
        // .pipe($.imagemin({
        //     progressive: true,
        //     use: [pngquant()] //使用pngquant来压缩png图片
        // }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function () {
    $.livereload.listen();

    var changed = [];

    gulp.watch("src/**/*.html", ['html', pop]).on('change', push);

    gulp.watch('src/**/*.js', ['js', pop]).on('change', push);

    gulp.watch("src/less/*.less", ['less', pop]).on('change', push);


    function push(s) {
        changed.push(s);
    }

    function pop() {
        while (changed.length > 0) {
            var s = changed.pop();
            console.log(s);
            $.livereload.changed(s);
            bs.reload();
        }
    }
});

gulp.task('build', ['less', 'html', 'js', 'img', 'constants']);

gulp.task("default", function () {

    bs({
        server: "./dist",
        port: 80
    });
    gulp.start('watch');
});