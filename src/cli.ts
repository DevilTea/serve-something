#!/usr/bin/env node

import { cac } from 'cac'
import path from 'path'
import { serve, buildExecutable } from './index'

interface CliOptions {
  base: string;
  spa: boolean;
  build: boolean;
  name: string;
  outpath: string;
  targets: string;
}

async function run() {
  const cli = cac('serve-something')

  cli.command('[rootPath]', 'Root path of the files to be served')
    .option('--base <baseUrl>', 'Input the baseUrl of the served files', {
      default: '/'
    })
    .option('--spa', 'Serve with "index.html" for 404 not found fallback', {
      default: false
    })
    .option('--build', 'Build executable spa app', {
      default: false
    })
    .option('--name <outputName>', 'Output file name or template for several files', {
      default: 'spa'
    })
    .option('--outpath <outputPath>', 'Path to save output one or more executables', {
      default: 'exec-spa'
    })
    .option('--targets <targets>', 'Comma-separated list of targets')
    .action(async (rootPath, { base, spa, build, name, outpath, targets }: CliOptions) => {
      const opts = {
        root: path.resolve(rootPath),
        prefix: base,
        spaFallback: spa,
        name,
        outpath: path.resolve(outpath),
        targets
      }
      if (build) {
        buildExecutable(opts)
        return
      }
      const { url } = await serve(opts)
      console.log(`Served on: ${url}`)
    })

  cli.help()

  cli.parse()
  await cli.runMatchedCommand()
}

run()
  .catch((err) => {
    console.error('Oops! something went wrong. \nCheckout "serve-something --help".\n')
    console.error(err)
    process.exit(1)
  })