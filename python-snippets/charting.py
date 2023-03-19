import display

def draw_h_borders():
  display.hline(0, 0, 640, 0xffffff)
  display.hline(0, 392, 640, 0xffffff)

# chart_title: string
# x_values: array
# y_values: array of arrays
# title_color: hex
# y_colors: array of hexes

def draw_chart(chart_title, x_values, y_values, chart_type = "line", title_color = 0xffffff, x_color = 0xffffff, y_colors = [0xffffff]):
  chart_width = 590
  chart_height = 300

  x_width = int(590 / len(x_values))
  y_height = int(300 / len(y_values[0]))

  display.text(chart_title, 240, 0, title_color)

  x_pos = 50
  y_pos = 50

  points = []
  x_id = 0
  run_count = 0

  # build plot data
  for y_set in y_values:
    for y in y_set:
      points.append([x_values[x_id], y])
      x_id += 1

    x_id = 0
    y_pos += y_height
    run_count += 1
  x_pos += x_width

  
  # plot data
  cur_point = 0

  for point in points:
    if (cur_point > 0):
      display.line(points[cur_point - 1][0], points[cur_point - 1][1], points[cur_point][0], points[cur_point][1], y_colors[0])

    cur_point += 1

draw_h_borders()

draw_chart(
  "My chart",
  [50, 100, 150],
  [[50, 100, 150]],
  "line"
)

display.show()