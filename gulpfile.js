const gulp = require('gulp');
const ts = require("gulp-typescript");
const path = require("path");
const copy = require("gulp-copy");

/**
 * Loading tsconfig.json
 */
const project = ts.createProject("tsconfig.json");

/**
 * Task to compile TypeScript 
 */
gulp.task("compile", () => {
    return project.src()
                .pipe(project())
                .pipe(gulp.dest("dist"));
});

/**
 * Task to copy template files to dist
 */
gulp.task("copy-templates", () => {
    return gulp.src("templates/**/*")
            .pipe(copy("dist/templates", { prefix: 1 }));
});


gulp.task('build', gulp.series('compile', 'copy-templates'));