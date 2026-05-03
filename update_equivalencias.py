import re
import json

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CARRERAS object
match = re.search(r'const CARRERAS = (\{[\s\S]*?\n\});\n\n//', content)
if not match:
    # Try another pattern if the above fails
    match = re.search(r'const CARRERAS = (\{[\s\S]*?\n\});\n', content)

if not match:
    print("Could not find CARRERAS object.")
    exit(1)

carreras_str = match.group(1)

# Hacky way to parse JS object in Python: use regex to find all courses
# Pattern: find carrera block, then find courses inside it.
carreras = {}
# Find top level keys
carrera_blocks = re.finditer(r'\s+([a-zA-Z0-9_]+):\s*\{[\s\S]*?cursos:\s*\[([\s\S]*?)\]\n\s*\}', carreras_str)
for block in carrera_blocks:
    carrera_id = block.group(1)
    cursos_str = block.group(2)
    
    # Extract courses
    course_matches = re.finditer(r'\{[^}]*codigo:\s*"([^"]+)"[^}]*\}', cursos_str)
    carreras[carrera_id] = [cm.group(1) for cm in course_matches]

shared_courses = {}

for carrera_id, cursos in carreras.items():
    for curso in cursos:
        if curso not in shared_courses:
            shared_courses[curso] = []
        shared_courses[curso].append(carrera_id)

# Filter out courses that are only in one career
shared_courses = {k: v for k, v in shared_courses.items() if len(v) > 1}

# Generate JS code for CURSOS_COMPARTIDOS
js_obj = "const CURSOS_COMPARTIDOS = {\n"
for curso, carr_list in shared_courses.items():
    carr_list_str = ", ".join(f'"{c}"' for c in carr_list)
    js_obj += f'  "{curso}": [{carr_list_str}],\n'
js_obj += "};"

# Replace in data.js
start_idx = content.find('const CURSOS_COMPARTIDOS = {')
if start_idx != -1:
    end_idx = content.find('};', start_idx) + 2
    new_content = content[:start_idx] + js_obj + content[end_idx:]
    
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("data.js updated successfully with new CURSOS_COMPARTIDOS!")
else:
    print("Could not find CURSOS_COMPARTIDOS object in data.js")
