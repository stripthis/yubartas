module.exports = function(grunt) {

	// ========================================================================
	// Configure task options

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			css: [
				'css/*.css',
			]
		},
		lesslint: {
			src: ['less/*.less']
		},
		less: {
			files: {
				expand: true,
				flatten: true,
				cwd: "less/",
				src: "*.less",
				dest: "css/",
				ext: ".css"
			}
		},
		shell: {
			'publish': {
				options: {
					stdout: true
				},
				command: [
					'git commit -am \'<%= pkg.version %>\'',
					'git tag -a <%= pkg.version %> -m \'<%= pkg.version %>\'',
					'git push origin <%= pkg.version %>',
					'git push'
				].join('&&')
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['*.css', '!*.min.css'],
				dest: 'css/',
				ext: '.min.css'
			}
		},
		watch: {
			less: {
				files: [
					'Gruntfile.js',
					'package.json',
					'less/*.less',
					'less/**/*.less'],
				tasks: ['css'],
				options: {
					spawn: false
				}
			}
		},
		header: {
			dist: {
				options: {
					text: '/**!\n'+
								' * @name\t\t<%= pkg.name %>\n'+
								' * @version\t\tv<%= pkg.version %>\n' +
								' * @date\t\t<%= grunt.template.today("yyyy-mm-dd") %>\n' +
								' * @copyright\t<%= pkg.copyright %>\n' +
								' * @source\t\t<%= pkg.repository.url %>\n'+
								' * @license\t\t<%= pkg.license %>\n */\n',
				},
				files: {
					'css/main.css': 'css/main.css',
					'css/main.min.css': 'css/main.min.css'
				}
			}
		}
	});

	// ========================================================================
	// Initialise

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-lesslint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-header');

	// ========================================================================
	// Register Tasks

	// Run 'grunt test' to view lesslint recommendations
	grunt.registerTask('test', ['lesslint']);

	// Run 'grunt csslint' to check LESS quality, and if no errors then
	// compile LESS into CSS, combine and minify
	grunt.registerTask('csslint', ['lesslint', 'clean:css', 'less', 'cssmin', 'header']);

	// Run 'grunt css' to compile LESS into CSS, combine and minify
	grunt.registerTask('css', ['clean:css', 'less', 'cssmin', 'header']);

	// Tag and publish the styleguide
	grunt.registerTask('publish', [ 'shell:publish']);

	// 'grunt' will check code quality, and if no errors,
	// compile LESS to CSS, and minify and concatonate all JS and CSS
	grunt.registerTask('default', [ 'clean', 'less', 'cssmin', 'header']);
};
