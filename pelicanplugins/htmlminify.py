import htmlmin

from pelican import signals

def writer_minify(writer, output_context):
  output_context.output = htmlmin.minify(
    output_context.output,
    **writer.settings.get('HTMLMIN_SETTINGS', {})
    )

def register():
  signals.writer_output.connect(writer_minify)
