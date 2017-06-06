// @flow

import express from 'express'
import {resolve} from 'path'

const app = express()

app.use(express.static(resolve(__dirname, '../public')))

export default app

export function sum (a: number, b:number): number {
  return a + b
}
