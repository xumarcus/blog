/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import fs from 'fs'
import path from 'path'

type PipedFunction =
  | ((
      path: fs.PathLike
      /*
    options?:
      | { encoding: BufferEncoding | null; withFileTypes?: false | undefined }
      | BufferEncoding
      | null
      | undefined
    */
    ) => string[])
  | ((
      path: fs.PathLike
      /*
    options: { encoding: 'buffer'; withFileTypes?: false | undefined } | 'buffer'
    */
    ) => Buffer[])
  | ((
      path: fs.PathLike
      /*
    options?:
      | BufferEncoding
      | (fs.ObjectEncodingOptions & { withFileTypes?: false | undefined })
      | null
      | undefined
    */
    ) => string[] | Buffer[])
  | ((
      path: fs.PathLike /* options: fs.ObjectEncodingOptions & { withFileTypes: true } */
    ) => fs.Dirent[])
  | ((input: any) => any)
  | ((extraPath: string) => string)
  | ((fullPath: string) => string | string[])

const pipe = (...fns: PipedFunction[]) => (x: any) => fns.reduce((v, f) => f(v), x)

const flattenArray = (input: any[]) =>
  input.reduce((acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])], [])

const map = (fn: (x: any) => any) => (input: any[]) => input.map(fn)

const walkDir = (fullPath: string) => {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath)
}

const pathJoinPrefix = (prefix: string) => (extraPath: string) => path.join(prefix, extraPath)

const getAllFilesRecursively = (folder: string): string[] =>
  pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder)

export default getAllFilesRecursively
