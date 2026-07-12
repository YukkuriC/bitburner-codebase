import os

base_dir = os.path.abspath(os.path.join(__file__, '../..'))

ignored_dirs = [os.path.join(base_dir, f) for f in ['TOOLS', 'old']]


def is_script(filename):
    if filename.endswith('.d.ts'):
        return False
    return filename.endswith('.js') or filename.endswith('.ts')


def walk_without_ignored():
    for root, folders, files in os.walk(base_dir):
        if any(os.path.samefile(root, i) for i in ignored_dirs):
            continue
        yield root, folders, files
