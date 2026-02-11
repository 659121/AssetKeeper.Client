import os
import pyperclip
from pathlib import Path
from fnmatch import fnmatch

def copy_project_structure(
    project_path='.',
    exclude_dirs=None,
    exclude_files=None,
    exclude_patterns=None,
    include_exts=None
):
    """
    Копирует структуру проекта в буфер обмена
    
    Параметры:
        project_path: путь к проекту
        exclude_dirs: список папок для исключения (например, ['bin', 'obj'])
        exclude_files: список имён файлов для исключения (например, ['appsettings.json'])
        exclude_patterns: список шаблонов для исключения (например, ['*test*.cs', '*.min.js'])
        include_exts: список расширений для включения (если None — стандартный набор)
    """
    
    # Настройки по умолчанию
    if exclude_dirs is None:
        exclude_dirs = {'bin', 'obj', '.git', '.vs', 'node_modules', '.idea', '__pycache__', 'dist', 'build'}
    
    if exclude_files is None:
        exclude_files = {
            'appsettings.json', 
            'appsettings.Development.json',
            'secrets.json',
            '.env',
            'package-lock.json',
            'yarn.lock',
            'project_dump.txt'
        }
    
    if exclude_patterns is None:
        exclude_patterns = [
            '*test*.cs',        # тестовые файлы
            '*spec*.cs',
            '*.min.*',          # минифицированные файлы
            'Thumbs.db',
            '.DS_Store'
        ]
    
    if include_exts is None:
        include_exts = {
            '.cs', '.csproj', '.sln', '.config', '.json', '.xml',
            '.cshtml', '.razor', '.html', '.css', '.scss', '.ts',
            '.js', '.tsx', '.jsx', '.sql', '.md', '.txt', '.yml', '.yaml'
        }
    
    output = []
    file_count = 0
    total_size = 0
    
    for root, dirs, files in os.walk(project_path):
        # Фильтруем директории (регистронезависимо)
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        
        for file in files:
            file_path = Path(root) / file
            relative_path = file_path.relative_to(project_path)
            file_ext = file_path.suffix.lower()
            
            # Пропускаем по расширению
            if file_ext not in include_exts:
                continue
            
            # Пропускаем по имени файла
            if file in exclude_files:
                print(f"⏭ Пропущен файл: {relative_path}")
                continue
            
            # Пропускаем по шаблону
            skip = False
            for pattern in exclude_patterns:
                if fnmatch(str(relative_path), pattern) or fnmatch(file, pattern):
                    print(f"⏭ Пропущен по шаблону '{pattern}': {relative_path}")
                    skip = True
                    break
            if skip:
                continue
            
            # Читаем файл
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if not content.strip():  # Пропускаем пустые файлы
                        continue
                    
                    output.append(f"\n{'='*20}")
                    output.append(f"\n📁 {relative_path}")
                    output.append(f"\n{'='*20}\n")
                    output.append(content)
                    output.append('\n\n')
                    
                    file_count += 1
                    total_size += len(content)
                    
            except Exception as e:
                print(f"⚠️ Ошибка чтения {relative_path}: {e}")
    
    result = ''.join(output)
    
    # Копируем в буфер
    try:
        pyperclip.copy(result)
        success = True
        with open('project_dump.txt', 'w', encoding='utf-8') as f:
            f.write(result)
    except Exception as e:
        print(f"❌ Ошибка копирования в буфер: {e}")
        success = False
    
    # Статистика
    print(f"\n{'='*50}")
    print(f"✅ Скопировано: {file_count} файлов")
    print(f"📊 Общий размер: {total_size:,} символов (~{total_size//1024} КБ)")
    print(f"📋 Буфер обмена: {'ГОТОВ' if success else 'ОШИБКА'}")
    print(f"{'='*50}")
    
    return success

if __name__ == '__main__':
    copy_project_structure(
        project_path='.',
        exclude_files={'README.md', 'project_dump.txt','appsettings.json', 'secrets.json', 'angular.json', 'package-lock.json'},
        exclude_patterns=['*test*.cs', '*Designer.cs', '*.min.js']
    )