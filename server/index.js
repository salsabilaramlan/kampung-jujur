import express from 'express';
import { createServer } from 'node:http';
import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { fileURLToPath } from 'node:url';
import { HonestyRoom } from './room.js';

export async function start(port=Number(process.env.PORT)||2567){
 const app=express();app.disable('x-powered-by');
 const allowed=(process.env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
 app.use((req,res,next)=>{if(allowed.length&&req.headers.origin&&!allowed.includes(req.headers.origin))return res.status(403).json({error:'Origin not allowed'});next()});
 app.get('/health',(_req,res)=>res.json({ok:true,game:'Kampung Jujur'}));
 app.use(express.static(fileURLToPath(new URL('../dist',import.meta.url)),{index:'index.html'}));
 const http=createServer(app);
 const game=new Server({transport:new WebSocketTransport({server:http,maxPayload:16*1024,verifyClient:info=>!allowed.length||!info.origin||allowed.includes(info.origin)}),greet:false});
 game.define('honesty',HonestyRoom);
 await game.listen(port,'0.0.0.0');
 console.log(`Kampung Jujur: http://127.0.0.1:${http.address().port}`);
 return {game,http};
}
if(process.argv[1]===fileURLToPath(import.meta.url))start().catch(e=>{console.error(e);process.exit(1)});
