import test from 'node:test';
import assert from 'node:assert/strict';
import {Client} from 'colyseus.js';
import {matchMaker} from '@colyseus/core';
import {start} from '../server/index.js';
import {MISSIONS} from '../public/shared.js';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn){for(let i=0;i<120;i++){if(fn())return;await delay(25)}throw Error('Timed out waiting for synchronized state')}
function listen(r){r.onMessage('*',()=>{});return r}
test('two real network clients: movement, guarded actions, three missions and reports',async()=>{
 const {game,http}=await start(0),url=`ws://127.0.0.1:${http.address().port}`,client=new Client(url);let a,b;
 try{
  a=listen(await client.create('honesty',{name:'Ujian A'}));b=listen(await client.joinById(a.roomId,{name:'Ujian B'}));
  await assert.rejects(()=>client.joinById(a.roomId,{name:'Third'}));
  const local=matchMaker.getLocalRoomById(a.roomId);assert(local);
  a.send('ready');await delay(100);assert.equal(local.state.status,'lobby');b.send('ready');await until(()=>a.state.status==='play'&&b.state.status==='play');
  const token=b.reconnectionToken,oldId=b.sessionId;b.connection.close(4001);await until(()=>a.state.status==='paused');b=listen(await client.reconnect(token));await until(()=>a.state.status==='play');assert.equal(b.sessionId,oldId);
  const pa=local.state.players.get(a.sessionId),pb=local.state.players.get(b.sessionId),original=pa.x;
  for(let i=0;i<8;i++){a.send('input',{x:1,z:0,jump:i===0});await delay(50)}
  assert(pa.x>original+1);assert(pa.y>0);await until(()=>Math.abs(b.state.players.get(a.sessionId).x-pa.x)<.3);
  a.send('input',{x:0,z:0});await delay(700);assert.equal(pa.y,0);
  a.send('action',{id:'wallet'});await delay(70);assert.equal(local.state.taskA,false);
  a.send('input',{x:'NaN',z:999999});await delay(70);assert(Number.isFinite(pa.x));
  // Place test participants beside each station to isolate protocol checks from navigation.
  for(let i=0;i<3;i++){
   const m=MISSIONS[i];
   for(let j=0;j<2;j++){
    const t=m.tasks[j],r=t.role===0?a:b,p=t.role===0?pa:pb,wrong=t.role===0?b:a,wp=t.role===0?pb:pa;
    Object.assign(wp,{x:t.x,z:t.z});wrong.send('talk',{id:t.id});await delay(60);wrong.send('action',{id:t.id});await delay(60);assert.equal(local.state[j===0?'taskA':'taskB'],false);wrong.send('close');
    Object.assign(p,{x:t.x,z:t.z});r.send('talk',{id:t.id});await delay(70);r.send('action',{id:t.id});await until(()=>local.state[j===0?'taskA':'taskB']);r.send('action',{id:t.id});
   }
   for(const [r,p]of[[a,pa],[b,pb]]){Object.assign(p,{x:m.npc.x,z:m.npc.z});r.send('talk',{id:m.npc.id});await delay(80);r.send('answer',{choice:(m.correct+1)%3});await delay(60);assert.equal(p.answer,false);r.send('answer',{choice:m.correct});await until(()=>p.answer);}
   await until(()=>a.state.status==='reflect'&&b.state.status==='reflect');
   const reflection={trait:'Amanah',benefit:m.benefitCorrect,feeling:'Lega',why:'Saya telah membantu jiran dengan jujur.',plan:'Saya akan bercakap benar kepada jiran.'};
   a.send('reflect',{...reflection,why:'x'});await delay(60);assert.equal(pa.reflected,false);
   a.send('reflect',reflection);await until(()=>pa.reflected);a.send('reflect',reflection);await delay(60);assert.equal(local.state.mission,i);assert.equal(local.reports.get(a.sessionId).length,i+1);
   b.send('reflect',reflection);await until(()=>local.state.mission===i+1);await until(()=>a.state.mission===i+1&&b.state.mission===i+1);
  }
  assert.equal(a.state.status,'complete');assert.equal(b.state.score,300);assert.equal(local.report().players.length,2);assert(local.report().players.every(p=>p.records.length===3));
 }finally{await Promise.race([Promise.all([a?.leave(),b?.leave()]),delay(200)]);await game.gracefullyShutdown(false)}
});
