import os
import math
import time
import random
import curses
from curses import wrapper

def create_firework(stdscr, start_y, start_x, angle):
    particles = ['*', '✦', '✺', '✹', '✶', '⭐']
    colors = [
        curses.COLOR_RED,
        curses.COLOR_GREEN,
        curses.COLOR_YELLOW,
        curses.COLOR_BLUE,
        curses.COLOR_MAGENTA,
        curses.COLOR_CYAN
    ]
    
    for i, color in enumerate(colors):
        curses.init_pair(i + 1, color, curses.COLOR_BLACK)

    trail_length = 15
    for i in range(trail_length):
        stdscr.clear()
        y = start_y - int(i * math.cos(angle * 3.14159 / 180))
        x = start_x + int(i * math.sin(angle * 3.14159 / 180))
        if 0 <= y < curses.LINES and 0 <= x < curses.COLS:
            stdscr.addstr(y, x, '|', curses.color_pair(random.randint(1, len(colors))) | curses.A_BOLD)
        stdscr.refresh()
        time.sleep(0.05)

    for radius in range(1, 8):
        stdscr.clear()
        color = random.randint(1, len(colors))
        
        for angle in range(0, 360, 15):
            y = start_y - trail_length + int(radius * math.cos(angle * 3.14159 / 180))
            x = start_x + int(radius * 2 * math.sin(angle * 3.14159 / 180))
            
            if 0 <= y < curses.LINES and 0 <= x < curses.COLS:
                stdscr.addstr(y, x, random.choice(particles), 
                            curses.color_pair(color) | curses.A_BOLD)
        
        for angle in range(0, 360, 45):
            for trail_radius in range(1, 4):
                y = start_y - trail_length + int((radius + trail_radius) * math.cos(angle * 3.14159 / 180))
                x = start_x + int((radius + trail_radius) * 2 * math.sin(angle * 3.14159 / 180))
                
                if 0 <= y < curses.LINES and 0 <= x < curses.COLS:
                    stdscr.addstr(y, x, '|', curses.color_pair(color) | curses.A_BOLD)
        time.sleep(0.1)
        stdscr.refresh()

def main(stdscr):
    curses.start_color()
    curses.curs_set(0)
    stdscr.clear()

    particles = ['*', '✦', '✺', '✹', '✶', '⭐']
    colors = [
        curses.COLOR_RED,
        curses.COLOR_GREEN,
        curses.COLOR_YELLOW,
        curses.COLOR_BLUE,
        curses.COLOR_MAGENTA,
        curses.COLOR_CYAN
    ]

    for _ in range(5):
        start_x = random.randint(5, curses.COLS-5)
        start_y = random.randint(curses.LINES//2, curses.LINES-5)
        angle = random.randint(-45, 45)
        create_firework(stdscr, start_y, start_x, angle)
        time.sleep(0.2)

    stdscr.clear()
    message = "Happy New Year 2025"
    stdscr.addstr(curses.LINES // 2, (curses.COLS - len(message)) // 2, message, curses.A_BOLD | curses.A_BLINK)

    for _ in range(20):
        start_x = random.randint(5, curses.COLS-5)
        start_y = random.randint(5, curses.LINES-5)
        color = random.randint(1, len(colors))
        particle = random.choice(particles)
        if 0 <= start_y < curses.LINES and 0 <= start_x < curses.COLS:
            stdscr.addstr(start_y, start_x, particle, curses.color_pair(color) | curses.A_BOLD)
    
    stdscr.refresh()
    time.sleep(5)

wrapper(main)