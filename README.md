# POInter

So with this project I wanted to utilise google maps api, which inturn utilises places api and navigation api.
What I wanted this project to allow a user to do is search for a location, lodgings local to that location and then look for entertainment
within the scope that's displayed. Can be filtered with the drop down box and if needed use the navigation feature to get there/work out the distance.

## UX
 
Use this section to provide insight into your UX process, focusing on who this website is for, what it is that they want to achieve and how your project is the best way to help them achieve these things.

I've designed this website to someone who is looking for places to stay anywhere around the globe, but once they've found a location and hotel/lodge they can then search for POI's nearby and get directions
to those locations. It's made in a straightforward and appealing way that you can easily navigate around the page to get the results you're after.

- As a user I want to get on to the page, search for a location and be given results on places to stay in that area.

- I'm interested in knowing what Cafe's, casino's or restaurants are in a particular location and to have the directions to the nearest car park.

- As a user I want to find a hotel, ring and book in advance and see if they have any discounts for the local tourist attractions, then click on a link to navigate to their website.

## Features

Searchbox - allows the user to search for a village, town or city to zoom in and get local information. This is assisted with google to make sure the spelling's correct.
map - allows the user to view where the POI's are with markers that are dropped.
table - allows the user to view the information found with the markers in a convenient, easy to view table.
infowindow - If the user clicks on either the marker on the map or one of the results in the table it'll open a small info box displaying wanted information about the location.
navigation - Once a user has selected a lodge/hotel, if they wanted to, they can then search for a local POI. Once selected a button will appear at the bottom of the page to give instructions on the map and the panel.
Nav Panel - this gives the user written instructions on how to get from point A to point B.
 
### Features Left to Implement
- I'd like to add the feature for the user to browse through several images for selected interest.
- Display more than 20 results which is google's quota limit.
- Show list of opening times.

## Technologies Used

In this section, you should mention all of the languages, frameworks, libraries, and any other tools that you have used to construct this project. For each, provide its name, a link to its official site and a short sentence of why it was used.
-[jQuery]
    - I've used this to add animation classes to the appearing elements.
-[Javscript]
    - Project uses Javscript as it's backbone to work the site.
-[Google Maps API]
    - This is the main api used for the other api's to function properly, gives us a map to work with.
-[Google Places API]
    - This was used to find locations and search nearby places, including getting more information about selected interest.
-[Google Navigation API]
    - I utilised this to get directions from a Hotel/lodge to POI with written and visual data.
-[SASS]
    - This is used to give a more flexible and easier CSS coding/formatting. 

## Testing

To start with I've opened the website using; Chrome, Firefox (my default browser) and internet explorer. Within Firefox I've used the responsive design feature to make sure everything is placed right,
fits well and is not overflowing or generally out of place. I've used bootstrap to format my website so I'm quite happy that it'll function as it should.

Next I tested the style.css with padding, margins and settings colours using SASS so I can effectively set a variable with a colour associated with it and place it through the website, this
saves me time If I fancy changing the primary colours without having to search through all the code for each section. I've tested all this while using the website to make sure my margins 
or paddings are correct and displaying properly as well as the borders and box shadows all display as they should. 

Most of my time has been sunk into the javascript side of this project. I have two javascript files, one is used for the main initisialising the map, using places api, and navigation api
while the other is purely for the structure/formatting which I called 'style.js'. The style.js file removes, hides or sets certain elements to 'inline-block' as well as using animate.css
to give some animations.

### Maps.js testing:

 - When the navigation button was pressed, it would display the new markers but when you wanted to 'reset' and try a new location, it would keep the old markers in position and overlay 
   newer markers causing it to build up and become a mess. I sorted this by making this function reference the same map as the searching for places so when the code ran to remove markers
   it now removed the markers placed by the navigation function.

 - showInfoWindow: While using this on a screen width bigger than 1000px, it would display correctly in the pop up window, soon as you go below 1000px's it would display but require the user
   to manually shift/swipe across to read the whole content. I got around this by using 'hyphens: auto' which breaks the words to make it readable on smaller screens.

 - Results: When the results were retrieved, I had console logged it from the request, to the function to get more details on found places, then to being displayed in the results table.
   It would show it's found 20 results, push them through for getting more information then always end up with only 9 going through. I spent a lot of time trying to suss this and picked the
   brains of my mentor to which we came to no solution, until, I decided to console log the status to which showed 'OK' and then 'OVER_QUERY_LIMIT' which is where I found my issue was. I 
   managed to sort my issue out by adding an if statement to check the status and if it shows as 'OVER_QUERY_LIMIT' it will wait and try again until all results are pushed through meaning
   I had consecutive results with the information I wanted from each place found.

 - No results: While I was using this more like


In this section, you need to convince the assessor that you have conducted enough testing to legitimately believe that the site works well. Essentially, in this part you will want to go over all of your user stories from the UX section and ensure that they all work as intended, with the project providing an easy and straightforward way for the users to achieve their goals.

Whenever it is feasible, prefer to automate your tests, and if you've done so, provide a brief explanation of your approach, link to the test file(s) and explain how to run them.

For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

1. Contact form:
    1. Go to the "Contact Us" page
    2. Try to submit the empty form and verify that an error message about the required fields appears
    3. Try to submit the form with an invalid email address and verify that a relevant error message appears
    4. Try to submit the form with all inputs valid and verify that a success message appears.

In addition, you should mention in this section how your project looks and works on different browsers and screen sizes.

You should also mention in this section any interesting bugs or problems you discovered during your testing, even if you haven't addressed them yet.

If this section grows too long, you may want to split it off into a separate file and link to it from here.

## Deployment

This section should describe the process you went through to deploy the project to a hosting platform (e.g. GitHub Pages or Heroku).

In particular, you should provide all details of the differences between the deployed version and the development version, if any, including:
- Different values for environment variables (Heroku Config Vars)?
- Different configuration files?
- Separate git branch?

In addition, if it is not obvious, you should also describe how to run your code locally.


## Credits

### Content
- The text for section Y was copied from the [Wikipedia article Z](https://en.wikipedia.org/wiki/Z)

### Media
- The banner photo of the clouds was from naturemuseum.org. 
- Images for the markers are from google themself.
- Images for found locations are from google's location database.

### Acknowledgements

- I received inspiration for this project from kayak and travago websites.
