---
layout: default
title: "Met2Adapt"
nav: home
permalink: /
---

{%- assign dc_total = 0 -%}
{%- for wp in site.data.dcs.work_packages -%}{%- assign dc_total = dc_total | plus: wp.dcs.size -%}{%- endfor -%}
{%- assign partner_total = site.data.logos.logos | where: "ispartner", 1 | size -%}
{%- assign assoc_total = site.data.logos.logos | where: "ispartner", 2 | size -%}

<section class="hero hero-home reveal" aria-labelledby="hero-title" markdown="0">
<div class="hero-overlay"></div>

<div class="container hero-content">
<p class="hero-kicker">Marie Skłodowska-Curie Doctoral Network</p>
<h1 id="hero-title">Advanced Meta-materials and Meta-Structures for Adaptable, Resilient and Sustainable renewable energy power plants</h1>
<p class="hero-lede">A European training network advancing fundamental and translational research.</p>
<div class="hero-actions">
<a href="{{ "/research/" | relative_url }}" class="btn btn-hero">Explore research</a>
<a href="{{ "/training/" | relative_url }}" class="btn btn-hero-ghost">Explore training</a>
<a href="https://www.linkedin.com/company/112561317" class="btn btn-hero-ghost btn-linkedin" target="_blank" rel="noopener"><svg class="li-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>Connect with us on LinkedIn</a>
</div>
</div>

<div class="hero-facts">
<div class="container hero-facts__inner">
<p><strong>{{ dc_total }}</strong> doctoral candidates</p>
<p><strong>{{ partner_total }}</strong> partner institutions</p>
<p><strong>{{ assoc_total }}</strong> associated partners</p>
<p class="hero-facts__grant">Funded by the European Union, grant agreement No 101227175</p>
</div>
</div>
</section>





<section class="intro-section reveal">
<div class="container">
<h2>Our Vision</h2>
<p> Onshore and offshore wind farms and wave energy converters are central to the net-zero transition, and their deployment must accelerate if climate targets are to be met. Scaling them up, however, exposes them to increasingly demanding operating conditions. Larger, more flexible turbines and floating platforms face higher dynamic loads, resonance and fatigue. Wave energy converters must survive extreme seas while still capturing energy efficiently across a broad and variable wave spectrum. Climate change is also intensifying storms and extreme sea states. Together, these pressures shorten service life, raise maintenance costs and reduce availability, while over-designed, material-intensive structures add to the environmental footprint and to the demand for Critical Raw Materials (CRMs). Meta-materials and meta-structures offer a different route. Through engineered architecture rather than additional mass, they can attenuate vibrations, filter or redirect wave energy, and tune the dynamic response of structures and foundations. Embedding these concepts in renewable energy systems, and monitoring them through digital twins, opens the way to lighter, longer-lasting and more resilient infrastructure, aligned with circular-economy and eco-design principles.</p>

<p>Backed by the prestigious Marie Skłodowska-Curie Actions programme, the Met2Adapt initiative is stepping up to bridge this innovation gap. Met2Adapt operates as an interdisciplinary incubator, designed to empower a new vanguard of visionary researchers. Their focus is on pioneering the next frontier of smart and sustainable metamaterials and metastructures. We seek to engineer advanced architectures to unlock unprecedented, macroscopic properties that can directly supercharge the renewable energy sector.</p>
</div>
</section>

<section class="intro-section reveal" markdown="0">
<div class="hero-carousel" aria-roledescription="carousel" aria-label="Met2Adapt in pictures">
<div class="hc-track" data-active="0">
{% for sl in site.data.slider %}
<figure class="hc-slide" data-index="{{ forloop.index0 }}" aria-hidden="{% if forloop.first %}false{% else %}true{% endif %}" id="slide-{{ forloop.index0 }}">
<img {% if forloop.first %}src="{{ sl.image | relative_url }}" fetchpriority="low"{% else %}data-src="{{ sl.image | relative_url }}"{% endif %} alt="{{ sl.alt }}" decoding="async" style="object-position: {{ sl.position | default: 'center' }};">
{% if sl.caption %}<figcaption class="hc-caption">{{ sl.caption }}</figcaption>{% endif %}
</figure>
{% endfor %}
</div>

<button class="hc-prev" aria-label="Previous slide" type="button">‹</button>
<button class="hc-next" aria-label="Next slide" type="button">›</button>

<div class="hc-indicators" role="tablist" aria-label="Slide indicators">
{% for sl in site.data.slider %}
<button role="tab" aria-selected="{% if forloop.first %}true{% else %}false{% endif %}" aria-controls="slide-{{ forloop.index0 }}" aria-label="Slide {{ forloop.index }}" data-to="{{ forloop.index0 }}" type="button"></button>
{% endfor %}
</div>
</div>

</section>

{% include dcs-home.html %}

<section class="intro-section reveal">
<div class="container">
<h2>Our Partners</h2>

<div class="logo-array-wrapper">

{% assign rows = "1,2,3" | split: "," %}
{% for r in rows %}
{% assign row_number = r | plus: 0 %}
<div class="logo-row row-{{ row_number }}">

{% for item in site.data.logos.logos %}
{% assign item_row = item.row | plus: 0 %}
{% assign partner_flag = item.ispartner | plus: 0 %}

{% if item_row == row_number and partner_flag == 1 %}
<a class="logo-cell"
href="{{ item.url }}"
target="_blank"
rel="noopener"
style="--scale: {{ item.scale }};">
<img src="{{ item.image | relative_url }}" alt="Partner logo" loading="lazy" decoding="async">
</a>
{% endif %}
{% endfor %}

</div>
{% endfor %}




</div>

<h2>Our Associated Partners</h2>

<div class="logo-array-wrapper">

{% assign rows = "1,2,3" | split: "," %}
{% for r in rows %}
{% assign row_number = r | plus: 0 %}
<div class="logo-row row-{{ row_number }}">

{% for item in site.data.logos.logos %}
{% assign item_row = item.row | plus: 0 %}
{% assign partner_flag = item.ispartner | plus: 0 %}

{% if item_row == row_number and partner_flag == 2 %}
<a class="logo-cell"
href="{{ item.url }}"
target="_blank"
rel="noopener"
style="--scale: {{ item.scale }};">
<img src="{{ item.image | relative_url }}" alt="Partner logo" loading="lazy" decoding="async">
</a>
{% endif %}
{% endfor %}

</div>
{% endfor %}




</div>

</div>
</section>




{% include supervisors.html %}







