def run():
  l = 3
  a = ""
  for f in range(l):
    a = "\n".join(open(f"scenes_{f}.py").readlines())
  exec(a)
