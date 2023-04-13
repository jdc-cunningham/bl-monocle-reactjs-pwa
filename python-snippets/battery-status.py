import device
import display

def draw_battery_indicator(x_offset=0, y_offset=0, color=0xffffff):
    batt_level = device.battery_level()
    display.text("battery: " + str(batt_level) + "%",
                 x_offset + 170, y_offset + 12, color)

draw_battery_indicator()
display.show()
