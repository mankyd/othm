import htmlmin
import os
from pelican import signals
import tempfile

def initialized(pelican):
    from pelican.settings import DEFAULT_CONFIG
    DEFAULT_CONFIG.setdefault(
        'HTMLMINIFY_FILE_EXTENSIONS',
        ['html', 'htm']
    )
    DEFAULT_CONFIG.setdefault(
        'HTMLMINIFY_SETTINGS',
        {}
    )
    if pelican:
        pelican.settings.setdefault(
            'HTMLMINIFY_FILE_EXTENSIONS',
            DEFAULT_CONFIG['HTMLMINIFY_FILE_EXTENSIONS']
        )
        pelican.settings.setdefault(
            'HTMLMINIFY_SETTINGS',
            DEFAULT_CONFIG['HTMLMINIFY_SETTINGS']
        )

def minify(path, context):
    for ext in context['HTMLMINIFY_FILE_EXTENSIONS']:
        if path.endswith(ext):
            break
    else:
        return
    tmp_file_fd, tmp_location = tempfile.mkstemp(dir=os.path.dirname(path))
    tmp_file = os.fdopen(tmp_file_fd, 'w')
    with open(path) as inp:
        tmp_file.write(htmlmin.minify(
            inp.read().decode('utf-8'), 
            **context['HTMLMINIFY_SETTINGS']).encode('utf-8'))
    tmp_file.close()
    os.rename(tmp_location, path)

def register():
    signals.initialized.connect(initialized)
    signals.content_written.connect(minify)
