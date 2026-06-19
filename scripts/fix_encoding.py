from pathlib import Path
repls = {
    'Ã¡':'á', 'Ã©':'é', 'Ã­':'í', 'Ã³':'ó', 'Ãº':'ú', 'Ã±':'ñ', 'Ãš':'Ú', 'Ã¼':'ü',
    'Â¡':'¡', 'Â¿':'¿', 'â€¢':'•', 'â€¦':'…', 'â€“':'–', 'â€”':'—', 'â€™':'’', 'â€˜':'‘',
    'â€œ':'“', 'â€�':'”', 'Ã‘':'Ñ', 'Â°':'°', 'Â·':'·', 'Â«':'«', 'Â»':'»', 'Â´':'´',
    'Ãœ':'Ü', 'Ã ': 'à', 'Â':'', '\u00a0':' ', '\\u00a0':' ', '\uFFFD':'',
    'âŒ':'✌', 'âœ…':'✓', 'âš ï¸':'⚠️'
}
files = ['app.js','index.html']
root = Path('.').resolve()
for fn in files:
    p = root / fn
    if not p.exists():
        print(f'Skipping missing {fn}')
        continue
    text = p.read_text(encoding='utf-8', errors='replace')
    orig = text
    for a,b in repls.items():
        text = text.replace(a,b)
    if text != orig:
        p.write_text(text, encoding='utf-8')
        print(f'Fixed encoding in {fn}')
    else:
        print(f'No changes for {fn}')
print('Done')
