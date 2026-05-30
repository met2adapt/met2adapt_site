---
layout: default
title: "Training Met2Adapt"
nav: recruitment
permalink: /recruitment/
---

<section class="hero hero-home reveal">
<div class="hero-overlay"></div>

<div class="container hero-content">
<h1>We are inviting applications from 16 Doctoral Candidates to join Met2Adapt </h1>

</div>
</section>

<section class="intro-section reveal">
<div class="container">
<h2>Call for applications</h2>

<p>Met2Adapt puts forward an ambitious research and training plan that will foster a new generation of researchers able to design and deliver sustainable meta-materials for vibration mitigation, self-aware meta-components and eventually carbon-efficient yet safe meta-structures for the renewable energy sector. The focal point of this research will be the deployment of custom-fit solutions for infrastructure that is critical to the European energy resilience, i.e. offshore and onshore wind farms, and wave-energy converters.</p> 

<p>Key to our training methodology is our firm commitment on establishing an active and student-centred ‘training by research’ environment, which will put the Doctoral Candidates in charge of their training process. On top of the supervision arrangements provided by the Met2Adapt academic beneficiaries, the DCs will join a thriving training hub comprising formal courses, dedicated training weeks, academic and industrial secondments, and a dedicated industrial mentorship program.</p>

<p>Each of the 16 candidates will conduct research in one of the four main subject areas of Met2Adapt: (i) Meta-material development, (ii) AI driven multi-scale and multi-physics modelling  (iii) Autonomous monitoring technologies (iv) Prognosis and Uncertainty Quantification. The candidates will work together within the Met2Adapt network and engage in multi-disciplinary training-by-research to develop technology in close collaboration with end-users around the world.</p>

<p>The Met2Adapt consortium comprises 10 beneficiaries and 9 Associated Partners across 9 countries in Europe and the USA.</p>

<p>For specific openings and position requirements see below and follow the application procedure described in each case. Individual application deadlines apply. We especially encourage members of underrepresented groups to apply. Met2Adapt encourages an inclusive culture. We promote equality of opportunity, value diversity and nurture a working and learning environment in which the rights and dignity of all our staff and students are respected.</p>

</div>  <!-- closes .container -->
</section> <!-- closes .intro-section -->

<div class="container positions-list">

{% assign number_printed = 0 %}
{% for publi in site.data.positionlist %}

 <article class="position">

<hr class="h-divider" />

<h4 class="bolded_centered">{{ publi.title }}</h4> 

<hr class="h-divider" />

<p class="mb-0">{{ publi.description }}</p>

<p>{{ publi.requires }}</p>

<p><b>Host: </b>{{ publi.host }}</p>

<p><b>Awarding PhD entity: </b>{{ publi.award }}</p>

<p><b>Applications start: </b>{{ publi.appStart }}</p>

<p><b>Application deadline: </b>{{ publi.appEnd }}</p>

<p><b>Earliest project start date: </b>{{ publi.projectStart }}</p>

{% if publi.informal  == "none" %}
{% else %}

<p><strong>Informal inquiries: </strong>{{ publi.informal }}</p>	

{% endif %}
{% if publi.howTo.url  == "none" %}

<p><strong>How to Apply:</strong> {{ publi.howTo.display }}</p>

{% if publi.howTo.ijob  == "one" %}

<p><strong>Job description:</strong> [Job offer description]({{ site.url }}{{ site.baseurl }}{{ publi.howTo.jobdescription }})</p>

{% endif %}
{% else %}

<p><strong>Application Link</strong> <a href="{{ publi.howTo.url }}">{{ publi.howTo.display }}</a></p>

{% endif %}

  </article>

{% endfor %}

</div> 