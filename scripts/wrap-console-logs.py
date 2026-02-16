#!/usr/bin/env python3
import os
import re
import sys

def wrap_console_statements(file_path):
    """Wrap console.log/warn/debug with DEBUG check"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if already wrapped or is console.error
        if 'if (process.env.DEBUG) console.' in content:
            return 0

        lines = content.split('\n')
        modified_lines = []
        changes = 0

        for line in lines:
            # Match console.log, console.warn, console.debug (but NOT console.error)
            match = re.match(r'^(\s*)(console\.(log|warn|debug)\()', line)
            if match:
                indent = match.group(1)
                rest = line[len(indent):]
                # Wrap with DEBUG check
                modified_lines.append(f'{indent}if (process.env.DEBUG) {rest}')
                changes += 1
            else:
                modified_lines.append(line)

        if changes > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(modified_lines))

        return changes
    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
        return 0

def main():
    src_dir = 'src'
    total_changes = 0
    files_modified = 0

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                changes = wrap_console_statements(file_path)
                if changes > 0:
                    total_changes += changes
                    files_modified += 1
                    print(f"Modified {file_path}: {changes} statements")

    print(f"\nTotal: {total_changes} statements wrapped in {files_modified} files")

if __name__ == '__main__':
    main()
