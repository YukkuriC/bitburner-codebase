import os, traceback, json

try:
    import win32clipboard as wc
    import win32con
except:
    print('Install pywin32 first: pip install pywin32')
    exit()


def dump_clipboard(data):
    text = json.dumps(data, separators=',:')
    wc.OpenClipboard()
    wc.EmptyClipboard()
    wc.SetClipboardData(win32con.CF_UNICODETEXT, text)
    wc.CloseClipboard()
    return len(text)


data = {}
base_dir = os.path.abspath(os.path.join(__file__, '../..'))
from common import walk_without_ignored, is_script

for root, folders, files in walk_without_ignored():
    for f in files:
        if not is_script(f):
            continue
        absname = os.path.join(root, f)
        relname = os.path.relpath(absname, base_dir).replace('\\', '/')
        with open(absname, 'r', encoding='utf-8') as f:
            data[relname] = f.read()

tlen = dump_clipboard(data)
print(f'Copied: {len(data)} files, l={tlen}!')
print(f'Run "meta/s/load.js" to sync INSIDE')
