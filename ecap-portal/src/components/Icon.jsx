import React from 'react';

const paths = {
  sun:      [{ tag: 'circle', cx: 12, cy: 12, r: 5 }, { tag: 'path', d: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' }],
  moon:     [{ tag: 'path', d: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' }],
  user:     [{ tag: 'path', d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' }, { tag: 'circle', cx: 12, cy: 7, r: 4 }],
  lock:     [{ tag: 'rect', x: 3, y: 11, width: 18, height: 11, rx: 2 }, { tag: 'path', d: 'M7 11V7a5 5 0 0110 0v4' }],
  book:     [{ tag: 'path', d: 'M4 19.5A2.5 2.5 0 016.5 17H20' }, { tag: 'path', d: 'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z' }],
  chart:    [{ tag: 'path', d: 'M18 20V10M12 20V4M6 20v-6' }],
  upload:   [{ tag: 'path', d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12' }],
  log:      [{ tag: 'path', d: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' }, { tag: 'path', d: 'M14 2v6h6M16 13H8M16 17H8M10 9H8' }],
  logout:   [{ tag: 'path', d: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9' }],
  award:    [{ tag: 'circle', cx: 12, cy: 8, r: 7 }, { tag: 'path', d: 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12' }],
  check:    [{ tag: 'path', d: 'M22 11.08V12a10 10 0 11-5.93-9.14' }, { tag: 'path', d: 'M22 4L12 14.01l-3-3' }],
  search:   [{ tag: 'circle', cx: 11, cy: 11, r: 8 }, { tag: 'path', d: 'M21 21l-4.35-4.35' }],
  home:     [{ tag: 'path', d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }, { tag: 'path', d: 'M9 22V12h6v10' }],
  users:    [{ tag: 'path', d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' }, { tag: 'circle', cx: 9, cy: 7, r: 4 }, { tag: 'path', d: 'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' }],
  key:      [{ tag: 'path', d: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4' }],
  download: [{ tag: 'path', d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' }],
};

export default function Icon({ name, size = 20 }) {
  const items = paths[name];
  if (!items) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {items.map((el, i) => {
        if (el.tag === 'circle') return <circle key={i} cx={el.cx} cy={el.cy} r={el.r} />;
        if (el.tag === 'rect')   return <rect key={i} x={el.x} y={el.y} width={el.width} height={el.height} rx={el.rx} />;
        return <path key={i} d={el.d} />;
      })}
    </svg>
  );
}
