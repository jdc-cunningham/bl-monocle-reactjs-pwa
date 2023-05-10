import display
import device
import json
import time
import gc

count = 1
article_count = 0

data_store = []

def load_json_data(data):
  global data_store, article_count

  data_store = json.loads(data)

  article_count = len(data_store)

def battery_level(battery_level, width = 75):
  p = display.Polyline([565, 0, 640, 0, 640, 24, 565, 24, 565, 0], display.WHITE, thickness=1)
  l = display.Line(570, 12, 570 + int(battery_level * width), 12, display.GREEN, thickness=12)
  m = display.Text(f'{int(battery_level * 67)}m', 640, 50, display.WHITE, justify=display.MIDDLE_RIGHT)
  return [p, l, m]

def main_text(msg):
  t = display.Text(msg, 65, 175, display.WHITE, justify=display.MIDDLE_LEFT)
  return [t] if msg else []

def reddit_icon(active):
  t = display.Text('Re', 0, 150, display.GREEN if active else display.WHITE, justify=display.MIDDLE_LEFT)
  bg = display.Rectangle(0, 125, 50, 175, display.GRAY7)

  d = [t]

  if (active):
    d.append(bg)

  return d

def load_reddit_articles():
  global count
  count = 1
  print('get_reddit_articles')

def hn_icon(active):
  t = display.Text('Hn', 0, 200, display.GREEN if active else display.WHITE, justify=display.MIDDLE_LEFT)
  bg = display.Rectangle(0, 175, 50, 225, display.GRAY7)

  d = [t]

  if (active):
    d.append(bg)

  return d

def load_hn_articles():
  global count
  count = 1
  print('get_hn_articles')

def draw_home(msg = '', reddit_active = False, hn_active = False):
  b = battery_level(round(device.battery_level() / 100, 2))
  return sum([b, main_text(msg), reddit_icon(reddit_active), hn_icon(hn_active)], [])

def read_articles():
  global data_store, count
  article = data_store[0]
  t = display.Text(f'{article} {count}/{article_count}', 0, 24, display.BLUE, justify=display.MIDDLE_LEFT)
  ls  = []

  comment = article['comment']

  y_pos = 24

  for line in comment:
    y_pos += 50
    tl = display.Text(line, 0, y_pos, display.WHITE, justify=display.MIDDLE_LEFT)
    ls.append(tl)

  display.clear()
  display.show(sum([t, ls], []))
  time.sleep(3)
  data_store.pop(0)
  
  if (len(data_store) > 0):
    count += 1
    read_articles()

# run app

display.show(main_text('Welcome, Jacob'))

time.sleep(3)

display.clear()
display.show(draw_home())

time.sleep(3)

display.clear()
display.show(draw_home('Loading reddit news...', True))

gc.collect()
load_reddit_articles()


# display.show(draw_home('Loading hn news...', False, True))



# display.show(sum([
#   battery_level(display, round(device.battery_level() / 100, 2)),
#   # welcome_msg(display, 'Jacob'),
#   # reddit_icon(True),
#   # hn_icon(False)
# ], []))

