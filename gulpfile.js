var gulp = require('gulp');

var mocha = require('gulp-mocha');

/* Tests */
gulp.task('test', ['mocha']);

gulp.task('watch', function() {
	// Run server-side tests whenever a server-side test changes
	gulp.watch(['lib/**/*.js'], ['mocha']);
});

gulp.task('mocha', function() {
	// Run server-side tests once
	return gulp
		.src(['**/*.spec.js'])
		.pipe(mocha({ exit: true }));
});

/* Launch the app or parts of it */
gulp.task('start', function() {
  // Start the app
  nodemon({
  	script: 'index.js'
  });
});
