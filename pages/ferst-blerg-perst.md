The First Blog Post / for / Internets
~ 1/16/2015 ~

  I don't want to write or create anything grand here, like tell you my life story or something. But I will tell you that I've done arguably too much soul searching, and I'm still not done. Being open to multiple paths is making things easier.

  What I really want to do is describe the intention of this blog. I'm writing to write, to play, to explore, and ultimately, to learn. There will be words, code snippets, and designs-a-plenty! GET EXCITED. pls.

  So let's get started shall we? I spent a decent amount of time on a nifty SVG animation which combines different techniques and uses a fantastic jQuery plugin by Max Wellito called "vivus". Vivus makes it super easy to add some trendy drawing animation to your SVG.

  But I didn't want my logo to just be made of strokes, so I decided to add a fade-in animation once all the paths were drawn by vivus. Through trial & error, I realized CSS animations weren't properly equipped for this task.

  Enter SMIL! Through a series of articles, I learned the basics to intermediates and how to change fill color (among other things).

  Using SMIL to animate fill-color from none to a hex value was giving weird results, so instead I used rgba(255,255,255,0) to #color. Voila!

  My next post will be a proof-of-concept UI, and the idea behind it, which I've had on my mind for some time now. I'm giving myself a deadline of 1/22. Go team!
