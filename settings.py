AUTHOR = 'dave'

DEFAULT_DATE_FORMAT = '%b %d, %Y'
DEFAULT_ORPHANS = 3
DELETE_OUTPUT_DIRECTORY = False #True
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
STATIC_PATHS = [
  'images',
  'uploads',
]
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

FEED_ALL_ATOM = 'feeds/atom.xml'
FEED_ALL_RSS = 'feeds/rss.xml'
FEED_MAX_ITEMS = 20

HTMLMIN_SETTINGS = {
    'remove_empty_space': True,
    'remove_comments': True,
}

PLUGINS = [
    'pelican.plugins.assets',
    'pelican.plugins.gzip_cache',
    'pelicanplugins.htmlminify',
    'pelicanplugins.summary',
]
