import display

x_pos = 0
y_pos = 0
char_count = 0

for i in range (1):
  for j in range (5):
    display.text("a", x_pos, y_pos, 0xffffff) 
    char_count += 1
    x_pos += 1

  y_pos += 50

print(char_count)

display.show()

# this doesn't work... keeps saying ENOMEM
# maybe once it hits ENOMEM it has to restart (monocle)
import display

def draw_envelope(top_left_x, top_left_y, scale, color):
  display.line(0, 0, 0, 6, color)


draw_envelope(0, 0, 1, 0xffffff)
display.show()
  