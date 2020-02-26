# -*- coding: utf-8 -*-
import os
import re
import tempfile
from subprocess import check_output
from io import BytesIO

def fill_pdf(pdf_file, text, html={}, xfdf_file=None, debug=False):
    # Get empty FDF
    args = [
        "pdftk",
        pdf_file,
        "generate_fdf",
        "output", "-",
        "dont_ask"
    ]

    fdf_template = check_output(args, timeout=30)

    def generateField(key, txt, rtf):
        if rtf is None or len(rtf) == 0:
            return u"""
        <field name="%s">
            <value>%s</value>
        </field>""" % (key, txt)

        return u"""
        <field name="%s">
            <value>%s</value>
            <value-richtext>
                <body xmlns="http://www.w3.org/1999/xhtml" xmlns:xfa="http://www.xfa.org/schema/xfa-data/1.0/" xfa:APIVersion="Acrobat:6.0.0" xfa:spec="2.0.2">
                    <p><span style="font-size:10.0pt">%s</span></p>
                </body>
            </value-richtext>
        </field>""" % (key, txt, rtf)

    def generateBool(key, value):
        return u"""
        <field name="%s">
            <value>%s</value>
        </field>""" % (key, u'Yes' if text.get(key, False) else u'Off')

    # Populate FDF
    re_value = re.compile(br'(<<\s+/V \(.*?\)\s+\/T \((.*?)\)\s+>>)')
    re_bool = re.compile(br'(<<\s+/V /\S*\s+/T \((.*?)\)\s+>>)')

    xfdf_fields = []
    for val in re_value.finditer(fdf_template):
        (replace, field) = val.groups()
        key = field.decode('utf-8')
        if key not in text:
            continue

        xfdf_fields.append(generateField(
            key,
            text.get(key, field if debug else ''),
            html.get(key),
            ))

    for val in re_bool.finditer(fdf_template):
        (replace, field) = val.groups()
        key = field.decode('utf-8')
        if text.get(key) is None:
            continue

        xfdf_fields.append(generateBool(
            key,
            text.get(key),
            ))

    xfdf_data = u"""<?xml version="1.0" encoding="UTF-8"?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
    <fields>%s
    </fields>
</xfdf>""" % "".join(xfdf_fields)

    if xfdf_file:
        with open(xfdf_file, 'w') as fh:
            fh.write(xfdf_data)

    xfdf_file = None
    with tempfile.NamedTemporaryFile('w', suffix='.xfdf', delete=False) as fp:
        xfdf_file = fp.name
        fp.write(xfdf_data)

    # Embed in pdf
    args = [
        "pdftk",
        pdf_file,
        "fill_form", xfdf_file,
        "output", "-",
        "dont_ask",
        "need_appearances",
        "compress",
        "allow", "AllFeatures",
    ]

    pdf = check_output(args, timeout=30)
    os.remove(xfdf_file)
    return BytesIO(pdf)
