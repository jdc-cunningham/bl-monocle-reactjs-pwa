export const draw_bg = () => {
  const lines = [
    'import display',
    'import vgr2d', // tmp fix,
    'def rectangle_vgr2d(self):',
    '  v = vgr2d.Rect(self.width, self.height, self.col)',
    '  return v.position(self.x, self.y)',
    'display.Rectangle.vgr2d = rectangle_vgr2d',
    'r = display.Rectangle(1, 1, 639, 399, display.GRAY2)',
    'display.show(r)'
  ];

  return lines.join('\n');
};
