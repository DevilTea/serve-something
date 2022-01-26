import { writeFile, mkdir } from 'fs/promises'
import { exec as execPkg } from 'pkg'
import path from 'path'
import _rm from 'rimraf'
import copy from 'recursive-copy'
import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import fastifyCors from 'fastify-cors'

import type { Options as RimrafOptions } from 'rimraf'
import type { ServeSpaOptions, BuildExecutableOptions } from './types'

const rm = (path: string, options: RimrafOptions = {}) =>
  new Promise<void>((resolve, reject) => {
    _rm(path, options, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })

export const serve = async ({ root, prefix, spaFallback }: ServeSpaOptions) => {
  const baseUrl = prefix ?? '/'

  const app = fastify({
    ignoreTrailingSlash: true
  })

  app.register(fastifyStatic, {
    root,
    prefix,
    wildcard: false
  })

  app.register(fastifyCors, {
    origin: true
  })

  if (spaFallback) app.get(`${baseUrl}**/*`, (req, reply) => {
    reply.sendFile('index.html')
  })

  const { err, address } = await app.listen(NaN)
    .then(address => ({ address, err: undefined }))
    .catch(err => ({ address: undefined, err }))

  if (err) {
    console.error(err)
    process.exit(1)
  }
  const url = address + baseUrl

  return {
    app,
    url
  }
}

export const buildExecutable = async ({ root, prefix, spaFallback, name, outpath, targets }: BuildExecutableOptions) => {
  const tempPath = path.join(__dirname, '.serve-spa')
  const executableScriptPath = path.join(tempPath, `${name}.js`)
  const executableConfigPath = path.join(tempPath, 'pkg.config.json')
  const executableAssetPath = path.join(tempPath, 'spa')

  const _prefix = prefix === undefined ? undefined : `'${prefix}'`
  const executableScript = `
  const path = require('path')
  const { readdirSync } = require('fs')
  require('../index.js').serve({
    root: path.join(__dirname, './spa/'),
    prefix: ${_prefix},
    spaFallback: ${spaFallback}
  }).then(({ url }) => {
    console.log('Served on: ' + url)
  })
  `
  const executableConfig = {
    scripts: [`${name}.js`],
    assets: ['spa/**/*'],
    targets: targets.split(','),
    outputPath: outpath
  }

  await rm(tempPath)
  await mkdir(tempPath).catch(() => { })
  await copy(root, executableAssetPath)
  await writeFile(executableConfigPath, JSON.stringify(executableConfig))
  await writeFile(executableScriptPath, executableScript)
  await execPkg(['-c', executableConfigPath, executableScriptPath])
  await rm(tempPath)
}
