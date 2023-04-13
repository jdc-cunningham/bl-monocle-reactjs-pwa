# this is just here for an example
# not used by JS codebase
# can paste this into a snippet box and run

import display
import time

display.text("Welcome, Jacob", 200, 150, 0xffffff)
display.show()

time.sleep(3)
display.text("Weather for Kansas City, KS", 0, 150, 0xffffff)
display.text("70F Partly sunny", 0, 200, 0xffffff)
display.show()

time.sleep(3)
display.text("Fetching top 5 articles from HN...", 0, 150, 0xffffff)
display.show()