/*
		 参考资料
		 	https://gist.github.com/micmania1/3a6f91b256b8f3e7dc97a740d60e20cb <Basic react gulpfile with browserfy and babel>
		 	https://gist.github.com/gradosevic/97bcde437502d021c6e1 <Working gulpfile.js with gulp-babel ES6 and React>
		 	https://stackoverflow.com/questions/33243895/how-convert-jsx-to-js-with-gulp-and-babel <gulp-react过时的取代方案>
		 	https://stackoverflow.com/questions/33187695/gulp-babelify-browserify-issue <Gulp + babelify + browserify issue> 
		 	https://gist.github.com/marceloogeda/5a449caa50462ab2667540a93d34009f <My Gulpfile using ES6 (Babel), Browserify, BrowserSync, SASS, Sourcemaps, and more... 参考价值高>
			https://zhaoda.net/2015/10/16/browserify-guide/ <Browserify 使用指南>
			https://snippets.aktagon.com/snippets/734-a-gulp-js-template-for-react-js-and-es6-projects <文章 https://snippets.aktagon.com/snippets/734-a-gulp-js-template-for-react-js-and-es6-projects>
 */


let gulp = require('gulp');
let gulpLoadPlugins = require('gulp-load-plugins');
let browserify = require('browserify');
let babelify = require('babelify');
// let babel = require('gulp-babel')
let browserifyCss = require('browserify-css');
let source = require('vinyl-source-stream');
let $ = gulpLoadPlugins({ lazyload: true, rename: {} });


// 汇总当前输入输出的文件路径
const path = {
	entry:{
		all: ['src/index.html','src/css/*.css','src/script/*.js'],
		css: ['src/css/*.css'],
		js: ['src/script/*.js'],
		allJs: ['src/script/index.js'],
		html: ['src/index.html']
	},
	output:{
		all: ['dist/index.html','dist/css/','dist/script/'],
		html: ['dist/'],
		css: ['dist/css/'],
		js: ['dist/script/']
	}
}

// 编译react jsx es6语法
const browserifyJs = (done) =>{
	return browserify({
		entries: path.entry.allJs,
		debug: true,
		transform: [ babelify.configure({
	      presets: ['es2015','react']
	    }), ]
	}).transform(browserifyCss, {
		autoInject: true,
		autoInjectOptions:{
			verbose: true,
			insertAt: 'top',
		},
		minify: true,
   	    // output: './dist/css/bundle.min.css'
	}).bundle()
	.pipe(source("bundle.min.js"))
	.pipe(gulp.dest(path.output.js))
	.pipe($.connect.reload())
	/*return gulp.src(path.entry.js)
		.pipe($.babel())
		.pipe($.concat('bundle.min.js'))
		.pipe(gulp.dest(path.output.js))*/
}


// 拷贝html文件
const copyHtml = (done) => {
	return gulp.src(path.entry.html)
		.pipe(gulp.dest(path.output.html))
		.pipe($.connect.reload())
}

// 合并拷贝css文件
const outputStyle = (done) => {
	return gulp.src(path.entry.css)
		.pipe($.concat('style.css'))
		.pipe(gulp.dest(path.output.css))
		.pipe($.connect.reload())
}

// 清理文件
const clear = (done) => {
	try{
		return gulp.src(path.output.all)
		.pipe($.clean())
	}catch(e){
		done()
	}
}

// 监听文件修改启动服务
const watchEdit = (done) => {
	// 启动服务
	$.connect.server({
        name: 'Gulp React',
	    root: 'dist',
	    port: 8008,
	    livereload: true
    });

	// 分别对文件进行监听
    gulp.watch(path.entry.js, gulp.parallel(browserifyJs));
    gulp.watch(path.entry.css, gulp.parallel(outputStyle, browserifyJs));
    gulp.watch(path.entry.html, gulp.parallel(copyHtml));
	done()
}

exports.default = gulp.series( clear, copyHtml, outputStyle, browserifyJs, watchEdit)