#!/usr/bin/env python3
import json
import os
import zipfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {'test', '.git', '__pycache__'}
SKIP_FILES = {'package.py', 'README.md', '.DS_Store', '.gitignore'}

version = json.load(open(os.path.join(ROOT, 'manifest.json')))['version']
out = os.path.join(ROOT, f'font-picker-{version}.zip')

with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in sorted(filenames):
            if name in SKIP_FILES or name.endswith('.zip'):
                continue
            full = os.path.join(dirpath, name)
            z.write(full, os.path.relpath(full, ROOT))

print(f"{out}  ({os.path.getsize(out) / 1024:.0f} KB)")
print('\n'.join('  ' + n for n in zipfile.ZipFile(out).namelist()))
