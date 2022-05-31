import os, traceback

try:
    import win32clipboard as wc
    import win32con
except:
    print('Install pywin32 first: pip install pywin32')
    exit()

try:
    wc.OpenClipboard()
    raw = wc.GetClipboardData(win32con.CF_UNICODETEXT)
    wc.CloseClipboard()
    raw = eval(raw)  # {filename:code}
except:
    print('Illegal clipboard!')
    traceback.print_exc()
    exit()

base_dir = os.path.abspath(os.path.join(__file__, '..'))
# remove old
for root, folders, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.js') and f not in raw:
            os.remove(os.path.join(root, f))
    if not os.listdir(root):
        os.removedirs(root)
# create new
for filename, code in raw.items():
    path = os.path.abspath(os.path.join(base_dir, filename.lstrip('/')))
    os.makedirs(os.path.dirname(path), exist_ok=1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)
