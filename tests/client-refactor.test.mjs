import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

let server, clientService, publicClient;

before(async () => {
  server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    optimizeDeps: { noDiscovery: true },
    appType: 'custom',
  });
  clientService = (await server.ssrLoadModule('/src/services/clientService.js')).default;
  publicClient = (await server.ssrLoadModule('/src/api/axiosPublic.js')).default;
});

after(async () => server?.close());

test('client routes share one layout and direct booking uses an entry guard', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(app, /<Route element={<ClientLayout \/>}>/);
  assert.match(app, /path="\/booking\/:showtimeId" element={<BookingEntry \/>}/);
  assert.doesNotMatch(app, /Checkout|MovieDetail from/);
});

test('home is orchestration-only instead of owning API and card implementation', async () => {
  const home = await readFile(new URL('../src/pages/Client/Home.jsx', import.meta.url), 'utf8');
  assert.match(home, /useHomeContent/);
  assert.match(home, /<HomeHero/);
  assert.match(home, /<MovieSection/);
  assert.match(home, /<TodayShowtimes/);
  assert.doesNotMatch(home, /axios|const MovieCard|dummyShowsData/);
  assert.ok(home.split('\n').length < 60);
});

test('public showtime detail maps the IDs needed by the booking flow', async () => {
  publicClient.defaults.adapter = async (config) => ({
    config,
    status: 200,
    headers: {},
    data: {
      success: true,
      data: {
        MaSuatChieu: 'show-1',
        MaPhim: 'movie-1',
        MaPhong: 'room-1',
        NgayChieu: '2026-09-19T00:00:00.000Z',
        GioChieu: '1970-01-01T12:30:00.000Z',
        GiaVeGoc: '85000',
        KhaDung: true,
        Phim: { MaPhim: 'movie-1', TenPhim: 'Nex Movie', ThoiLuong: 120 },
        PhongChieu: { TenPhong: 'Phòng 01', LoaiPhong: { TenLoaiPhong: '2D' } },
      },
    },
  });

  const showtime = await clientService.getShowtimeById('show-1');
  assert.equal(showtime.MaSuatChieu, 'show-1');
  assert.equal(showtime.MaPhim, 'movie-1');
  assert.equal(showtime.TenPhim, 'Nex Movie');
  assert.equal(showtime.TenPhong, 'Phòng 01');
});
