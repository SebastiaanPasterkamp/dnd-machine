### {{ encounter.name }}

{{ encounter.description }}

**Encounter Rating** {{ encounter.challenge_rating|round(3) }}
    ({{- encounter.xp }} XP)

{% for count, monster in encounter.monsters|unique -%}
* {% if count > 1 %}{{ count }} x {% endif -%}
    **{{ monster.name }}**
{% endfor %}

{% if encounter.loot %}
**Loot**:

| Item | Location | Information |
| --- | --- | --- |
{% for loot in encounter.loot -%}
| {% if loot.count > 1 %}{{ loot.count }} x {% endif -%}
  {{ loot.item.label }} | {{ loot.location }} | {{ loot.description }} |
{%- endfor %}

{% endif %}