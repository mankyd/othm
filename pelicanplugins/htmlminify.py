from htmlmin import htmlmin

from pelican import signals

def writer_minify(writer, output_context):
  output_context.output = htmlmin.minify(output_context.output)

def register():
  signals.writer_output.connect(writer_minify)