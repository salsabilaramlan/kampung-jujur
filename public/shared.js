export const WORLD={min:-23,max:23,spawn:[{x:-2,z:16},{x:2,z:16}],obstacles:[
 {x:-14,z:-15,w:7,d:5},{x:14,z:-15,w:7,d:5},{x:15,z:15,w:6,d:5},
 {x:-18,z:10,w:2,d:2},{x:19,z:0,w:2,d:2},{x:-18,z:-3,w:2,d:2},
 {x:-6,z:-18,w:2,d:2},{x:7,z:19,w:2,d:2}
]};
export const MISSIONS=[
 {title:'Dompet siapa?',subtitle:'Amanah dengan barang jiran',color:'#f5c35d',
  tasks:[{id:'wallet',name:'Dompet tercicir',x:-10,z:6,role:0,verb:'Ambil dompet untuk dipulangkan',item:'Dompet',hint:'Ambil dompet berhampiran bangku.',text:'Kamu menjumpai sebuah dompet. Simpan dengan amanah untuk dipulangkan kepada pemiliknya.'},
   {id:'notice',name:'Papan makluman',x:-3,z:-4,role:1,verb:'Baca petunjuk pemilik',item:'Petunjuk pemilik',hint:'Baca papan makluman berhampiran dataran.',text:'Puan Mei kehilangan dompet biru bercorak bunga. Dia sedang menunggu di hadapan rumahnya.'}],
  npc:{id:'mei',name:'Puan Mei',x:-13,z:-10,shirt:'#4bb8ab',text:'Saya kehilangan dompet biru bercorak bunga. Adakah kamu menjumpainya?'},
  question:'Apakah tindakan jujur yang kamu pilih?',answers:['Simpan wangnya dan pulangkan dompet kosong.','Pulangkan dompet bersama semua isinya kepada Puan Mei.','Katakan saya tidak nampak apa-apa.'],correct:1,
  feedback:'Amanah bermaksud menjaga dan memulangkan barang yang bukan milik kita.',benefit:'Mengapakah tindakan ini baik untuk jiran?',benefits:['Jiran mendapat barangnya semula dan mempercayai kita.','Kita boleh mengambil upah tanpa izin.','Kita boleh menyimpan wang yang dijumpai.'],benefitCorrect:0,
  plan:'Apabila menjumpai barang jiran, saya akan…'},
 {title:'Baki terlebih!',subtitle:'Jujur walaupun tiada orang menyedari',color:'#79c7e0',
  tasks:[{id:'buy',name:'Kaunter kedai',x:10,z:-6,role:1,verb:'Beli roti untuk jiran',item:'Roti & baki RM9',hint:'Beli roti di kaunter kedai.',text:'Harga roti RM4. Kamu membayar RM10 tetapi menerima baki RM9. Simpan roti dan wang itu sementara rakan menyemak resit.'},
   {id:'receipt',name:'Resit belian',x:5,z:-1,role:0,verb:'Semak resit dan baki',item:'Resit: baki RM6',hint:'Semak resit di meja berhampiran kedai.',text:'RM10 − RM4 = RM6. Baki yang sepatutnya ialah RM6. Wang yang terlebih diterima ialah RM3.'}],
  npc:{id:'hassan',name:'Pak Hassan',x:13,z:-10,shirt:'#5590cb',text:'Terima kasih membeli roti. Ada masalah dengan baki yang saya berikan?'},
  question:'Baki terlebih RM3. Apakah keputusan kamu?',answers:['Simpan kerana Pak Hassan tidak sedar.','Beri wang lebihan itu kepada rakan.','Beritahu Pak Hassan dan pulangkan RM3.'],correct:2,
  feedback:'Kejujuran tetap diamalkan walaupun orang lain tidak menyedari kesilapan.',benefit:'Apakah manfaat memulangkan baki berlebihan?',benefits:['Kita mendapat lebih banyak wang.','Jiran tidak rugi dan hubungan saling percaya terpelihara.','Kita boleh menyalahkan rakan.'],benefitCorrect:1,
  plan:'Apabila menerima wang yang bukan hak saya, saya akan…'},
 {title:'Berani bercakap benar',subtitle:'Mengaku kesilapan, memberi keterangan benar',color:'#efad9d',
  tasks:[{id:'vase',name:'Pasu di laluan',x:9,z:11,role:0,verb:'Lihat apa yang berlaku',item:'Kesilapan saya',hint:'Lihat pasu di laluan rumah Tok Aini.',text:'Semasa melalui laluan, kamu terlanggar pasu hingga pecah. Kamu terkejut dan takut dimarahi. Jangan sentuh serpihan tajam.'},
   {id:'witness',name:'Tempat saksi',x:5,z:10,role:1,verb:'Perhatikan kejadian',item:'Keterangan saksi',hint:'Perhatikan kejadian dari tempat selamat.',text:'Kamu nampak rakan terlanggar pasu secara tidak sengaja. Kamu boleh menjadi saksi yang bercakap benar tanpa menambah cerita.'}],
  npc:{id:'aini',name:'Tok Aini',x:13,z:11,shirt:'#ad83c7',text:'Pasu saya sudah pecah. Boleh kamu berdua ceritakan apa yang sebenarnya berlaku?'},
  question:'Apakah yang patut kamu katakan?',answers:['Ceritakan kejadian sebenar, minta maaf jika bersalah dan minta bantuan orang dewasa.','Salahkan kucing supaya rakan selamat.','Reka cerita supaya tiada sesiapa dimarahi.'],correct:0,
  feedback:'Orang yang melakukan kesilapan mengaku dengan jujur. Saksi pula memberi keterangan yang benar.',benefit:'Mengapakah bercakap benar membantu jiran?',benefits:['Orang lain boleh dipersalahkan.','Kesilapan boleh disembunyikan selama-lamanya.','Masalah dapat diselesaikan dan kepercayaan dipulihkan.'],benefitCorrect:2,
  plan:'Apabila melakukan atau menyaksikan kesilapan, saya akan…'}
];
export function walkable(x,z){return Number.isFinite(x)&&Number.isFinite(z)&&x>WORLD.min&&x<WORLD.max&&z>WORLD.min&&z<WORLD.max&&!WORLD.obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.45&&Math.abs(z-o.z)<o.d/2+.45)}
export function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
