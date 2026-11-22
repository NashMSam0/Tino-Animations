import {Component,signal,computed,OnDestroy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {SCENES,CHAPTERS} from './animation-data.js';
@Component({selector:'app-audio',standalone:true,imports:[RouterLink],templateUrl:'./audio.html',styleUrl:'./audio.css'})
export class Audio implements OnDestroy {
 scenes=SCENES;chapters=CHAPTERS;i=signal(0);playing=signal(false);rate=signal(1);captions=signal(true);voices=signal<SpeechSynthesisVoice[]>([]);voice=signal('');notice=signal('');scene=computed(()=>SCENES[this.i()]);items=computed(()=>SCENES.filter(s=>s.chapter===this.scene().chapter));gen=0;
 constructor(){try{const n=Number(localStorage.getItem('tino.audio.index'));if(Number.isInteger(n)&&n>=0&&n<SCENES.length)this.i.set(n)}catch{}if(this.ok){this.load();speechSynthesis.addEventListener('voiceschanged',this.load)}}
 get ok(){return typeof window!=='undefined'&&'speechSynthesis'in window} load=()=>{const v=speechSynthesis.getVoices();this.voices.set(v);if(!this.voice()&&v.length)this.voice.set(v.find(x=>x.lang.startsWith('en'))?.name||v[0].name)};
 play(){if(!this.ok){this.notice.set('Speech playback is unavailable in this browser.');return}if(this.playing())return;this.playing.set(true);this.say(this.i())} pause(){this.playing.set(false);this.gen++;if(this.ok)speechSynthesis.cancel()} toggle(){this.playing()?this.pause():this.play()}
 say(i:number){if(!this.playing())return;if(i>=SCENES.length){this.pause();this.notice.set('End of story.');return}this.i.set(i);try{localStorage.setItem('tino.audio.index',String(i))}catch{}const u=new SpeechSynthesisUtterance(SCENES[i].line),g=this.gen;u.rate=this.rate();const v=this.voices().find(x=>x.name===this.voice());if(v)u.voice=v;u.onend=()=>{if(g===this.gen&&this.playing())this.say(i+1)};u.onerror=()=>{if(g===this.gen){this.pause();this.notice.set('Voice playback stopped. Try another voice.')}};speechSynthesis.speak(u)}
 seek(i:number){this.pause();this.i.set(Math.max(0,Math.min(SCENES.length-1,i)));try{localStorage.setItem('tino.audio.index',String(this.i()))}catch{}} chapter(n:number){this.seek(SCENES.findIndex(s=>s.chapter===n))}
 onVoice(e:Event){this.voice.set((e.target as HTMLSelectElement).value);if(this.playing()){this.pause();this.play()}} onRate(e:Event){this.rate.set(Number((e.target as HTMLSelectElement).value));if(this.playing()){this.pause();this.play()}} ngOnDestroy(){this.pause();if(this.ok)speechSynthesis.removeEventListener('voiceschanged',this.load)}
}
