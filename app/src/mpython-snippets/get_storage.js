export const get_storage = () => {
  const lines = [
    'def get_storage():',
    '  fs_stat = os.statvfs("/")',
    '  return str(fs_stat[0] * fs_stat[3])'
  ];

  return lines.join('\n');
};
