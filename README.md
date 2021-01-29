# WFC-Stitching

By Kyle Bryant Gonzalez

<p aling="center"><img alt="Earth mid view" src="http://kylegonzalez.com/SpaceSyntax/EarthMidView.png"></p>
<p aling="center"><img alt="Pattern top-down view" src="http://kylegonzalez.com/SpaceSyntax/PatternBirdsEye.png"></p>
<p aling="center"><img alt="Mondrian detail" src="http://kylegonzalez.com/SpaceSyntax/MondrianDetail.png"></p>
<p aling="center"><img alt="Crater detail" src="http://kylegonzalez.com/SpaceSyntax/CraterDepth.png"></p>

The HTML and Javascript should run in any modern web browser. Just open the .html file.

I implemented a version of the algorithm from Isaac Karth and Adam Smith's paper "WaveFunctionCollapse is Constraint Solving in the Wild." https://dl.acm.org/doi/10.1145/3102071.3110566

In my version I limited the constraints to the immediate North, South, West, and East adjacencies of a specific tile. I also implemented an abstract, non-color tile, called a "link." The link acts as a bridge between applied bitmaps, effectively stitching together different source domains into an output image using WFC. 

To make good outputs, first try playing around with the hard-coded bitmaps. You will notice that you can get good surface image effects and 3D structure by setting up sensible color compositions, trying out simple patterns, using specific link orientation configurations, or adding redundant bitmaps. 
