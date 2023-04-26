def run(as, a):
  afs = as[a]

  for f in range(afs):
    l = open(a + '_' + f + '.py').readlines()
    ac += l.join('\n')

  exec(ac)