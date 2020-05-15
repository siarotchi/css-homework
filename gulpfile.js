const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();

//Порядок подключения css файлов
const sassFiles = ["./src/sass/*.scss"];
//Порядок подключения js файлов
const jsFiles = ["./src/js/main.js"];

//Таск на стили SASS
function styles() {
  //Шаблон для поиска файлов SASS
  return (
    gulp
      .src(sassFiles)
      //Добавить префиксы
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        })
      )
      //Выходная папка для стилей
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest("./build/css"))
      .pipe(browserSync.stream())
  );
}

//Таск на скрипты JS
function scripts() {
  //Шаблон для поиска файлов JS
  //Всей файлы по шаблону './src/js/**/*.js'
  return (
    gulp
      .src(jsFiles)
      //Объединение файлов в один
      .pipe(concat("script.js"))
      //Минификация JS
      .pipe(
        uglify({
          toplevel: true,
        })
      )
      //Выходная папка для скриптов
      .pipe(gulp.dest("./build/js"))
      .pipe(browserSync.stream())
  );
}

//Удалить всё в указанной папке
function clean() {
  return del(["build/*"]);
}

//Просматривать файлы
function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  //Следить за SASS файлами
  gulp.watch("./src/sass/**/*.scss", styles);
  //Следить за JS файлами
  gulp.watch("./src/js/**/*.js", scripts);
  //При изменении HTML запустить синхронизацию
  gulp.watch("./*.html").on("change", browserSync.reload);
}

//Таск вызывающий функцию styles
gulp.task("sass", styles);
//Таск вызывающий функцию scripts
gulp.task("scripts", scripts);
//Таск для очистки папки build
gulp.task("del", clean);
//Таск для отслеживания изменений
gulp.task("watch", watch);
//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task("build", gulp.series(clean, gulp.parallel(styles, scripts)));
//Таск запускает таск build и watch последовательно
gulp.task("dev", gulp.series("build", "watch"));
