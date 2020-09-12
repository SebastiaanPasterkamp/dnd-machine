# -*- coding: utf-8 -*-
import os
import re
import tempfile
from subprocess import Popen, PIPE
from io import BytesIO

def generateXfdfField(key, txt, rtf):
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

def generateXfdfBool(key, value):
    return u"""
    <field name="%s">
        <value>%s</value>
    </field>""" % (key, u'Yes' if value else u'Off')

def fill_pdf(pdf_file, text, html={}, xfdf_file=None, debug=False):
    # Populate FDF
    xfdf_fields = []
    for key, value in text.items():
        if type(value) != bool:
            rich = html.get(key)
            xfdf_fields.append(generateXfdfField(key, value, rich))
        else:
            xfdf_fields.append(generateXfdfBool(key, value))

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

    p = Popen(args, stdin=None, stdout=PIPE, stderr=PIPE)
    stdout, stderr = p.communicate()

    os.remove(xfdf_file)

    if stderr.strip():
        raise IOError(stderr)

    return BytesIO(stdout)
