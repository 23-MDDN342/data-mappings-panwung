[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/HpplOQZx)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=14993376&assignment_repo_type=AssignmentRepo)
## 2024 MDDN342 Assignment 3: Data Mappings

# Readme

This project was one I didn't have the creative energy to make something interesting with. At first, I thought of porting over my project 2 code, however, I felt it too simple and uninteresting withouth the mechanisms behind how that project worked. Then I thought of recreating an owl from one particular painting, but that too did not end up looking very good. One day while watching my friend play a racing game, I saw graffiti art if Kermit on a wall and thought to myself, "yeah sure why not?"

There are five sliders that the AI can interact with:
    Colour Brightness (faceColorSliderValue)
        This controls the value of the green colour

    Eye Size (eyeSizeSliderValue)
        This controls the eye and pupil size

    Eye Separation (eyeSeparationSliderValue)
        This controls how far apart the eyes are from each other

    Mouth Lower (mouthLowerSliderValue)
        This controls how open Kermit's mouth is

    Mouth Size (lipSizeSliderValue)
        This controls how big Kermit's mouth is

As Kermit's face is quite simple, there was not a whole lot I could work with. I could have made extra conditions for things like hats that are based on hair colour, but I have no time left as other, more demanding courses ate away all of my time.

# Links to images

https://en.wikipedia.org/wiki/File:Kermit_Roosevelt_1926.jpg
https://static.wikia.nocookie.net/disney/images/a/a7/Jim_Henson.jpg/revision/latest/scale-to-width-down/1000?cb=20210206031005
https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2015/01/dave_goelz_muppets.jpg
https://static.wikia.nocookie.net/muppet/images/3/36/Caroly_Wilcox_Kermit.jpg/revision/latest?cb=20210110164814
https://www.nydailynews.com/wp-content/uploads/migration/2013/09/25/EXXBMRPWKLMOBPCJKUGOC2OYKE.jpg?w=620


# Progress Log

13/05
Began working on making owl face based on Kristoffer Zetterstrand's painting "Lemons & Owl" (https://pbs.twimg.com/media/GMeVdX_aAAACJKo.png). The outline is roughly compelte. It is missing eyes, ears, and the beak.

16/05
Welp it's no longer an owl. I might try to make it look like some low poly rigid frog, e.g. the eyes will be squares instead of circles.

I was planning on just porting my faces over from my previous project, but I got inspiration to make playing card faces instead. But then I was hit by a terrible idea: what if I just made kermit?

17/06
Added a new method which allows the code to know whether a face is facing left, right, or dead in the middle.

18/05
Made some minor adjustments to the positioning of the face. I plan on adding some additional details like spots (even though they are not part of the original design), which will be drawn based on a given face (I haven't decided how). Still need to make the line that goes through the pupil somehow, and maybe some neck details.

19/05
Made the line that goes through the pupil's curve. Also made a slider which controls the horizontal position of the pupils.

21/05
Changed eye shift slider to eye size slider.

22/05
Added a shadow to half of the face depending on where they are facing. Facing left or right will shade the respective parts of the face darker, neutral facing will result in darker edges.

23/05
Added a face colour slider which can be adjusted depending on the colour of a person's skin. This just makes Kermit's green either lighter or darker. 

28/05
Added an extra slider for eye separation, which controls how far apart horizontally the eyes are from each other. Added another slider for mouth size, this time controlling the distance between the mouth edges.

29/05
Began training the AI. Still need some images.

30/05
Completed readme. Complete all training.