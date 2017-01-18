module.exports = function(grunt){
	var nodeModules = {
		angular : 'node_modules/angular/angular.min.js',
		angularRoute : 'node_modules/angular-route/angular-route.min.js',
		jquery: 'node_modules/jquery/dist/jquery.min.js'
	};

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// compass: {
		// 	dev: {
		// 		options: {
		// 			sassDir: 'app/scss/',
		// 			cssDir: 'app/css/',
		// 			relativeAssets: true,
		// 			fontsDir: 'app/fonts',
		// 			sourcemap: true,
		// 			cacheDir:'/../../../.sass-cache/',
		// 			outputStyle: 'expanded'
		// 		}
		// 	},
		// 		prod: {
		// 			options: {
		// 				sassDir: 'app/scss',
		// 				cssDir: 'dist/css',
		// 				relativeAssets: true,
		// 				assetCacheBuster: true,
		// 				fontsDir: 'src/fonts',
		// 				outputStyle: 'compress'
		// 			}
		// 		}
		// 	},
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
				separator: '\n',
			},
			js: {
				src: [nodeModules.jquery, nodeModules.angular, nodeModules.angularRoute, 'src/js/**/*.js'],
				dest: 'src/dist/<%= pkg.name %>.debug.js',
			},
			css: {
				src: ['src/css/*.css', 'src/css/**/*.css'],
				dest: 'src/dist/<%= pkg.name %>.debug.css'
			}
		},
		watch: {
			app : {
				files: ['src/js/**/*.js', 'src/css/**/*.css'],
				tasks: ['concat', 'http-server'],
				options: {
					spawn: false,
				}
			}
		},
		'http-server': {
			'dev': {
				// the server root directory 
				root: '', 
				port: 8080,
				host: '0.0.0.0',
				cache: false,
				showDir : true,
				autoIndex: true,
				ext: "html",
				runInBackground: true,
				openBrowser : false,
				customPages: {}
			}
		},
		shell: {
			options: {
				stderr: false,
				cwd: './node_modules/karma/bin/'
			},
			test: {
				command: 'karma start'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	// grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-http-server');

	grunt.registerTask('default', ['concat', 'http-server', 'watch']);
	grunt.registerTask('run-test', ['shell']);
}