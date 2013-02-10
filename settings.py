from pelican.plugins import summary

AUTHOR = 'dave'

DEFAULT_DATE_FORMAT = '%b %d, %Y'
DEFAULT_ORPHANS = 3
DELETE_OUTPUT_DIRECTORY = True
FILES_TO_COPY = [
    ('favicon.ico', 'favicon.ico'),
    ('word-o-matic/word-o-matic.html', 'word-o-matic.html'),
#    ('uploads/*', 'uploads/'),
]
MARKUP = ('rst', 'md', 'html')
OUTPUT_PATH = 'output/'
ARTICLE_DIR = 'articles'
PATH = 'content/'
SITENAME = 'Oh! The Huge Manatee!'
SITEURL = 'http://ohthehugemanatee.net'
SUMMARY_MAX_LENGTH = None
THEME = 'themes/othm'
TIMEZONE = 'US/Eastern'

ARTICLE_SAVE_AS = '{date:%Y/%m}/{slug}/index.html'
ARTICLE_URL = '{date:%Y/%m}/{slug}/'
ARTICLE_LANG_URL = '{slug}-{lang}/'
PAGE_URL = 'pages/{slug}/'
PAGE_LANG_URL = 'pages/{slug}-{lang}/'
TAG_URL = 'tag/{name}/'
TAG_SAVE_AS = 'tag/{name}/index.html'

PLUGINS = [summary]
