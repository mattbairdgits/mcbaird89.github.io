My use-case was this: draw attention to a fun handwritten typeface.

  - this site looks great on you stroked with vivus

Vivus is great for something like that, but the strokes of my particular typeface were thick and meant to be filled for full enjoyment, so I decided to fade-in a fill color once all the paths were drawn by Vivus. Through trial & error, I realized CSS animations weren't properly equipped for this task.

- example?

Enter SMIL! Through a couple articles, I learned how to change fill color (among other things).

- sara s on css tricks and some guy on codepen

Using SMIL to animate fill-color from none to a hex value was giving weird results, so instead I used rgba(255,255,255,0) to #color. Voila!

- exampar of both

My next post will be a proof-of-concept navigational UI which I've had on my mind for some time now.
