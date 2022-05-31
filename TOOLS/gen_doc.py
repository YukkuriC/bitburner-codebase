import os, re
from functools import lru_cache
from io import StringIO

base_dir = os.path.abspath(__file__ + '/../..')
os.chdir(base_dir)

headers = ['Code', 'Description', 'Dependency', 'Tags']
tag_colors = {
    'exe': 'gold',
    'exploit': '%23ff0000',
    'info': 'cyan',
    'search': 'blue',
    'hack': 'green',
    'singularity': 'purple',
}
root_cut_line = '<!-- begin script info -->'

if 'helpers':

    def link_path(path):
        path = path.lstrip('/')
        path = os.path.abspath(path)
        path = os.path.relpath(path, base_dir)
        if not path.startswith('.'):
            path = './' + path
        return path.replace('\\', '/')

    def display_path(path):
        path = link_path(path)[1:]
        if not path:
            path = '/'
        return path

    def md_link(path, root):
        lp = link_path(path)
        ld = display_path(path)
        lr = link_path(os.path.relpath(lp, root))
        return f'[{ld}]({lr})'

    @lru_cache(None)
    def code_content(path):
        path = link_path(path)
        with open(path, encoding='utf-8') as f:
            code = f.read()
        return code

    def descriptions(path):
        code = code_content(path)
        res = []
        for l in code.split('\n'):
            l = l.strip()
            if not l.startswith('//'):
                break
            res.append(l[2:].strip())
        return '<br>'.join(res)

    @lru_cache(None)
    def dependency(path):
        code = code_content(path)
        dep = re.findall(r'''import {.*} from ['"](.+)['"]''', code)
        for i, f in enumerate(dep):
            if not f.endswith('.js'):
                dep[i] = f + '.js'
        dep = set(dep)

        idep = set()
        for f in dep:
            dd, di = dependency(link_path(f))
            idep |= set(dd + di)
        idep -= dep

        return sorted(dep), sorted(idep)

    def tag_from_text(text):
        style = ''
        color = tag_colors.get(text, 'black')
        return f'[![{text}](https://img.shields.io/badge/-{text}-{color})](#{text})'

    @lru_cache(None)
    def analyze_tags(path):
        tags = []
        code = code_content(path)
        dep = sum(dependency(path), [])

        has_path = lambda kw: any(kw in d for d in dep) or kw in path
        has_code = lambda *kws: any(kw in code for kw in kws)
        has_dep = lambda tag: any(tag in analyze_tags(p) for p in dep if 'BASE' not in p)

        if has_code('function main'):
            tags.append('exe')
        if has_code('await'):
            tags.append('async')
        if has_path('/i/'):
            tags.append('info')
        if has_code('bfs', 'dfs') or has_dep('search'):
            tags.append('search')
        if has_code('ns.nuke', 'ns.hack', 'ns.exec',
                    'ns.scp') or has_dep('hack'):
            tags.append('hack')
        if has_code('singularity') or has_dep('singularity'):
            tags.append('singularity')
        if has_path('META'):
            tags.append('exploit')

        return tags


for root, folders, files in os.walk(base_dir):
    jss = [f for f in files if f.endswith('.js')]
    if not jss:
        continue

    # dump markdown to string
    f = StringIO()
    reldir = link_path(root)
    print('# Folder:', display_path(reldir), file=f)
    print(*headers, sep='|', file=f)
    print('|'.join('-' * len(headers)), file=f)
    for ff in jss:
        relfile = os.path.join(reldir, ff).replace('\\', '/')
        line = [''] * len(headers)
        line[0] = md_link(relfile, root)

        # descrip
        line[1] = descriptions(relfile) or 'TODO'

        # dependency
        ddep, idep = dependency(relfile)
        ddep = '<br>'.join((md_link(i, root) for i in ddep))
        idep = '<br>'.join((md_link(i, root) for i in idep))
        if idep:
            idep = f'<details><summary>MORE</summary>{idep}</details>'
            ddep += idep
        line[2] = ddep or '-'

        # tags
        tags = analyze_tags(relfile)
        line[3] = ''.join(map(tag_from_text, tags)) or '-'

        print('|'.join(line), file=f)

    f.seek(0)
    md_content = f.read()

    # dump markdowns
    markdown_path = os.path.join(root, 'README.md')
    is_root = os.path.relpath(root, base_dir) == '.'
    if not is_root:
        with open(markdown_path, 'w', encoding='utf-8') as f:
            f.write(md_content)
        continue

    # cut & write root markdown
    with open(markdown_path, 'r', encoding='utf-8') as f:
        orig = f.read()

    before = orig.split(root_cut_line)[0].rstrip()
    with open(markdown_path, 'w', encoding='utf-8') as f:
        print(before, file=f)
        print(file=f)
        print(root_cut_line, file=f)
        f.write(md_content)
