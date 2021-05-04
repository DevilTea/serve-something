import { serve } from '../src/index'
import path from 'path'

import type { ServeSpaOptions } from '../src/types'

async function run() {
  const options: ServeSpaOptions = {
    root: path.join(__dirname, './example-spa/dist'),
    prefix: '/example/'
  }
  const { url } = await serve(options)
  console.log(`Served on: ${url}`)
}

run()