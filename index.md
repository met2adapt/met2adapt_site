---
layout: default
title: "Met2Adapt"
nav: home
permalink: /
---

<section class="hero hero-home reveal">
<div class="hero-overlay"></div>

<div class="container hero-content">
<h1>Advanced Meta-materials and Meta-Structures for Adaptable, Resilient and Sustainable renewable energy power plants</h1>
<p>A European training network advancing fundamental and translational research.</p>
<div class="hero-actions">
<a href="{{ "/research/" | relative_url }}" class="btn btn-primary">Explore Research</a>
<a href="{{ "/training/" | relative_url }}" class="btn btn-primary">Explore Training </a>
</div>
</div>
</section>





<section class="intro-section reveal">
<div class="container">
<h2>Our Vision</h2>
<p>Next-generation renewable energy technologies are no longer just an alternative; they are the cornerstone of the global net-zero green transition. Accelerating the deployment of clean energy is our most critical lever in mitigating anthropogenic climate change and achieving long-term planetary sustainability. However, the rapid scaling of these technologies exposes inherent bottlenecks. Current green infrastructure often suffers from suboptimal design efficiencies and a heavy reliance on Critical Raw Materials (CRMs)—scarce resources and minerals that are vulnerable to supply chain disruptions and ecological extraction concerns. To overcome this, we need a paradigm shift toward circular economy principles and eco-conscious, disruptive design.</p>

<p>Backed by the prestigious Marie Skłodowska-Curie Actions programme, the Met2Adapt initiative is stepping up to bridge this innovation gap. Met2Adapt operates as an interdisciplinary incubator, designed to empower a new vanguard of visionary researchers. Their focus is on pioneering the next frontier of smart and sustainable metamaterials and metastructures. We seek to engineer advanced architectures to unlock unprecedented, macroscopic properties that can directly supercharge the renewable energy sector.</p>
</div>
</section>

<section class="intro-section reveal">
<!-- Carousel inside the overlay -->
<div class="hero-carousel" aria-roledescription="carousel" aria-label="Hero images">
<div class="hc-track" data-active="0">
<div class="hc-slide" data-index="0" aria-hidden="false" id="slide-0">
<img src="img/slider/slid1.png" alt="Image of a random crystal">
</div>
<div class="hc-slide" data-index="1" aria-hidden="true" id="slide-1">
<img src="img/slider/slid2.jpg" alt="Image of luminesense">
</div>
<div class="hc-slide" data-index="2" aria-hidden="true" id="slide-2">
<img src="img/slider/slid3.jpg" alt="Sputtering">
</div>
<div class="hc-slide" data-index="3" aria-hidden="true" id="slide-3">
<img src="img/slider/slid4.jpg" alt="elipsometer">
</div>
<div class="hc-slide" data-index="3" aria-hidden="true" id="slide-4">
<img src="img/slider/slid5.jpg" alt="Photo of a sound tunnel">
</div>
<div class="hc-slide" data-index="3" aria-hidden="true" id="slide-5">
<img src="img/slider/slid6.png" alt="Photo of a meta-material">
</div>
</div>

<button class="hc-prev" aria-label="Previous slide" type="button">‹</button>
<button class="hc-next" aria-label="Next slide" type="button">›</button>

<div class="hc-indicators" role="tablist" aria-label="Slide indicators">
<button role="tab" aria-selected="true" aria-controls="slide-0" data-to="0" type="button"></button>
<button role="tab" aria-selected="false" aria-controls="slide-1" data-to="1" type="button"></button>
<button role="tab" aria-selected="false" aria-controls="slide-2" data-to="2" type="button"></button>
</div>
</div>

</section>

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
<img src="{{ item.image | relative_url }}" alt="Partner logo">
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
<img src="{{ item.image | relative_url }}" alt="Partner logo">
</a>
{% endif %}
{% endfor %}

</div>
{% endfor %}




</div>

</div>
</section>




{% include supervisors.html %}







