def run():
  l = 3
  a = ""
  for f in range(l):
    l = open("main.py_" + l + ".py").readlines()
    a += l.join("\n")
  print(a)
  exec(a)

run()