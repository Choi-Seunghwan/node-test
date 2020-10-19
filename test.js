const SVGSpriter = require("svg-sprite");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");
const File = require("vinyl");
const glob = require("glob");
const replateInfile = require("replace-in-file");
const options = {
  files: "./dest/sprite.css",
  from: /static\/images\/sprite\.svg/g,
  to: `/static/images/sprite.svg`,
};
const spriter = new SVGSpriter({
  dest: "dest",
  mode: {
    css: {
      dest: "./",
      bust: false,
      render: {
        css: true,
      },
      sprite: "./static/images/sprite.svg",
      prefix: ".img-%s",
      dimensions: true,
    },
    // view: {
    //   dest: "./",
    //   bust: false,
    //   render: {
    //     css: true,
    //   },
    //   prefix: ".img-%s",
    //   dimensions: true,
    // },
  },
});
const cwd = path.resolve("./");

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

    replateInfile(options);
  });
});
