import display

def draw_h_borders():
  display.hline(0, 0, 640, 0xffffff)
  display.hline(0, 392, 640, 0xffffff)

# 10 objects
def draw_envelope(top_left_x, top_left_y, scale, color, has_message):
  display.line(50, 50, 50, 110, color)
  display.line(50, 50, 150, 50, color)
  display.line(50, 50, 100, 80, color)
  display.line(150, 50, 100, 80, color)
  display.line(150, 50, 150, 110, color)
  display.line(50, 110, 150, 110, color)
  display.line(50, 110, 79, 76, color)
  display.line(150, 110, 119, 76, color)

  if (has_message):
    display.hline(130, 40, 25, 0xff0000)
    display.hline(130, 44, 25, 0xff0000)

draw_h_borders()
draw_envelope(50, 50, 1, 0xffffff, True)
display.show()