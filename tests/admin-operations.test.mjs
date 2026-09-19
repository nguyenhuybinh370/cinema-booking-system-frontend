import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';

let server, dashboard, movies, client, MovieModal;
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
before(async () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => null } });
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  dashboard = await server.ssrLoadModule('/src/services/admin/dashboardService.js');
  movies = (await server.ssrLoadModule('/src/services/admin/movieService.js')).default;
  client = (await server.ssrLoadModule('/src/api/axiosClient.js')).default;
  MovieModal = (await server.ssrLoadModule('/src/components/Admin/Movies/MovieModal.jsx')).default;
});
after(async () => {
  await server?.close();
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else delete globalThis.localStorage;
});

test('cinema day uses Vietnam midnight, not UTC midnight', () => {
  assert.equal(dashboard.cinemaDay(new Date('2026-09-18T18:00:00Z')), '2026-09-19');
});

test('occupancy is weighted by capacity; refunds use total, not page size', () => {
  const data = dashboard.mapDashboard({ TongDoanhThu: '120000' }, [
    { GioChieu: '1970-01-01T12:00:00.000Z', TongSoGhe: 90, SoGheDaDat: 0 },
    { GioChieu: '1970-01-01T09:00:00.000Z', TongSoGhe: 10, SoGheDaDat: 10 },
  ], { data: [{}], pagination: { total: 42 } });
  assert.equal(data.occupancy, '10.0');
  assert.equal(data.revenue, 120000);
  assert.equal(data.pendingRefunds, 42);
  assert.match(data.showtimes[0].GioChieu, /09:00/);
});

test('empty dashboard has no invented values or division by zero', () => {
  const data = dashboard.mapDashboard({ TongDoanhThu: 0 }, [], { pagination: { total: 0 } });
  assert.equal(data.occupancy, '0.0');
  assert.equal(data.revenue, 0);
  assert.equal(data.showtimes.length, 0);
});

test('dashboard calls real endpoints with the correct filter and response envelopes', async () => {
  const calls = [];
  client.defaults.adapter = async config => {
    calls.push(config);
    const payload = config.url.includes('doanh-thu') ? { success: true, data: { TongDoanhThu: 50000 } }
      : config.url.includes('ti-le-ghe') ? { success: true, data: [] }
        : { success: true, data: [], pagination: { total: 8 } };
    return { config, status: 200, data: payload, headers: {} };
  };
  const result = await dashboard.getDashboard('2026-09-18');
  assert.equal(result.pendingRefunds, 8);
  assert.equal(result.revenue, 50000);
  assert.deepEqual(calls.find(call => call.url.includes('ti-le-ghe')).params, { tuNgay: '2026-09-18', denNgay: '2026-09-18' });
  assert.deepEqual(calls.find(call => call.url.includes('hoan-tien')).params, { trangThai: 'CHO_XU_LY', limit: 1 });
});

test('API failure rejects dashboard rather than silently displaying zero', async () => {
  client.defaults.adapter = async () => { throw new Error('offline'); };
  await assert.rejects(dashboard.getDashboard(), /offline/);
});

test('movie create/update/detail persist via API and normalize types', async () => {
  const calls = [];
  client.defaults.adapter = async config => {
    calls.push(config);
    return { config, status: 200, headers: {}, data: { success: true, data: { MaPhim: 'movie-id', TenPhim: 'Test', ThoiLuong: 120, KhaDung: false } } };
  };
  await movies.addMovie({ TenPhim: 'Test', ThoiLuong: '120', KhaDung: 0 });
  await movies.updateMovie('movie-id', { ThoiLuong: '90', KhaDung: 1, NgayKetThuc: '' });
  const movie = await movies.getMovie('movie-id');
  assert.deepEqual(calls.map(call => [call.method, call.url]), [['post', '/admin/phim'], ['put', '/admin/phim/movie-id'], ['get', '/phim/movie-id']]);
  assert.equal(JSON.parse(calls[0].data).KhaDung, false);
  assert.equal(JSON.parse(calls[0].data).ThoiLuong, 120);
  assert.equal(JSON.parse(calls[1].data).NgayKetThuc, null);
  assert.equal(movie.KhaDung, 0);
});

test('movie form disables editing and submit while saving', () => {
  const html = renderToStaticMarkup(createElement(MovieModal, { isOpen: true, isSubmitting: true, formData: {}, errors: {}, onClose() {}, onSubmit() {}, onChange() {} }));
  assert.match(html, /<fieldset disabled=""/);
  assert.match(html, /type="submit" disabled=""/);
  assert.match(html, /Đang lưu/);
});

test('operational routes no longer mount mock editors or CMS', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /path="\/admin\/movies\/new" element={<MovieEditor/);
  assert.doesNotMatch(app, /EntityEditor|ContentListPage|SiteSettingsPage|CatalogPage/);
  const stats = await readFile(new URL('../src/pages/Admin/Stats.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(stats, /adminContentData|showSuccess|handleExport/);
});
