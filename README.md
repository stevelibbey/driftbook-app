# Driftbook -- a visual and sound project

This project is kicking off in MERN (MongoDB Atlas, Express, React, Node.js) for now. Explorations are underway of turning this from a browser based multimedia tool to a VST or iOS app.

No collaborators at this early stage. The code is still warm and has not yet developed a crust.

# The Thing

I'm building Driftbook to explore two ideas I've had for ages. 

Firstly, a flipbook app for playing frame by frame sequences of images. I was inspired by the iterations over an image in MidJourney, which, browsed through quickly, reminded me of 60s experimental animation. I wanted to be able to zoom in on parts of an image and watch as it morphed at various speeds.

Secondly, I thought it would be cool to utilize this  similar to visual synths of the 19th century like the ANS or the Optigon. Sound generated from image. Sequences from MIDI input. But also from changing images, which results in a sound much like running a tone through a tremolo and phaser. The possibilities bloom, but only in the space of more powerful codebases, like Pure Data or even C++. Should it be a live instrument? A soundscape generator? Something else?

# Progress
I have the flipbook aspect working enough to zoom in and out, pan, and alter the FPS. 

I am using the Tone.js synth library for playing sounds from a 3x3 grid overlaying the image, using brightness, Shannon entropy, and other factors to alter pitch. The flipping modulates the sound. It's limited so far, only because once I got the keys generating a tone or a pad, I had enough of a proof of concept that I had to decide how I was going to proceed with the interface and what contexts it could be used in. I researched historical examples of visual sound until I got so sleepy! But I am excited for this next stage.
