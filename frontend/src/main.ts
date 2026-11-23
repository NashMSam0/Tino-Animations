import {Audio} from './audio.js';
import {Animation} from './animation.js';
import {StoryBackdrop} from './story-backdrop.js';
import {DatePipe} from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, Injectable, signal, computed, inject, isDevMode, HostListener } from '@angular/core';
import { provideRouter, Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface Story { id:string; title:string; slug:string; synopsis:string; theme:string; tag:string; sample:boolean; pageCount?:number; contentReady?:boolean; }
const providedStories:Story[] = [
 {id:'tawanda-story',slug:'if-only-i-had-known',title:'The Last Ordinary Moment',synopsis:'A journey back home. A family finding its way to forgiveness. And a reminder that the stories we inherit can change the lives we build.',theme:'earth',tag:'Family & belonging',sample:false,pageCount:21,contentReady:true},
 {id:'debt-ocean',slug:'the-debt-deeper-than-an-ocean',title:'The Debt Deeper Than an Ocean',synopsis:'A 17-page book supplied for the library.',theme:'ocean',tag:'Digital book',sample:false,pageCount:17,contentReady:false},
 {id:'gold-diamonds',slug:'in-search-of-gold-we-lost-diamonds',title:'In Search of Gold, We Lost Diamonds',synopsis:'A peaceful village leaves home in pursuit of gold, only to discover that wealth can cost time with family, friendships, peace and the simple blessings that made life happy.',theme:'gold',tag:'Page 1 supplied',sample:false,contentReady:false}
];
@Injectable({providedIn:'root'}) class Stories {
 all=signal<Story[]>(providedStories); status=signal('Connecting to the catalogue…'); query=signal(''); saved=signal<string[]>(this.load('tino.saved',[])); cart=signal<string[]>(this.load('tino.cart',[])); purchased=signal<string[]>(this.load('tino.purchases',[])); membershipUntil=signal<number>(this.load('tino.subscription',0)); page=signal<number>(this.load('tino.page',20)); notice=signal('');
 readonly demoBookPrice=40; readonly demoSubscriptionPrice=100; readonly currency='DEMO';
 constructor(){this.refresh();}
 load<T>(key:string,fallback:T):T {try {const v=JSON.parse(localStorage.getItem(key)||'null'); if(key==='tino.saved'||key==='tino.cart'||key==='tino.purchases') return (Array.isArray(v)&&v.every(x=>typeof x==='string')?v:fallback) as T; if(key==='tino.subscription')return (typeof v==='number'&&Number.isFinite(v)?v:fallback) as T; return (Number.isInteger(v)&&v>=1&&v<=21?v:fallback) as T;}catch{return fallback;}}
 persist(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{this.notice.set('Browser storage is unavailable. Your changes will last for this visit.');}}
 refresh(){this.all.set(providedStories);this.status.set('Your supplied books');}
 toggle(id:string){this.saved.update(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);this.persist('tino.saved',this.saved());}
 addToCart(id:string){if(id!=='tawanda-story'||this.purchased().includes(id)){this.notice.set('This title is not available to purchase.');return;}if(!this.cart().includes(id)){this.cart.update(items=>[...items,id]);this.persist('tino.cart',this.cart());this.notice.set('Added to your cart. Demo price only; no charge will be made.');}}
 removeFromCart(id:string){this.cart.update(items=>items.filter(item=>item!==id));this.persist('tino.cart',this.cart());}
 hasAccess(id:string){const book=this.all().find(item=>item.id===id);const published=!!book&&!book.sample&&book.contentReady!==false;return this.purchased().includes(id)||(published&&this.membershipUntil()>Date.now());}
isMembershipActive(){return this.membershipUntil()>Date.now();}
 simulateCheckout(){const eligible=this.cart().filter(id=>id==='tawanda-story');if(!eligible.length){this.notice.set('Your cart has no purchasable demo books.');return;}this.purchased.update(items=>[...new Set([...items,...eligible])]);this.persist('tino.purchases',this.purchased());this.cart.set([]);this.persist('tino.cart',[]);this.notice.set('Demo checkout complete. The featured story is unlocked; no payment was taken.');}
 simulateSubscription(){this.membershipUntil.set(Date.now()+30*24*60*60*1000);this.persist('tino.subscription',this.membershipUntil());this.notice.set('Demo membership active for 30 days. No payment was taken.');}
 resetSimulation(){this.purchased.set([]);this.membershipUntil.set(0);this.cart.set([]);this.page.set(20);for(const key of ['tino.purchases','tino.subscription','tino.cart','tino.page']){try{localStorage.removeItem(key);}catch{}}this.notice.set('Demo purchases, membership and cart have been reset.');}
 formatDemoPrice(amount:number){return this.currency+' '+amount.toFixed(2);}
 accessibleCount(){return this.all().filter(book=>this.hasAccess(book.id)).length;}
 coverImage(id:string){if(id==='tawanda-story')return '/animation/pages/page-01.jpeg';if(id==='debt-ocean')return '/covers/debt-deeper-than-ocean.svg';if(id==='gold-diamonds')return '/covers/in-search-of-gold.svg';return '';}
 bookPageUrl(page:number){return '/animation/pages/page-'+String(page).padStart(2,'0')+'.jpeg';} turn(page:number){this.page.set(page);this.persist('tino.page',page);}
}
@Component({selector:'app-experience',standalone:true,imports:[RouterLink,DatePipe,StoryBackdrop],templateUrl:'./experience.html'})
class Experience {
 store=inject(Stories);router=inject(Router);url=signal(this.router.url.split('?')[0]);mode=signal('text');font=signal(21);
 section=computed(()=>this.url().split('/')[1]||'home');
 selected=computed(()=>this.store.all().find(s=>s.slug===this.url().split('/')[2])||providedStories[0]);
 filtered=computed(()=>this.store.all().filter(s=>(this.section()!=='library'||this.store.hasAccess(s.id))&&[s.title,s.synopsis,s.tag].join(' ').toLowerCase().includes(this.store.query().toLowerCase())));
 cartItems=computed(()=>this.store.cart().map(id=>this.store.all().find(s=>s.id===id)).filter((s):s is Story=>!!s));
 libraryItems=computed(()=>this.store.all().filter(s=>this.store.hasAccess(s.id)));
 constructor(){this.router.events.pipe(takeUntilDestroyed()).subscribe(e=>{if(e instanceof NavigationEnd){this.url.set(e.urlAfterRedirects.split('?')[0]);this.store.query.set('');window.scrollTo(0,0);}});}
 search(e:Event){this.store.query.set((e.target as HTMLInputElement).value);}
 @HostListener('window:keydown',['$event']) key(e:KeyboardEvent){if(this.section()!=='read'||(e.target as HTMLElement).matches('input,button,textarea'))return;if(e.key==='ArrowRight')this.store.turn(Math.min(21,this.store.page()+1));if(e.key==='ArrowLeft')this.store.turn(Math.max(1,this.store.page()-1));}
}
@Component({selector:'app-root',standalone:true,imports:[RouterLink,RouterOutlet],template:`
<a class="skip" href="#main">Skip to content</a>
<div class="demo-banner"><strong>DEMO STORE</strong><span>Zimbabwe first &middot; English first &middot; Shona and Ndebele planned</span><span>Simulated purchases only · no real charges</span></div>
<header><a class="brand" routerLink="/" aria-label="The African Imagination Library home"><span class="brand-icon" aria-hidden="true">&#10022;</span><span class="brand-name"><span>The African</span><span class="brand-bottom">Imagination Library</span></span></a>
<nav aria-label="Main navigation"><a routerLink="/" [class.active]="path()==='/'">Discover</a><a routerLink="/explore" [class.active]="path()==='/explore'">Books</a><a routerLink="/membership" [class.active]="path()==='/membership'">Membership</a><a routerLink="/audio" [class.active]="path()==='/audio'">Audio</a><a routerLink="/animation" [class.active]="path()==='/animation'">Animation</a><a routerLink="/learning" [class.active]="path()==='/learning'">Learning</a></nav>
<div class="header-actions"><a class="cart-link" routerLink="/cart" [attr.aria-label]="'Cart, '+store.cart().length+' books'">Cart <b>{{store.cart().length}}</b></a><a class="library-link" routerLink="/library">My library <b>{{store.accessibleCount()}}</b></a></div></header>
<main id="main"><router-outlet/></main>
<footer><a class="footer-brand" routerLink="/">The African Imagination Library</a><p>Where African Stories Come Alive</p><span>Zimbabwe first &middot; African stories for curious young readers</span></footer>
@if(store.notice()){<div class="toast" role="status">{{store.notice()}}<button (click)="store.notice.set('')" aria-label="Dismiss notification">×</button></div>}
`})
class App {store=inject(Stories);router=inject(Router);path=signal(this.router.url);constructor(){this.router.events.pipe(takeUntilDestroyed()).subscribe(e=>{if(e instanceof NavigationEnd)this.path.set(e.urlAfterRedirects);});}}
bootstrapApplication(App,{providers:[provideRouter([{path:'',component:Experience},{path:'explore',component:Experience},{path:'library',component:Experience},{path:'cart',component:Experience},{path:'membership',component:Experience},{path:'story/:slug',component:Experience},{path:'read/:slug',component:Experience},{path:'audio',component:Audio},{path:'animation',component:Animation},{path:'learning',component:Experience},{path:'**',redirectTo:''}]),provideServiceWorker('ngsw-worker.js',{enabled:!isDevMode(),registrationStrategy:'registerWhenStable:30000'})]}).catch(console.error);

