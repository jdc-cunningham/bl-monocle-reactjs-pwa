import display

def draw_h_borders():
  display.hline(0, 0, 640, 0xffffff)
  display.hline(0, 392, 640, 0xffffff)

def draw_envelope(top_left_x = 50, top_left_y = 50, scale = 1, color = 0xffffff, has_message = False):
  display.line(top_left_x, top_left_y, top_left_x, top_left_y + 60, color)
  display.line(top_left_x, top_left_y, top_left_x + 100, top_left_y, color)
  display.line(top_left_x, top_left_y, top_left_x + 50, top_left_y + 30, color)
  display.line(top_left_x + 100, top_left_y, top_left_x + 50, top_left_y + 30, color)
  display.line(top_left_x + 100, top_left_y, top_left_x + 100, top_left_y + 60, color)
  display.line(top_left_x, top_left_y + 60, top_left_x + 100, top_left_y + 60, color)
  display.line(top_left_x, top_left_y + 60, top_left_x + 29, top_left_y + 26, color)
  display.line(top_left_x + 100, top_left_y + 60, top_left_x + 69, top_left_y + 26, color)

  if (has_message):
    display.hline(top_left_x + 80, top_left_y - 10, 25, 0xff0000)
    display.hline(top_left_x + 80, top_left_y - 6, 25, 0xff0000)

draw_h_borders()
draw_envelope(100, 200, 1, 0xffffff, True)
display.show()