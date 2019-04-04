{{ indent }}# [{{ encounter.name }}](/encounter/show/{{ encounter.id }})

{{ encounter.description }}

**Encounter Rating** {{ encounter.challenge_rating|round(3) }}
    ({{- encounter.xp }} XP)

{% for monster in encounter.monsters|sort(attribute='challenge_rating', reverse=True) -%}
* {{ encounter.countByMonsterId[monster.id] }} x
    **{{ monster.name }}**
{% endfor %}

{% if encounter.loot %}
**Loot**:

| Item | Location | Information |
| --- | --- | --- |
{% for loot in encounter.loot|sort(attribute='location') -%}
| {% if loot.count > 1 %}{{ loot.count }} x {% endif -%}
  {{ loot.name }} | {{ loot.location }} | {{ loot.description }} |
{% endfor %}

{% endif %}
