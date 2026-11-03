#!/usr/bin/env node
// Builds the small looping site clips in public/media from the shop's own product photos (needs ffmpeg + ImageMagick).
// They are motion graphics: each product is cut out of its white photo and animated on a branded stage.
// Usage: node scripts/build-clips.mjs [--only name] (photos are cached in WORK, default ./.clip-work)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SITE = path.resolve(import.meta.dirname, '..')
const WORK = process.env.WORK ?? path.join(SITE, '.clip-work')
const OUT = path.join(SITE, 'public', 'media')
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null
const candidates = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'clip-sources.json'), 'utf8'))
const url = key => candidates[key] ?? (() => { throw new Error(`no source for ${key}`) })()

const CLIPS = {
  'hero': { size: [720, 900], crf: 29, shots: ['205905310_0', '194901050_0', '373431597_1', '1773168823_1', '204299407_2'] },
  'mode-gaming': { size: [600, 750], crf: 31, shots: ['205908678_0', '205908309_0', '205905310_0'] },
  'mode-audio': { size: [600, 750], crf: 31, shots: ['277465537_1', '204299407_2', '755035463_3'] },
  'mode-power': { size: [600, 750], crf: 31, shots: ['448101111_0', '373431597_0', '205870840_1'] },
  'mode-creator': { size: [600, 750], crf: 31, shots: ['1759742233_0', '1770231630_1', '1761647214_0'] },
  'mode-wearables': { size: [600, 750], crf: 31, shots: ['223271164_1', '602509664_0', '1773168823_3'] },
}
const RENDER = [720, 900]
const SHOT = 3, XFADE = 0.5, FPS = 24
const TRANSITIONS = ['slideleft', 'circleopen', 'slideup', 'wipeleft', 'circleclose']
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] })
const NAVY = '#111141', DEEP = '#0a0a2b', LIME = '#bfff31'

function stage(w, h) {
  const file = path.join(WORK, `stage-${w}x${h}.png`)
  if (fs.existsSync(file)) return file
  const grid = []
  for (let x = 0; x <= w; x += 48) grid.push(`line ${x},0 ${x},${h}`)
  for (let y = 0; y <= h; y += 48) grid.push(`line 0,${y} ${w},${y}`)
  const m = 26, l = 44
  const corners = [
    `line ${m},${m} ${m + l},${m}`, `line ${m},${m} ${m},${m + l}`,
    `line ${w - m},${m} ${w - m - l},${m}`, `line ${w - m},${m} ${w - m},${m + l}`,
    `line ${m},${h - m} ${m + l},${h - m}`, `line ${m},${h - m} ${m},${h - m - l}`,
    `line ${w - m},${h - m} ${w - m - l},${h - m}`, `line ${w - m},${h - m} ${w - m},${h - m - l}`,
  ]
  run('magick', ['-size', `${w}x${h}`, `radial-gradient:${NAVY}-${DEEP}`,
    '-fill', 'none', '-stroke', 'rgba(191,255,49,0.07)', '-strokewidth', '1', '-draw', grid.join(' '),
    '-stroke', LIME, '-strokewidth', '3', '-draw', corners.join(' '), file])
  return file
}

function disc(d) {
  const file = path.join(WORK, `disc-${d}.png`)
  if (fs.existsSync(file)) return file
  const c = d / 2, r = Math.round(d * 0.36)
  run('magick', ['-size', `${d}x${d}`, 'xc:none',
    '(', '-size', `${d}x${d}`, 'xc:none', '-fill', 'rgba(191,255,49,0.55)', '-draw', `circle ${c},${c} ${c},${c - r - 6}`, '-blur', `0x${Math.round(d * 0.05)}`, ')', '-composite',
    '-fill', LIME, '-draw', `circle ${c},${c} ${c},${c - r}`, file])
  return file
}

function ring(d) {
  const file = path.join(WORK, `ring-${d}.png`)
  if (fs.existsSync(file)) return file
  const c = d / 2, r = Math.round(d * 0.46), dashes = []
  for (let a = 0; a < 360; a += 30) dashes.push(`arc ${c - r},${c - r} ${c + r},${c + r} ${a},${a + 18}`)
  run('magick', ['-size', `${d}x${d}`, 'xc:none', '-fill', 'none', '-stroke', 'rgba(255,255,255,0.55)', '-strokewidth', '3', '-draw', dashes.join(' '), file])
  return file
}

function cutout(key, box) {
  const src = path.join(WORK, `${key}.img`), file = path.join(WORK, `${key}-${box}.png`)
  if (fs.existsSync(file)) return file
  if (!fs.existsSync(src)) run('curl', ['-sf', '-m', '40', '-o', src, url(key)])
  const p = `${box}x${box}`
  // Besides the outside background, remove large enclosed white areas (inside a headband, between straps);
  // the area threshold keeps small whites that belong to the product, such as watch digits.
  const holes = path.join(WORK, `${key}-holes.png`)
  run('magick', [src, '-resize', '1200x1200', '-bordercolor', 'white', '-border', '6', '-fuzz', '4%', '-fill', 'black', '+opaque', 'white',
    '-define', `connected-components:area-threshold=${Math.round(1212 * 1212 * 0.018)}`, '-define', 'connected-components:mean-color=true',
    '-connected-components', '8', '-threshold', '50%', holes])
  run('magick', [src, '-resize', '1200x1200', '-bordercolor', 'white', '-border', '6', '-alpha', 'set',
    '(', holes, '-negate', '-alpha', 'off', ')', '-compose', 'CopyAlpha', '-composite', '-compose', 'Over', '-shave', '6x6', '-trim', '+repage',
    '-channel', 'A', '-morphology', 'Erode', 'Disk:1.5', '-blur', '0x0.8', '+channel',
    '-resize', p, '-gravity', 'center', '-background', 'none', '-extent', p, `PNG32:${file}`])
  return file
}

function buildSegments(name, spec) {
  const [w, h] = RENDER, box = Math.round(w * 0.74), dd = Math.round(w * 0.98), segs = []
  const shots = [...spec.shots, spec.shots[0]]
  shots.forEach((key, i) => {
    const seg = path.join(WORK, `${name}-${i}.mp4`)
    const zoom = `(0.9+0.1*(1-pow(1-min(t/0.45\\,1)\\,3))+0.025*t/${SHOT})`
    const fg = `[3:v]scale=w='trunc(${box}*${zoom}/2)*2':h=-2:eval=frame:flags=bicubic,format=rgba,fade=t=in:st=0:d=0.25:alpha=1[p]`
    const ringf = `[2:v]rotate=a='0.35*t':c=none:ow=iw:oh=ih,format=rgba[r]`
    const discf = `[1:v]scale=w='trunc(${dd}*(0.72+0.28*(1-pow(1-min(t/0.5\\,1)\\,3)))/2)*2':h=-2:eval=frame,format=rgba[d]`
    const float = `(H-h)/2+10*sin(2*PI*t/${SHOT})+36*pow(1-min(t/0.45\\,1)\\,3)`
    run('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-framerate', String(FPS), '-t', String(SHOT), '-i', stage(w, h),
      '-loop', '1', '-framerate', String(FPS), '-t', String(SHOT), '-i', disc(dd),
      '-loop', '1', '-framerate', String(FPS), '-t', String(SHOT), '-i', ring(dd),
      '-loop', '1', '-framerate', String(FPS), '-t', String(SHOT), '-i', cutout(key, box),
      '-filter_complex', `${discf};${ringf};${fg};[0:v][d]overlay=x='(W-w)/2':y='(H-h)/2':eval=frame[a];[a][r]overlay=x='(W-w)/2':y='(H-h)/2'[b];[b][p]overlay=x='(W-w)/2':y='${float}':eval=frame,format=yuv420p,setsar=1[v]`,
      '-map', '[v]', '-t', String(SHOT), '-r', String(FPS), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', seg])
    segs.push(seg)
  })
  return segs
}

function joinSegments(name, spec, segs) {
  // Each transition overlaps by XFADE; the copy of the first shot at the end makes the loop seamless once trimmed.
  const inputs = segs.flatMap(s => ['-i', s])
  let chain = '', prev = '[0:v]', offset = SHOT - XFADE
  segs.slice(1).forEach((_, i) => {
    const label = `[x${i}]`
    chain += `${prev}[${i + 1}:v]xfade=transition=${TRANSITIONS[i % TRANSITIONS.length]}:duration=${XFADE}:offset=${offset}${label};`
    prev = label; offset += SHOT - XFADE
  })
  const end = offset - (SHOT - XFADE) + XFADE // end of the last transition
  const out = path.join(OUT, `${name}.mp4`)
  fs.mkdirSync(OUT, { recursive: true })
  run('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', `${chain}${prev}trim=start=${XFADE}:end=${end},setpts=PTS-STARTPTS,scale=${spec.size[0]}:${spec.size[1]}:flags=lanczos[v]`,
    '-map', '[v]', '-an', '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', String(spec.crf), '-movflags', '+faststart', out])
  // Poster: mid-way through the first shot, once its entrance has finished.
  const frame = path.join(WORK, `${name}-poster.png`)
  run('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '1.2', '-i', out, '-frames:v', '1', frame])
  run('magick', [frame, '-quality', '70', path.join(OUT, `${name}.webp`)])
}

fs.mkdirSync(WORK, { recursive: true })
for (const [name, spec] of Object.entries(CLIPS)) {
  if (only && only !== name) continue
  joinSegments(name, spec, buildSegments(name, spec))
  const mp4 = path.join(OUT, `${name}.mp4`)
  console.log(name, `${(fs.statSync(mp4).size / 1024).toFixed(0)} KB`)
}
