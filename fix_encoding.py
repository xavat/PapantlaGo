import os

replacements = {
    "Ã¡": "á",
    "Ã©": "é",
    "Ã­": "í",
    "Ã³": "ó",
    "Ãº": "ú",
    "Ã±": "ñ",
    "Ã": "Á", # Careful with this one, but usually it's Á
    "Ã‰": "É",
    "Ã\xad": "Í",
    "Ã“": "Ó",
    "Ãš": "Ú",
    "Ã‘": "Ñ",
    "â€“": "–",
    "â€”": "—",
    "â€œ": "“",
    "â€\x9d": "”",
    "â€˜": "‘",
    "â€™": "’",
}

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for key, value in replacements.items():
            new_content = new_content.replace(key, value)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

def main():
    for root, dirs, files in os.walk('.'):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.json', '.md')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
