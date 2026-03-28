---
layout: default
title: "Research Met2Adapt"
nav: research
permalink: /research/
---

<section class="hero hero-secondary reveal">
<div class="hero-overlay"></div>
<div class="container hero-content">
<h1>Research</h1>
<p>Science and technology development for a resilient renewable energy sector.</p>
</div>
</section>

<section class="intro-section reveal">
<div class="container">
<h2>Research programme</h2>
<p>Met2Adapt pioneers a disruptive and highly ambitious methodological framework that dynamically links advanced disciplines. By seamlessly cross-pollinating high-fidelity computational physics with state-of-the-art Artificial Intelligence (AI) and machine learning, we can rapidly model and optimize complex material behaviors. This theoretical powerhouse is firmly grounded in reality through rigorous, real-world empirical testing and continuous Structural Health Monitoring (SHM). </p> 

<p>By streaming live data from integrated smart sensors into advanced Digital Twins—highly accurate, real-time virtual replicas of our physical infrastructure—we create a complete cyber-physical loop. This allows us to predict wear-and-tear, simulate extreme environmental stressors, and optimize performance long before an actual component degrades. Ultimately, this multidisciplinary nexus allows us to deploy highly tailored, bespoke solutions directly into the harsh, demanding environments that sustain Europe’s energy grid. By fortifying both onshore and offshore wind farms, and unlocking the immense potential of oceanic wave-energy converters, Met2Adapt is actively future-proofing the infrastructure that will define our renewable energy resilience.</p>
</div>
</section>

<section class="wp-section reveal">
<div class="container">
<h2>Research work packages</h2>

{%- comment -%}
Render the stencil hero. If you have a dedicated hero photo in the data file,
it will be used; otherwise we fall back to the first work package photo.
{%- endcomment -%}
{%- assign first_wp = site.data.work_packages[0] -%}
{% include stencil-hero.html photo=first_wp.photo %}

<!-- Compact grid of WP summaries -->
<div class="wp-grid">
{% for wp in site.data.work_packages %}
<article class="wp-card">
<h3>{{ wp.title }}</h3>
{% if wp.subtitle %}<p class="wp-subtitle">{{ wp.subtitle }}</p>{% endif %}
{% if wp.description %}<p>{{ wp.description }}</p>{% endif %}
<a href="#{{ wp.id }}-card" class="card-link">View details</a>
</article>
{% endfor %}
</div>

<!-- Full include blocks each inside a centered wp-card with DCs looked up from _data/dcs.yml -->
{% for item in site.data.work_packages %}
<article class="wp-card wp-card--centered" id="{{ item.id }}-card" aria-labelledby="{{ item.id }}-title">
<div class="wp-card__inner">
<h2 id="{{ item.id }}-title" class="visually-hidden">{{ item.title }}</h2>

{% capture body %}{{ item.content | markdownify }}{% endcapture %}
{% include wp-stencil.html
photo=item.photo
title=item.title
speed=item.speed
content=body
%}

{%- comment -%}
Look up DCs for this WP in _data/dcs.yml (top-level key: work_packages)
dcs_entry will be nil if no matching entry exists; default to empty array.
{%- endcomment -%}
{% assign dcs_entry = site.data.dcs.work_packages | where: "id", item.id | first %}
{% assign matching_dcs = dcs_entry.dcs | default: "[]" %}
{% assign dc_count = matching_dcs | size %}

{% if dc_count > 0 %}
<div class="wp-card__dc">
<button class="dc-toggle" aria-expanded="false" aria-controls="{{ item.id }}-dc-list">
<span class="dc-toggle__label">DCs</span>
<span class="dc-toggle__count">({{ dc_count }})</span>
<span class="dc-toggle__icon" aria-hidden="true">▾</span>
</button>

<div id="{{ item.id }}-dc-list" class="dc-list" hidden>
{%- comment -%}
Pass the whole dcs_entry (work-package object containing dcs array)
so dc-accordion.html can iterate include.wp.dcs as expected.
{%- endcomment -%}
{% include dc-accordion.html wp=dcs_entry single_open=false %}
</div>
</div>
{% endif %}
</div>
</article>
{% endfor %}

</div>
</section>
