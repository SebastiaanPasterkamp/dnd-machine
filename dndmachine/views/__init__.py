# -*- coding: utf-8 -*-
import re
from subprocess import Popen, PIPE
from io import BytesIO

def fill_pdf(pdf_file, data, fdf_file=None):
    # Get empty FDF
    args = [
        "pdftk",
        pdf_file,
        "generate_fdf",
        "output", "-",
        "dont_ask"
    ]

    p = Popen(args, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    if p.wait() != 0:
        raise IOError(p.stderr)
    fdf_template = p.stdout.read()

    # Populate FDF
    re_value = re.compile(ur'(<<\s+/V \(.*?\)\s+\/T \((.*?)\)\s+>>)')
    re_bool = re.compile(ur'(<<\s+/V /\S*\s+/T \((.*?)\)\s+>>)')

    fdf_data = fdf_template
    for val in re_value.finditer(fdf_template):
        (replace, field) = val.groups()
        value = data.get(field, '')
        if isinstance(value, str):
            value = value.encode('utf-8')
        fdf_data = fdf_data.replace(
            replace,
            """<<\n/V ({value})\n/T ({field})\n>>""".format(
                value=value,
                field=field
                )
            )
    for val in re_bool.finditer(fdf_template):
        (replace, field) = val.groups()
        value = '/Yes' if data.get(field, False) else '/Off'
        fdf_data = fdf_data.replace(
            replace,
            """<<\n/V %s\n/T (%s)\n>>""" % (
                value,
                field
                )
            )
    if fdf_file:
        with open(fdf_file, 'wb') as fh:
            fh.write(fdf_data)

    # Embed in pdf
    args = [
        "pdftk",
        pdf_file,
        "fill_form", "-",
        "output", "-",
        "dont_ask",
        "flatten"
    ]

    p = Popen(args, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate(fdf_data)
    if stderr.strip():
        raise IOError(stderr)

    return BytesIO(stdout)
