import fs from 'node:fs';
import test from 'node:test';import assert from 'node:assert/strict';
import {SCENES,CHAPTERS,DURATION,clampTime,sceneAt,parseProgress,formatTime,sceneProgress} from '../src/animation-data.ts';
test('scenes cover the entire film without gaps or overlaps',()=>{assert.equal(SCENES[0].start,0);assert.equal(SCENES.at(-1).end,DURATION);for(let i=1;i<SCENES.length;i++)assert.equal(SCENES[i].start,SCENES[i-1].end);assert.equal(new Set(SCENES.map(s=>s.id)).size,SCENES.length);});
test('seeking to boundaries selects the next scene',()=>{for(const s of SCENES)assert.equal(sceneAt(s.start).id,s.id);assert.equal(sceneAt(DURATION).id,'page-21');});
test('invalid and excessive timestamps are clamped',()=>{assert.equal(clampTime(NaN),0);assert.equal(clampTime(Infinity),0);assert.equal(clampTime(-3),0);assert.equal(clampTime(DURATION+100),DURATION);assert.equal(clampTime('30'),0);});
test('stored progress is versioned and validates corrupt data',()=>{for(const raw of ['broken','null','{}','{"version":0,"time":30}','{"version":2,"time":"30"}'])assert.equal(parseProgress(raw),0);assert.equal(parseProgress('{"version":2,"time":36}'),36);assert.equal(parseProgress(JSON.stringify({version:2,time:DURATION+100})),DURATION);});
test('clock labels match the timeline',()=>{assert.equal(formatTime(0),'0:00');assert.equal(formatTime(62.9),'1:02');assert.equal(formatTime(75),'1:15');});
test('all scenes contain narration and a production visual key',()=>{for(const s of SCENES){assert.ok(s.end>s.start);assert.ok(s.line.length>30);assert.ok(s.visual);}});

test('scene motion follows seeks and resets at each cut',()=>{for(const s of SCENES){assert.equal(sceneProgress(s.start),0);assert.equal(sceneProgress((s.start+s.end)/2),.5);}assert.equal(sceneProgress(DURATION),1);assert.equal(sceneProgress(NaN),0);assert.equal(sceneProgress(-10),0);assert.equal(sceneProgress(999),1);});

test('all four chapters map to consecutive supplied pages and valid images',()=>{assert.deepEqual(SCENES.map(s=>s.page),Array.from({length:19},(_,i)=>i+3));assert.deepEqual(CHAPTERS.map(c=>c.number),[1,2,3,4]);for(const c of CHAPTERS){assert.equal(sceneAt(c.start).chapter,c.number);assert.equal(SCENES.find(s=>s.chapter===c.number).start,c.start);}for(const s of SCENES)assert.ok(fs.existsSync(new URL('../public'+s.image,import.meta.url)));});
test('old preview progress does not resume the new story',()=>{assert.equal(parseProgress('{"version":1,"time":36}'),0);});
test('caption timing and narration match all scenes',()=>{const vtt=fs.readFileSync(new URL('../public/animation/captions.vtt',import.meta.url),'utf8');assert.equal((vtt.match(/ --> /g)||[]).length,SCENES.length);for(const s of SCENES)assert.ok(vtt.includes(s.line));});
