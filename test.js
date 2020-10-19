var SVGSpriter = require("svg-sprite"),
  mkdirp = require("mkdirp"),
  path = require("path"),
  fs = require("fs"),
  File = require("vinyl"),
  glob = require("glob"),
  spriter = new SVGSpriter({
    dest: "dest",
    mode: {
      // css: {
      //   dest: "./",
      //   bust: false,
      //   render: {
      //     scss: true,
      //   },
      //   prefix: ".img-%s",
      //   dimensions: true,
      // },
      view: {
        dest: "./",
        bust: false,
        render: {
          css: true,
        },
        prefix: ".img-%s",
        dimensions: true,
        layout: "vertical"
      },
    },
  }),
  cwd = path.resolve("./");

// Find SVG files recursively via `glob`
glob.glob("images/*.svg", function (err, files) {
  files.forEach(function (file) {
    // Create and add a vinyl file instance for each SVG
    spriter.add(
      new File({
        path: path.join(cwd, file), // Absolute path to the SVG file
        base: path.resolve("images"), // Base path (see `name` argument)
        contents: fs.readFileSync(path.join(cwd, file)), // SVG file contents
      })
    );
  });

  spriter.compile(function (error, result, data) {
    for (const type in result.view) {
      mkdirp.sync(path.dirname(result.view[type].path));
      fs.writeFileSync(result.view[type].path, result.view[type].contents);
    }

    for (const type in result.css) {
      mkdirp.sync(path.dirname(result.css[type].path));
      fs.writeFileSync(result.css[type].path, result.css[type].contents);
    }
  });
});
