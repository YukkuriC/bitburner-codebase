import os, re
from functools import lru_cache

base_dir = os.path.abspath(__file__ + '/../..')
os.chdir(base_dir)

headers = ['Code', 'Description', 'Dependency', 'Tags']
tag_colors = {
    'exe': 'gold',
    'exploit': 'red',
    'info': 'cyan',
    'search': 'cyan',
    'hack': 'green',
    'singularity': 'magenta',
}

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

    def md_link(path):
        lp = link_path(path)
        ld = display_path(path)
        return f'[{ld}]({lp})'

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
        color = tag_colors.get(text)
        if color:
            style = f' style="color:{color}"'
        else:
            style = ''
        return f'<b{style}>{text.upper()}</b>'

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

    with open(
            os.path.join(root, 'README.md'),
            'a' if os.path.relpath(root, base_dir) == '.' else 'w',
            encoding='utf-8',
    ) as f:
        reldir = link_path(root)
        print('# Folder:', display_path(reldir), file=f)
        print(*headers, sep='|', file=f)
        print('|'.join('-' * len(headers)), file=f)
        for ff in jss:
            relfile = os.path.join(reldir, ff).replace('\\', '/')
            line = [''] * len(headers)
            line[0] = md_link(relfile)

            # descrip
            line[1] = descriptions(relfile) or 'TODO'

            # dependency
            ddep, idep = dependency(relfile)
            ddep = '<br>'.join(map(md_link, ddep))
            idep = '<br>'.join(map(md_link, idep))
            if idep:
                idep = f'<details><summary>MORE</summary>{idep}</details>'
                ddep += idep
            line[2] = ddep or '-'

            # tags
            tags = analyze_tags(relfile)
            line[3] = ', '.join(map(tag_from_text, tags)) or '-'

            print('|'.join(line), file=f)