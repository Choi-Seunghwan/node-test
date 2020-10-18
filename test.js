var SVGSpriter = require("svg-sprite"),
  mkdirp = require("mkdirp"),
  path = require("path"),
  fs = require("fs"),
  File = require("vinyl"),
  glob = require("glob"),
  spriter = new SVGSpriter({
    dest: "static/images/svg",
    mode: {
      css: {
        dest: "../",
        bust: false,
        render: {
          scss: true,
        },
        prefix: "sprited-%s",
        dimensions: true,
      },
      view: true,
      // view: {
      //   render: {
      //     scss: true,
      //   },
      // },
    },
  }),
  cwd = path.resolve("svg");

// Find SVG files recursively via `glob`
glob.glob("**/*.svg", { cwd: cwd }, function (err, files) {
  files.forEach(function (file) {
    // Create and add a vinyl file instance for each SVG
    spriter.add(
      new File({
        path: path.join(cwd, file), // Absolute path to the SVG file
        base: "test", // Base path (see `name` argument)
        contents: fs.readFileSync(path.join(cwd, file)), // SVG file contents
      })
    );
  });

  spriter.compile(function (error, result, data) {
    for (var type in result.css) {
      mkdirp.sync(path.dirname(result.css[type].path));
      fs.writeFileSync(result.css[type].path, result.css[type].contents);
    }
  });
});

console.log("completed");
