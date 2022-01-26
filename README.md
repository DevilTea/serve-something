# Serve Something

A library / cli tool to serve something.

## Features
- First of all, serve something
  - Just serve files with HTTP protocol
  - BaseUrl could be set to use
  - SPA mode that `404` would be fallback to index.html provided
- Build executable output
  - This feature is built on top [vercel/pkg](https://github.com/vercel/pkg), many thanks!
  - Here's the things you may config
    - name: The name of output files would look like
    - outpath: The path of folder that output files would be inside
    - targets: The targets' node version, platform and architecture that executable files may run at (the config method is same as [vercel/pkg](https://github.com/vercel/pkg))

## Getting Start

### Installing
```bash
# You may use it as a global CLI tool
$ npm -g install serve-something
# Or just install locally
$ npm install serve-something
```

### Usage
#### Usage in CLI
Checkout `serve-something --help`
```
Usage:
  $ serve-something [rootPath]

Commands:
  [rootPath]  Root path of the files to be served

For more info, run any command with the `--help` flag:
  $ serve-something --help

Options:
  --base <baseUrl>        Input the baseUrl of the served files (default: /)
  --spa                   Serve with "index.html" for 404 not found fallback (default: false)
  --cors                  Serve with CORS "Access-Control-Allow-Origin: *" (default: false)
  --build                 Build executable spa app (default: false)
  --name <outputName>     Output file name or template for several files (default: out)
  --outpath <outputPath>  Path to save output one or more executables (default: executable-outputs)
  --targets <targets>     Comma-separated list of targets 
  -h, --help              Display this message
```

#### Usage in programmatic way
Checkout an example in [here](./example/index.ts)!

## License
### [MIT](./LICENSE)