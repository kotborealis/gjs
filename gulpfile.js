var gulp = require("gulp");
var _ = require('gulp-load-plugins')();
var path = require("path");

gulp.task('js',function(){
	return gulp.src(['./src/Graph.js','./src/GAlg.js','./src/CanvasManager.js','./src/Camera.js','./src/Gjs.js'])
        .pipe(_.sourcemaps.init())
        .pipe(_.concat('build.js'))
        .pipe(_.sourcemaps.write('.'))
        .pipe(gulp.dest('./js'))
});