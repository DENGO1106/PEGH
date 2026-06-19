from pathlib import Path
repls = {
    'Ã¡':'á', 'Ã©':'é', 'Ã­':'í', 'Ã³':'ó', 'Ãº':'ú', 'Ã±':'ñ', 'Ãš':'Ú', 'Ã¼':'ü',
    'Â¡':'¡', 'Â¿':'¿', 'â€¢':'•', 'â€¦':'…', 'â€“':'–', 'â€”':'—', 'â€™':'’', 'â€˜':'‘',
    'â€œ':'“', 'â€�':'”', 'Ã‘':'Ñ', 'Â°':'°', 'Â·':'·', 'Â«':'«', 'Â»':'»', 'Â´':'´',
    'Ãœ':'Ü', 'Ã ': 'à', 'Â':'', '\u00a0':' ', '\\u00a0':' ', '\uFFFD':'',
    'âŒ':'✌', 'âœ…':'✓', 'âš ï¸':'⚠️'
}
from glob import glob

from pathlib import Path
import re

# Known replacements for common mojibake sequences
REPLS = {
    'Ã¡':'á', 'Ã©':'é', 'Ã­':'í', 'Ã³':'ó', 'Ãº':'ú', 'Ã±':'ñ', 'Ãš':'Ú', 'Ã¼':'ü',
    'Â¡':'¡', 'Â¿':'¿', 'â€¢':'•', 'â€¦':'…', 'â€“':'–', 'â€”':'—', 'â€™':'’', 'â€˜':'‘',
    'â€œ':'“', 'â€�':'”', 'Ã‘':'Ñ', 'Â°':'°', 'Â·':'·', 'Â«':'«', 'Â»':'»', 'Â´':'´',
    'Ãœ':'Ü', 'Ã ': 'à', '\u00a0':' ', '\\u00a0':' ', '\uFFFD':'',
    'âŒ':'✌', 'âœ…':'✓', 'âš ï¸':'⚠️'
}

# Files to process
patterns = ['**/*.js', '**/*.html', '**/*.md']
files = []
for pat in patterns:
    files += [str(p) for p in Path('.').rglob(pat.replace('**/',''))]
files = sorted(set(files))
root = Path('.').resolve()

def repair_nonascii_runs(text):
    # For each short run of non-ASCII characters, try latin1->utf-8 re-decode
    def _repair(m):
        s = m.group(0)
        try:
            cand = s.encode('latin-1').decode('utf-8')
            if any(ord(ch) > 127 for ch in cand):
                return cand
        except Exception:
            pass
        return s
    return re.sub(r'([^\x00-\x7F]{2,10})', _repair, text)

for fn in files:
    p = root / fn
    if not p.exists():
        print(f'Skipping missing {fn}')
        continue

    # Read file as latin-1 so we preserve raw bytes mapped to unicode codepoints
    raw = p.read_bytes().decode('latin-1')
    orig = raw

    # First try a full re-decode of the entire content (latin1->utf8)
    redecoded = False
    try:
        candidate = raw.encode('latin-1').decode('utf-8')
        # Accept if candidate reduces mojibake markers
        markers = ['Ã','â','ð','Â']
        if sum(candidate.count(m) for m in markers) < sum(raw.count(m) for m in markers):
            raw = candidate
            redecoded = True
    except Exception:
        pass

    # Then attempt per-run repairs (useful for isolated emoji sequences)
    raw = repair_nonascii_runs(raw)

    # Apply explicit replacements
    for a,b in REPLS.items():
        raw = raw.replace(a,b)

    if raw != orig:
        p.write_text(raw, encoding='utf-8')
        print(f'Fixed encoding in {fn} (redecoded={redecoded})')
    else:
        print(f'No changes for {fn}')

print('Done')
