const { src, dest, watch, series, task } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const concat = require("gulp-concat");

//compile, prefix, and min scss
function compilescss() {
  return src("src/styles/scss/*.scss") // change to your source directory
    .pipe(sass())
    .pipe(prefix("last 2 versions"))
    .pipe(minify())
    .pipe(concat("bundle.css"))
    .pipe(dest("public/styles/")); // change to your final/public directory
}
//minify tailwind
function minifyTailwind() {
  return src("./public/styles/tailwind_output.css").pipe(minify());
}
task(minifyTailwind);

//watchtask
function watchTask() {
  watch("src/styles/scss/**/*.scss", compilescss); // change to your source directory
}

// Default Gulp task
exports.default = series(compilescss, watchTask, minifyTailwind);
