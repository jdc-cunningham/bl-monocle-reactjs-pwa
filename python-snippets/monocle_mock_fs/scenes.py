def run():
  l = 2
  a = ""
  for f in range(l):
    a = "\n".join(open(f"scenes_{f}.py").readlines())
  print(a)
  exec(a)
  exec('home()')

run()