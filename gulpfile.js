const {
	src, dest, parallel
}				= require("gulp"),
babel			= require("gulp-babel"),
browserify		= require("gulp-browserify"),
rename			= require("gulp-rename")

const bundle = () => src("src/main.js")
	.pipe(babel({ presets: [ "@babel/env" ] }))
	.pipe(browserify())
	.pipe(rename("bundle.js"))
    .pipe(dest("docs"))

module.exports = {
	bundle,
	default: bundle
}

