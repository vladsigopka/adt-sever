import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import browserSyncLib from 'browser-sync';
import { deleteAsync } from 'del';
import sharp from 'sharp';
import { readdir, mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';

const { src, dest, watch, series, parallel } = gulp;

const IMG_MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 82;
const sass = gulpSass(dartSass);
const bs = browserSyncLib.create();

const paths = {
  html: {
    src: 'src/html/pages/**/*.html',
    watch: 'src/html/**/*.html',
    dest: 'dist/',
  },
  styles: {
    src: 'src/scss/main.scss',
    watch: 'src/scss/**/*.scss',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/',
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dist/img/',
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/',
  },
  vendor: {
    src: 'src/vendor/**/*',
    dest: 'dist/vendor/',
  },
};

export const clean = () => deleteAsync(['dist']);

export function html() {
  return src(paths.html.src)
    .pipe(plumber())
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: 'src/html/',
        indent: true,
      })
    )
    .pipe(dest(paths.html.dest))
    .pipe(bs.stream());
}

export function styles() {
  return src(paths.styles.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(bs.stream());
}

export function scripts() {
  return src(paths.scripts.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest))
    .pipe(bs.stream());
}

async function walkFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walkFiles(full) : Promise.resolve([full]);
    })
  );
  return nested.flat();
}

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function images() {
  const srcRoot = 'src/img';
  const destRoot = 'dist/img';
  const files = await walkFiles(srcRoot);

  await Promise.all(
    files.map(async (file) => {
      const rel = path.relative(srcRoot, file);
      const out = path.join(destRoot, rel);
      const ext = path.extname(file).toLowerCase();
      await mkdir(path.dirname(out), { recursive: true });

      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const pipeline = sharp(file).rotate();
        const meta = await pipeline.metadata();
        if (meta.width && meta.width > IMG_MAX_WIDTH) {
          pipeline.resize({ width: IMG_MAX_WIDTH, withoutEnlargement: true });
        }

        const fallback = pipeline.clone();
        if (ext === '.png') fallback.png({ compressionLevel: 9, palette: true });
        else fallback.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });

        await Promise.all([
          fallback.toFile(out),
          pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(out.replace(/\.(png|jpe?g)$/i, '.webp')),
        ]);
        return;
      }

      if (ext === '.webp') {
        const hasRaster =
          (await fileExists(file.replace(/\.webp$/i, '.png'))) ||
          (await fileExists(file.replace(/\.webp$/i, '.jpg'))) ||
          (await fileExists(file.replace(/\.webp$/i, '.jpeg')));
        if (!hasRaster) await copyFile(file, out);
        return;
      }

      await copyFile(file, out);
    })
  );
}

export function fonts() {
  return src(paths.fonts.src, { encoding: false, allowEmpty: true }).pipe(dest(paths.fonts.dest));
}

export function vendor() {
  return src(paths.vendor.src, { encoding: false, allowEmpty: true }).pipe(dest(paths.vendor.dest));
}

function serve() {
  bs.init({
    server: { baseDir: 'dist' },
    notify: false,
    open: true,
  });

  watch(paths.styles.watch, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.html.watch, html);
  watch(paths.images.src, images);
  watch(paths.fonts.src, fonts);
  watch(paths.vendor.src, vendor);
}

export const build = series(
  clean,
  parallel(html, styles, scripts, images, fonts, vendor)
);

export default series(build, serve);
