import {Component,computed,signal,OnDestroy,ViewChild,ElementRef,HostListener} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SCENES,CHAPTERS,DURATION,clampTime,sceneAt,sceneProgress,formatTime,parseProgress} from './animation-data.js';

@Component({selector:'app-animation',standalone:true,imports:[RouterLink],templateUrl:'./animation.html',styleUrl:'./animation.css'})
export class Animation implements OnDestroy {
 readonly scenes=SCENES;readonly chapters=CHAPTERS;readonly duration=DURATION;readonly clock=formatTime;
 time=signal(0);playing=signal(false);captions=signal(true);voice=signal(false);speed=signal(1);saved=signal(false);message=signal('');
 scene=computed(()=>sceneAt(this.time()));percent=computed(()=>this.time()/DURATION*100);
 progress=computed(()=>sceneProgress(this.time()));
 readonly sceneBeats:Record<number,{action:string;prop:string;icon:string}>= {
  3:{action:'A boy grows up at home, surrounded by family and the Victoria Falls countryside.',prop:'Home & family',icon:'⌂'},
  4:{action:'Tawanda says goodbye and promises his father he will come back.',prop:'The journey to the city',icon:'▰'},
  5:{action:'A work call pulls Tawanda away while his family celebrates the harvest.',prop:'Harvest festival',icon:'✦'},
  6:{action:'His father asks for time together; Tawanda turns away from the conversation.',prop:'A difficult talk',icon:'…'},
  7:{action:'Tawanda chooses the presentation and misses his father’s birthday.',prop:'Missed birthday',icon:'🎂'},
  8:{action:'His father calls; Tawanda sees the missed calls after celebrating his promotion.',prop:'Missed call',icon:'☎'},
  9:{action:'His father writes down what he wants to discuss, but another call goes unanswered.',prop:'A list for their talk',icon:'✉'},
  10:{action:'At the clinic, his father needs care while Thandi urges Tawanda to slow down.',prop:'Clinic visit',icon:'＋'},
  11:{action:'A heartfelt letter reaches Tawanda, but work delays his trip again.',prop:'Father’s letter',icon:'✉'},
  12:{action:'A happy promise to visit is interrupted by another meeting and a night-time call.',prop:'The call that changes things',icon:'☎'},
  13:{action:'The urgent call sends Tawanda packing and onto the dawn bus home.',prop:'The journey home',icon:'▰'},
  14:{action:'At the hospital, father and son hold hands and finally speak openly.',prop:'A long-awaited reunion',icon:'♡'},
  15:{action:'His father explains the farm plan; Tawanda agrees to share responsibility.',prop:'The family farm',icon:'♧'},
  16:{action:'Tawanda walks through the homestead and reconnects with the people there.',prop:'Back at the homestead',icon:'⌂'},
  17:{action:'The family shares a meal, and laughter returns around the table.',prop:'A family meal',icon:'◉'},
  18:{action:'His father passes down the pocket watch and the family’s responsibility.',prop:'The pocket watch',icon:'◷'},
  19:{action:'An old chest reveals a dream his father once set aside.',prop:'The old chest',icon:'▣'},
  20:{action:'A letter reveals the old land dispute; Tawanda embraces his father.',prop:'A letter and forgiveness',icon:'✉'},
  21:{action:'The family plans together, and Tawanda imagines a future in community farming.',prop:'A new beginning',icon:'♧'}
 };
 beat(page:number){return this.sceneBeats[page]??{action:'The story moves forward.',prop:'The story',icon:'✦'};}
 isMoving(){return [4,13,16,21].includes(this.scene().page);}
 isWorking(){return [5,7,8,9,11,12].includes(this.scene().page);}
 isReuniting(){return [14,17,20].includes(this.scene().page);}
 isMotherPresent(){return [13,14,16,17,20,21].includes(this.scene().page);}
 localVideo=signal('');localName=signal('');
 voiceSupported=typeof window!=='undefined'&&'speechSynthesis' in window;
 @ViewChild('screen') screen?:ElementRef<HTMLElement>;
 private frame=0;private last=0;private persistedSecond=-1;private spokenScene='';private speech?:SpeechSynthesisUtterance;
 constructor(){
  try{this.time.set(parseProgress(localStorage.getItem('tino.last-ordinary-moment.progress')));this.saved.set(localStorage.getItem('tino.last-ordinary-moment.saved')==='true');}catch{}
 }
 toggle(){this.playing()?this.pause():this.play();}
 play(){if(this.playing())return;if(this.time()>=DURATION)this.seek(0);this.playing.set(true);this.last=performance.now();this.speak();this.frame=requestAnimationFrame(t=>this.tick(t));}
 pause(){this.playing.set(false);cancelAnimationFrame(this.frame);this.stopVoice();this.persist();}
 private tick(now:number){
  if(!this.playing())return;
  this.time.set(clampTime(this.time()+Math.min((now-this.last)/1000,0.25)*this.speed()));this.last=now;
  if(this.voice()&&this.spokenScene!==this.scene().id)this.speak();
  if(Math.floor(this.time())!==this.persistedSecond){this.persistedSecond=Math.floor(this.time());this.persist();}
  if(this.time()>=DURATION){this.pause();return;}
  this.frame=requestAnimationFrame(t=>this.tick(t));
 }
 seek(value:number){this.last=performance.now();this.time.set(clampTime(value));this.stopVoice();this.persist();if(this.playing())this.speak();}
 scrub(event:Event){this.seek(Number((event.target as HTMLInputElement).value));}
 setSpeed(event:Event){this.speed.set(Number((event.target as HTMLSelectElement).value));if(this.playing())this.speak();}
 toggleCaptions(){this.captions.update(v=>!v);}
 toggleVoice(){if(!this.voiceSupported)return;this.voice.update(v=>!v);this.stopVoice();if(this.voice()&&this.playing())this.speak();}
 private speak(){
  if(!this.voice()||!this.voiceSupported)return;
  window.speechSynthesis.cancel();this.spokenScene=this.scene().id;
  const speech=new SpeechSynthesisUtterance(this.scene().line);speech.lang='en';speech.rate=this.speed();this.speech=speech;
  speech.onerror=event=>{if(event.error!=='interrupted'&&event.error!=='canceled'){this.message.set('Browser narration could not play. Captions and the transcript are available.');this.voice.set(false);}};
  window.speechSynthesis.speak(speech);
 }
 private stopVoice(){if(this.voiceSupported&&this.speech){window.speechSynthesis.cancel();this.speech=undefined;}this.spokenScene='';}
 private persist(){try{localStorage.setItem('tino.last-ordinary-moment.progress',JSON.stringify({version:2,time:this.time()}));}catch{this.message.set('Progress could not be saved on this browser.');}}
 toggleSave(){this.saved.update(v=>!v);try{localStorage.setItem('tino.last-ordinary-moment.saved',String(this.saved()));}catch{this.message.set('Watchlist changes will last for this visit only.');}}
 async fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await this.screen?.nativeElement.requestFullscreen();}catch{this.message.set('Full screen is not available in this browser.');}}
 preview(event:Event){
  const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;
  if(file.size>500*1024*1024||!['video/mp4','video/webm'].includes(file.type)){this.message.set('Choose an MP4 or WebM video under 500 MB.');input.value='';return;}
  this.pause();this.closeVideo();this.localName.set(file.name);this.localVideo.set(URL.createObjectURL(file));input.value='';
 }
 closeVideo(){if(this.localVideo())URL.revokeObjectURL(this.localVideo());this.localVideo.set('');this.localName.set('');}
 mediaError(){this.message.set('This video codec is not supported by your browser. Try an H.264 MP4 or WebM file.');}
 @HostListener('document:visibilitychange') visibility(){if(document.hidden)this.pause();}
 @HostListener('window:keydown',['$event']) key(e:KeyboardEvent){if(!(e.target instanceof HTMLElement)||!this.screen?.nativeElement.contains(e.target)||e.target.matches('button,input,select,video,a'))return;if(e.key===' '){e.preventDefault();this.toggle();}if(e.key==='ArrowRight'){e.preventDefault();this.seek(this.time()+5);}if(e.key==='ArrowLeft'){e.preventDefault();this.seek(this.time()-5);}}
 ngOnDestroy(){this.pause();this.closeVideo();}
}
