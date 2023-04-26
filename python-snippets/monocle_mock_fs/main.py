l = 4
a = ""
for f in range(l):
  a = "\n".join(open(f"main_{f}.py").readlines())
exec(a)