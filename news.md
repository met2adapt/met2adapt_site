---
layout: default
title: "News & Events MENTOR"
nav: news
permalink: /news/
---

<section class="hero hero-secondary reveal">
<div class="hero-overlay"></div>
<div class="container hero-content">
<h1>News & Events</h1>
<p>Training schools, workshops, conferences and scientific highlights from the Met2Adapt doctoral network.</p>
</div>
</section>



<section class="cards-section reveal">
<div class="container">
<div class="news-grid">
{% assign sorted = site.data.news.items | sort: "date" | reverse %}
{% for item in sorted %}
{% include news-item.html news=item %}
{% endfor %}
</div>
</div>
</section>


