import { Room, ServerError } from '@colyseus/core';
import { Schema, MapSchema, defineTypes } from '@colyseus/schema';
import { MISSIONS, WORLD, walkable, distance } from '../public/shared.js';

export class Player extends Schema {
 constructor(){super();this.name='';this.role=0;this.x=0;this.y=0;this.z=0;this.yaw=0;this.ready=false;this.connected=true;this.busy=false;this.item='';this.answer=false;this.reflected=false;}
}
defineTypes(Player,{name:'string',role:'number',x:'number',y:'number',z:'number',yaw:'number',ready:'boolean',connected:'boolean',busy:'boolean',item:'string',answer:'boolean',reflected:'boolean'});
export class State extends Schema {
 constructor(){super();this.players=new MapSchema();this.status='lobby';this.mission=0;this.taskA=false;this.taskB=false;this.score=0;}
}
defineTypes(State,{players:{map:Player},status:'string',mission:'number',taskA:'boolean',taskB:'boolean',score:'number'});
const text=(v,n=400)=>typeof v==='string'?v.trim().slice(0,n):'';

export class HonestyRoom extends Room {
 onCreate(){
  this.maxClients=2;this.setState(new State());this.setPatchRate(50);this.inputs=new Map();this.talks=new Map();this.vy=new Map();this.reports=new Map();this.gates=new Map();this.resuming=false;
  this.onMessage('ready',(c)=>{const p=this.state.players.get(c.sessionId);if(!p||this.state.status!=='lobby')return;p.ready=true;if(this.state.players.size===2&&[...this.state.players.values()].every(x=>x.ready&&x.connected)){this.state.status='play';this.broadcast('notice','Kamu berdua sudah bersedia. Mulakan misi bersama!');}});
  this.onMessage('input',(c,m)=>{if(!this.throttle(c,'input',45))return;const p=this.state.players.get(c.sessionId);if(!p||this.state.status!=='play'||p.busy)return;let x=Number(m?.x),z=Number(m?.z);if(!Number.isFinite(x)||!Number.isFinite(z))return;const len=Math.hypot(x,z);if(len>1){x/=len;z/=len}this.inputs.set(c.sessionId,{x,z,time:Date.now()});if(m.jump===true&&p.y===0)this.vy.set(c.sessionId,6.4);});
  this.onMessage('talk',(c,m)=>this.beginTalk(c,m));
  this.onMessage('close',(c)=>this.closeTalk(c));
  this.onMessage('action',(c,m)=>this.action(c,m));
  this.onMessage('answer',(c,m)=>this.answer(c,m));
  this.onMessage('reflect',(c,m)=>this.reflect(c,m));
  this.onMessage('report',c=>c.send('report',this.report()));
  this.setSimulationInterval(dt=>this.tick(Math.min(dt/1000,.05)),1000/30);
 }
 onJoin(client,options){
  const name=text(options?.name,18).replace(/[<>\r\n]/g,'');if(!name)throw new ServerError(400,'Masukkan nama panggilan.');
  const p=new Player();p.role=[...this.state.players.values()].some(x=>x.role===0)?1:0;p.name=name;Object.assign(p,WORLD.spawn[p.role]);this.state.players.set(client.sessionId,p);this.reports.set(client.sessionId,[]);client.send('welcome',{roomId:this.roomId});
 }
 async onLeave(client,consented){
  const p=this.state.players.get(client.sessionId);if(!p)return;p.connected=false;p.busy=false;this.inputs.delete(client.sessionId);this.talks.delete(client.sessionId);
  const previous=this.state.status;if(previous==='play'||previous==='reflect')this.pausedStatus=previous;
  if(this.state.status!=='lobby'&&this.state.status!=='complete')this.state.status='paused';
  try{if(consented)throw new Error('left');await this.allowReconnection(client,60);p.connected=true;if([...this.state.players.values()].every(x=>x.connected)&&this.state.status==='paused')this.state.status=this.pausedStatus||'play';}
  catch{this.state.players.delete(client.sessionId);this.reports.delete(client.sessionId);this.vy.delete(client.sessionId);for(const key of this.gates.keys())if(key.startsWith(client.sessionId))this.gates.delete(key);if(this.state.players.size&&this.state.status!=='complete'){this.state.status='lobby';this.state.taskA=false;this.state.taskB=false;for(const [id,other] of this.state.players){other.ready=false;other.answer=false;other.reflected=false;other.item='';other.busy=false;this.reports.set(id,(this.reports.get(id)||[]).filter(r=>r.mission<this.state.mission))}this.broadcast('notice','Rakan telah keluar. Jemput seorang rakan dan tekan Sedia. Misi semasa akan bermula semula.');}}
 }
 throttle(c,key,max){const k=c.sessionId+key,now=Date.now();let g=this.gates.get(k);if(!g||now-g.t>1000){g={t:now,n:0};this.gates.set(k,g)}return ++g.n<=max;}
 notify(c,message){c.send('notice',message)}
 tick(dt){if(this.state.status!=='play'&&this.state.status!=='complete')return;for(const [id,p]of this.state.players){const input=this.inputs.get(id);if(input&&Date.now()-input.time<300&&!p.busy&&p.connected){const dx=input.x*4.6*dt,dz=input.z*4.6*dt;if(walkable(p.x+dx,p.z))p.x+=dx;if(walkable(p.x,p.z+dz))p.z+=dz;if(Math.hypot(dx,dz)>.001)p.yaw=Math.atan2(dx,dz);}let vy=this.vy.get(id)||0;if(p.y>0||vy>0){p.y=Math.max(0,p.y+vy*dt);this.vy.set(id,p.y===0?0:vy-18*dt);}}}
 closeTalk(c){const p=this.state.players.get(c.sessionId);if(p)p.busy=false;this.talks.delete(c.sessionId);this.inputs.delete(c.sessionId);c.send('closed');}
 beginTalk(c,m){if(!this.throttle(c,'talk',5))return;const p=this.state.players.get(c.sessionId),mission=MISSIONS[this.state.mission];if(!p||!mission||this.state.status!=='play')return;
  const task=mission.tasks.find(t=>t.id===m?.id),npc=mission.npc,target=task||npc;if(m?.id!==target.id||distance(p,target)>2.9)return this.notify(c,'Dekati tempat itu dahulu.');p.busy=true;this.inputs.delete(c.sessionId);this.talks.set(c.sessionId,target.id);
  if(task){if(task.role!==p.role)return c.send('dialog',{kind:'message',title:task.name,text:'Tugasan ini untuk rakan kamu. Kamu boleh menemaninya dan berbincang.'});const done=mission.tasks[0]===task?this.state.taskA:this.state.taskB;c.send('dialog',{kind:done?'message':'task',id:task.id,title:task.name,text:done?'Tugasan ini sudah selesai. Temui jiran apabila kedua-dua tugasan siap.':task.text,verb:task.verb});}
  else if(!this.state.taskA||!this.state.taskB)c.send('dialog',{kind:'message',title:npc.name,text:'Selesaikan kedua-dua tugasan dahulu. Semak panduan misi di sebelah kiri.'});
  else if(p.answer)c.send('dialog',{kind:'message',title:npc.name,text:'Pilihan jujur kamu sudah diterima. Tunggu rakan membuat pilihannya sendiri.'});
  else c.send('dialog',{kind:'quiz',title:npc.name,text:npc.text+' '+mission.question,answers:mission.answers});
 }
 action(c,m){const p=this.state.players.get(c.sessionId),mission=MISSIONS[this.state.mission];if(!p||!mission||this.state.status!=='play')return;const task=mission.tasks.find(t=>t.id===m?.id);if(!task||task.role!==p.role||this.talks.get(c.sessionId)!==task.id||distance(p,task)>3)return;const key=mission.tasks[0]===task?'taskA':'taskB';if(!this.state[key]){this.state[key]=true;p.item=task.item;this.broadcast('notice',p.name+' selesai: '+task.name+'.');}this.closeTalk(c);}
 answer(c,m){const p=this.state.players.get(c.sessionId),mission=MISSIONS[this.state.mission];if(!p||!mission||this.state.status!=='play'||!this.state.taskA||!this.state.taskB||this.talks.get(c.sessionId)!==mission.npc.id||distance(p,mission.npc)>3||p.answer)return;
  if(m?.choice!==mission.correct)return c.send('feedback',{ok:false,text:'Cuba lagi. Fikirkan bercakap benar, amanah dan hak jiran.'});p.answer=true;c.send('feedback',{ok:true,text:mission.feedback});p.busy=false;this.talks.delete(c.sessionId);if([...this.state.players.values()].every(x=>x.answer)&&this.state.players.size===2){this.state.status='reflect';this.inputs.clear();for(const q of this.state.players.values())q.busy=true;this.broadcast('reflection',{mission:this.state.mission});}
 }
 reflect(c,m){const p=this.state.players.get(c.sessionId),mission=MISSIONS[this.state.mission];if(!p||!mission||this.state.status!=='reflect'||p.reflected)return;
  if(!['Bercakap benar','Amanah','Ikhlas'].includes(m?.trait)||m?.benefit!==mission.benefitCorrect)return c.send('reflectionError','Semak ciri kejujuran dan manfaat kepada jiran.');
  if(!['Lega','Gembira','Bangga','Masih risau'].includes(m?.feeling)||text(m?.why).length<8||text(m?.plan).length<8)return c.send('reflectionError','Pilih perasaan serta tulis sebab dan rancangan sekurang-kurangnya satu ayat ringkas.');
  this.reports.get(c.sessionId).push({mission:this.state.mission,trait:m.trait,benefit:mission.benefits[m.benefit],feeling:m.feeling,why:text(m.why),plan:text(m.plan)});p.reflected=true;c.send('reflectionSaved');
  if(this.state.players.size===2&&[...this.state.players.values()].every(x=>x.reflected)){this.state.score+=100;this.state.mission++;this.state.taskA=false;this.state.taskB=false;for(const q of this.state.players.values()){q.answer=false;q.reflected=false;q.busy=false;q.item='';}this.talks.clear();if(this.state.mission===MISSIONS.length){this.state.status='complete';this.broadcast('finished',this.report())}else{this.state.status='play';this.broadcast('next',{mission:this.state.mission})}}
 }
 report(){return {room:this.roomId,score:this.state.score,completed:this.state.mission,players:[...this.state.players].map(([id,p])=>({name:p.name,records:this.reports.get(id)||[]}))};}
}
