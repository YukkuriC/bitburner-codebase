import os

base_dir = os.path.abspath(os.path.join(__file__, '../..'))

ignored_dirs = [
    os.path.join(base_dir, f)
    for f in [
        'TOOLS',
        # 'old',
        # oh damn
        'node_modules',
        '.git',
    ]
]


def is_script(filename):
    if filename.endswith('.d.ts'):
        return False
    return filename.endswith('.js') or filename.endswith('.ts')


def walk_without_ignored(root=base_dir):
    folders, files = [], []
    folders_full = []
    for p in os.listdir(root):
        pp = os.path.join(root, p)
        if os.path.isdir(pp) and not any(os.path.samefile(pp, i) for i in ignored_dirs):
            folders.append(p)
            folders_full.append(pp)
        else:
            files.append(p)
    yield root, folders, files
    for sub in folders_full:
        yield from walk_without_ignored(sub)


if __name__ == '__main__':
    for root, folders, files in walk_without_ignored():
        jss = [f for f in files if is_script(f)]
        print(root, jss)
