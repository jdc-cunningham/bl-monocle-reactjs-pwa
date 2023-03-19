import display

def draw_h_borders():
  display.hline(0, 0, 640, 0xffffff)
  # display.hline(0, 392, 640, 0xffffff)

def draw_dollar_sign(top_left_x = 50, top_left_y = 50, scale = 1, color = 0xffffff):
  display.line(top_left_x, top_left_y + 13, top_left_x, top_left_y + 25, color)

draw_h_borders()
draw_dollar_sign(50, 50, 1, 0xffffff)
display.show()

# the lines are too thick
# also have to round up float to int