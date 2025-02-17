AUTHOR = 'Dave Mankoff'
SITENAME = 'Oh The Huge Manatee'
SITEURL = ""

PATH = "content"
ARTICLE_PATHS = [
  'articles'
]
STATIC_PATHS = [
  'images',
  'misc',
  'uploads',
  'favicon.ico',
  'word-o-matic',
]

TIMEZONE = 'America/New_York'
DEFAULT_DATE_FORMAT = '%b %d, %Y'
DEFAULT_ORPHANS = 3
DELETE_OUTPUT_DIRECTORY = False

DEFAULT_LANG = 'en'

IGNORE_FILES = [
    "**/.*",
    "**/.#*",
]
MARKUP = ('rst', 'md', 'html')
OUTPUT_PATH = 'output/'
ARTICLE_PATHS = ['articles']
PATH = 'content/'
SITENAME = 'Oh! The Huge Manatee!'
SITEURL = 'https://ohthehugemanatee.net'
SUMMARY_MAX_LENGTH = None
THEME = 'themes/othm'

ARTICLE_SAVE_AS = '{date:%Y/%m}/{slug}/index.html'
ARTICLE_URL = '{date:%Y/%m}/{slug}/'
ARTICLE_LANG_URL = '{slug}-{lang}/'
PAGE_URL = '{slug}/'
PAGE_LANG_URL = '{slug}-{lang}/'
TAG_URL = 'tag/{name}/'
TAG_SAVE_AS = 'tag/{name}/index.html'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feeds/atom.xml'
FEED_ALL_RSS = 'feeds/rss.xml'
FEED_MAX_ITEMS = 20
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

THEME = 'themes/othm'

# Blogroll
LINKS = (
    ("Pelican", "https://getpelican.com/"),
    ("Python.org", "https://www.python.org/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
    ("You can modify those links in your config file", "#"),
)

# Social widget
SOCIAL = (
    ("You can add links in your config file", "#"),
    ("Another social link", "#"),
)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True

HTMLMIN_SETTINGS = {
    'remove_empty_space': True,
    'remove_comments': True,
}

PLUGIN_PATHS = [
    'plugins',
    '../../pelican-plugins'
]
PLUGINS = [
    'assets',
    'gzip_cache',
#    'htmlminify',
    'optimize_images',
    'summary',
    'tag_cloud',
]

