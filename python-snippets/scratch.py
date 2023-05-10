import display
import device
import json
import time
import gc

count = 1
article_count = 0

data_store = []

last_displayed = []

def clear_display():
  global last_displayed

  for disp_obj in last_displayed:
    del(disp_obj)

  display.clear()
  gc.collect()

def load_json_data(data):
  global data_store, article_count

  data_store = json.loads(data)

  article_count = len(data_store)

def battery_level(battery_level, width = 75):
  bl_p = display.Polyline([565, 0, 640, 0, 640, 24, 565, 24, 565, 0], display.WHITE, thickness=1)
  bl_l = display.Line(570, 12, 570 + int(battery_level * width), 12, display.GREEN, thickness=12)
  bl_m = display.Text(f'{int(battery_level * 67)}m', 640, 50, display.WHITE, justify=display.MIDDLE_RIGHT)

  return [bl_p, bl_l, bl_m]

def main_text(msg):
  global last_displayed

  mt_t = display.Text(msg, 65, 175, display.WHITE, justify=display.MIDDLE_LEFT)

  last_displayed.append(mt_t)

  return [mt_t] if msg else []

def reddit_icon(active):
  global ri_t, ri_bg

  ri_t = display.Text('Re', 0, 150, display.GREEN if active else display.WHITE, justify=display.MIDDLE_LEFT)
  ri_bg = display.Rectangle(0, 125, 50, 175, display.GRAY7)

  d = [ri_t]

  if (active):
    d.append(ri_bg)

  return d

def load_reddit_articles():
  global count
  count = 1
  print('get_reddit_articles')

def hn_icon(active):
  global hi_t, hi_bg

  hi_t = display.Text('Hn', 0, 200, display.GREEN if active else display.WHITE, justify=display.MIDDLE_LEFT)
  hi_bg = display.Rectangle(0, 175, 50, 225, display.GRAY7)

  d = [hi_t]

  if (active):
    d.append(hi_bg)

  return d

def load_hn_articles():
  global count
  count = 1
  print('get_hn_articles')

def draw_home(msg = '', reddit_active = False, hn_active = False):
  global last_displayed

  dh_b = battery_level(round(device.battery_level() / 100, 2))

  last_displayed.append(dh_b)

  return sum([dh_b, main_text(msg), reddit_icon(reddit_active), hn_icon(hn_active)], [])

def display_article(title, lines):
  global last_displayed

  y_pos = 24

  t = display.Text(f'{title} {count}/{article_count}', 0, 24, display.BLUE, justify=display.MIDDLE_LEFT)
  l1 = display.Text(lines[0], 0, y_pos + 50, display.WHITE, justify=display.MIDDLE_LEFT) if 0 < len(lines) else []
  l2 = display.Text(lines[1], 0, y_pos + 100, display.WHITE, justify=display.MIDDLE_LEFT) if 1 < len(lines) else []
  l3 = display.Text(lines[2], 0, y_pos + 150, display.WHITE, justify=display.MIDDLE_LEFT) if 2 < len(lines) else []
  l4 = display.Text(lines[3], 0, y_pos + 200, display.WHITE, justify=display.MIDDLE_LEFT) if 3 < len(lines) else []
  l5 = display.Text(lines[4], 0, y_pos + 250, display.WHITE, justify=display.MIDDLE_LEFT) if 4 < len(lines) else []
  l6 = display.Text(lines[5], 0, y_pos + 300, display.WHITE, justify=display.MIDDLE_LEFT) if 5 < len(lines) else []
  l7 = display.Text(lines[6], 0, y_pos + 350, display.WHITE, justify=display.MIDDLE_LEFT) if 6 < len(lines) else []

  last_displayed = [t, l1, l2, l3, l4, l5, l6, l7]

  display.show([t, l1, l2, l3, l4, l5, l6, l7])

def read_articles():
  global data_store, count
  article = data_store[0]
  title = article['title']
  comment = article['comment']

  clear_display()
  display_article(title, comment)
  time.sleep(3)
  data_store.pop(0)
  
  if (len(data_store) > 0):
    count += 1
    clear_display()
    read_articles()

# run app

display.show(main_text('Welcome, Jacob'))

time.sleep(3)

clear_display()
display.show(draw_home())

time.sleep(3)

clear_display()
display.show(draw_home('Loading reddit news...', True))

gc.collect()
load_reddit_articles()
