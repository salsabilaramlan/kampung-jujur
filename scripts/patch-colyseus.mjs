// Colyseus 0.16 expects nanoid 2's default export. Use the maintained 3.x
// generator and adapt that import without changing the wire protocol.
import {readFile,writeFile} from 'node:fs/promises';
const path='node_modules/@colyseus/core/build/utils/Utils.mjs';
let source=await readFile(path,'utf8');
source=source.replace('import nanoid from "nanoid";','import { nanoid } from "nanoid";');
if(!source.includes('import { nanoid } from "nanoid";'))throw Error('Colyseus import changed; review compatibility patch.');
await writeFile(path,source);
const cjs='node_modules/@colyseus/core/build/utils/Utils.js';
let common=await readFile(cjs,'utf8');
common=common.replace('import_nanoid.default','import_nanoid.nanoid');
await writeFile(cjs,common);
