{{ indent }}# [{{ monster.name }}](/monster/show/{{ monster.id }})

*{{ monster.size|capitalize }} {{ monster.type|capitalize }}, {{ monster.alignment }}*

---

* **Armor Class** {{ monster.armor_class }}
  {%- if monster.armor_type %}({{ monster.armor_type }}){% endif %}
* **Hit Points** {{ monster.hit_points }} ({{ monster.hit_points_notation }})
* **Speed** {% for method, speed in monster.motion.items() -%}
    {% if speed -%}
      {{ joiner(', ') }}{{ method }} {{ speed|distance }}
    {%- endif %}
  {%- endfor %}

---

| {% for stat in items.statistics -%}
  {% if not loop.first %} | {% endif %}{{ stat.short }}
{%- endfor %} |
| {% for stat in items.statistics -%}
  {% if not loop.first %} | {% endif %}---
{%- endfor %} |
| {% for stat in items.statistics -%}
  {% if not loop.first %} | {% endif %}{{ monster.statisticsBase[stat.code] }} ({{ monster.statisticsModifiers[stat.code]|bonus }})
{%- endfor %} |

---

{% if monster.immunities.damage -%}
* **Damage Immunities** {{ monster.immunities.damage|join(', ') }}
{%- endif %}
{% if monster.immunities.condition -%}
* **Condition Immunities** {{ monster.immunities.condition|join(', ') }}
{%- endif %}
{% if monster.resistances.damage -%}
* **Damage Resistances** {{ monster.resistances.damage|join(', ') }}
{%- endif %}
{% if monster.resistances.condition -%}
* **Condition Resistances** {{ monster.resistances.condition|join(', ') }}
{%- endif %}
{% if monster.vulnerabilities.damage -%}
* **Damage Vulnerabilities** {{ monster.vulnerabilities.damage|join(', ') }}
{%- endif %}
{% if monster.vulnerabilities.condition -%}
* **Condition Vulnerabilities** {{ monster.vulnerabilities.condition|join(', ') }}
{%- endif %}
* **Senses** passive perception {{ monster.passive_perception }}
  {%- if monster.senses -%}
    {{ monster.senses|join(', ') }}
  {%- endif %}
* **languages** {{ monster.languages|join(', ') if monster.languages else '—' }}
* **Challenge** {{ monster.challenge_rating|round(3) }} ({{ monster.xp }} XP)

---

{% for name, description in monster.traits.items() -%}
* **{{ name }}:** {{ description }}
{% endfor %}

**Attacks**

{% for rotation in monster.multiattack -%}
* **{{ rotation.name }}** {% if rotation.condition -%}
    *({{ rotation.condition }})*
{%- endif %} {{ rotation.description|replace('%average%', rotation.average) }}
    ({{- rotation.sequence|join(', ') }})
{%- endfor %}

{% for attack in monster.attacks -%}
* **{{ attack.name }}** {{ attack.description }}:
    {{ attack.bonus|bonus }} to hit,
    reach {{ attack.reach|distance }},
    {{ (attack.target|by_name(items.target_methods)).label }}.
    *Hit: {{ attack.notation }}.
    {%- if attack.on_hit %} {{ attack.on_hit }}.{% endif %}
    {%- if attack.on_mis %} Mis: {{ attack.on_mis }}.{% endif %}*
{% endfor %}