{{ indent }}# [{{ npc.name }}](/npc/show/{{ npc.id }})

*Level {{ npc.level }} {{ npc.race|capitalize }} {{ npc.class|capitalize }}, {{ npc.alignment }}*

---

* **Armor Class** {{ npc.armor_class }}
* **Hit Points** {{ npc.hit_points }} ({{ npc.hit_points_notation }})
* **Speed** {{ npc.speed|distance }}

---

| {% for stat in items.statistics -%}
  {% if not loop.first %} | {% endif %}{{ stat.label[:3] }}
{%- endfor %} |
| {% for stat in items.statistics -%}
  {% if not loop.first %} | {% endif %}---
{%- endfor %} |
| {% for stat in items.statistics -%}
  {% if not loop.first %} | {% endif %}{{ npc.stats[stat.name] }} ({{ npc.modifiers[stat.name]|bonus }})
{%- endfor %} |

---

* **Senses** passive perception {{ npc.passive_perception }}
  {%- if npc.senses -%}
    {{ npc.senses|join(', ') }}
  {%- endif %}
* **languages** {{ npc.languages|join(', ') if npc.languages else '—' }}
{% if npc.xp -%}
  * **Challenge** {{ npc.challenge_rating|round(3) }} ({{ npc.xp }} XP)
{% endif %}

---

{% for trait in npc.traits -%}
* **{{ trait.name }}** {{ trait.description }}
{%- endfor %}

{% if npc.weapons %}
**Weapons**

{% set props = {
    'two-handed': 'Two-Handed',
    'versatile': 'Versatile',
    'light': 'Light',
    'finesse': 'Finesse',
    'ammunition': 'Ammonution',
    'loading': 'Loading',
    'thrown': 'Thrown'
} -%}

{% for count, weapon in npc.weapons|unique -%}
* {% if count > 1 -%}{{ count }} x {% endif -%}
  **{{ weapon.name }}**: {{ weapon.damage.notation }} {{ weapon.damage.type_label }}, *Hit: {{ weapon.bonus|bonus }}
  {%- for prop, desc in props.items() %}
    {%- if prop in weapon.property -%}
        , {{ desc }}
    {%- endif %}
  {%- endfor %}
  {%- if range in weapon %} (Range: {{ weapon.range.min }}/{{ weapon.range.max }}){% endif %}
  {%- if "notation_alt" in weapon.damage -%}
    *({{ weapon.use_alt }}: {{ weapon.damage.notation_alt }} {{ weapon.damage.type_label }}, Hit: {{ weapon.bonus_alt|bonus }})*
  {%- endif %}
{% endfor %}
{% endif %}