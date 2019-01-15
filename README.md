# POInter

So with this project I wanted to utilise google maps api, which inturn utilises places api and navigation api.
What I wanted this project to allow a user to do is search for a location, lodgings local to that location and then look for entertainment
within the scope that's displayed. Can be filtered with the drop down box and if needed use the navigation feature to get there/work out the distance.

## UX

I've designed this website to someone who is looking for places to stay in a specified location, once they've found a location and hotel/lodge they can then search for POI's nearby and get directions
to those locations. It's made in a straightforward and appealing way that you can easily navigate around the page to get the results you're after.

- As a user I want to get on to the page, search for a location and be given results on places to stay in that area.

- I'm interested in knowing what Cafe's, casino's or restaurants are in a particular location and to have the directions to the nearest car park.

- As a user I want to find a hotel, ring and book in advance and see if they have any discounts for the local tourist attractions, then click on a link to navigate to their website.

### I've added into the 'testDrawings' folder my initial sketch/drawings for the website.

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

## Technologies Used:

-[jQuery] ~ https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
    - I've used this to add animation classes to the appearing elements.

-[Javscript] ~ Intergrated
    - Project uses Javscript as it's backbone to work the site.

-[Google Maps API] 
    - This is the main api used for the other api's to function properly, gives us a map to work with.

-[Google Places API]
    - This was used to find locations and search nearby places, including getting more information about selected interest.

-[Google Navigation API]
    - I utilised this to get directions from a Hotel/lodge to POI with written and visual data.

-[SASS] ~ Installed
    - This is used to give a more flexible and easier CSS coding/formatting. 

-[FONT-AWESOME] ~ https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
    - This is used to give me my default font for the website.

-[Animate.css] ~ https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css
    - I've used this to give some animation to my elements.

-[BootStrap v4] ~ https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css
    - This is used for the formatting of elements around my site.
    
## Testing

To start with I've opened the website using; Chrome, Firefox (my default browser) and internet explorer. Within Firefox I've used the responsive design feature to make sure everything is placed right,
fits well and is not overflowing or generally out of place. I've used bootstrap to structure my website so I'm quite happy that it'll function as it should.

Next I tested the style.css with padding, margins and settings colours using SASS so I can effectively set a variable with a colour associated with it and place it through the website, this
saves me time If I fancy changing the primary colours without having to search through all the code for each section. I've tested all this while using the website to make sure my margins 
or paddings are correct and displaying properly as well as the borders and box shadows all display as they should. 

Most of my time has been sunk into the javascript side of this project. I have two javascript files, one is used for the main initisialising the map, using places api, and navigation api
while the other is purely for the structure/formatting which I called 'style.js'. The style.js file removes, hides or sets certain elements to 'inline-block' as well as using animate.css
to give some animations.

I've put my code through W3C markup validator and a few others to check my code is up to standard and make sure I had no redundant tags left open or unecessary code just placed somewhere I'd forgotten about.

### Maps.js testing:

 - When the navigation button was pressed, it would display the new markers but when you wanted to 'reset' and try a new location, it would keep the old markers in position and overlay 
   newer markers causing it to build up and become a mess. I sorted this by making this function reference the same map as the searching for places so when the code ran to remove markers
   it now removed the markers placed by the navigation function.

 - showInfoWindow: While using this on a screen width bigger than 1000px, it would display correctly in the pop up window, soon as you go below 1000px's it would display but require the user
   to manually shift/swipe across to read the whole content. I got around this by using 'hyphens: auto' which breaks the words to make it readable on smaller screens.

 - Results limit: When the results were retrieved, I had console logged it from the request, to the function to get more details on found places, then to being displayed in the results table.
   It would show it's found 20 results, push them through for getting more information then always end up with only 9 going through. I spent a lot of time trying to suss this and picked the
   brains of my mentor to which we came to no solid solution but other things to try, until I decided to console log the status to which showed 'OK' and then 'OVER_QUERY_LIMIT' which is where 
   I found my underlying issue. I managed to sort my issue out by adding an if statement to check the status and if it shows as 'OVER_QUERY_LIMIT' it will wait and try again until all results
   are pushed through meaning I had consecutive results with the information I wanted from each place found.

 - No results prompts: While I was testing the searchNearby function, i noticed when there were no specified items (No casino's or aquariums) it would leave the user just waiting for something to happen
   so I've added an if statement and an alert to notify the user that there's no searched item nearby. At first I had it setup that it checked if there were no items within results array but 
   even if there was atleast 1 result it was alerting the user that there was no results and stopped the code there. After console logs showing results returned 20 results I found I put the if
   statement in too late, so I simply got this to check the results before it went through them in the array and the prompt now works as it should.

 - Results Undefined: While requesting more information to the found results, there were some which didn't have the photo's array or a formatted address as two examples which would then just display
   'undefined' instead of something useful. To get around this I found a alternative to the formatted address which was 'viscinity', all results I tested had information for this field so I put an if statement
   to check that if the formatted address existed then to render that otherwise use the 'viscinity' as a fall back. Same regarding if there was no photo array then to use the markerIcon from the map to fill in 
   the missing photo. 

 - No header image: Once I had deployed the site and started viewing from GitHub Pages I quickly realised my images weren't loading and the google maps wasn't authorised. Added the github pages as a site usuable 
   with my API key and corrected the file path for both the header background image and header image to display correctly, confirmed in both Firefox and Chrome.

## Deployment

I've created this website using the cloud9 platform which I then created a repository on github, this is where all the files are uploaded to. Once I logged into GitHub i opened this project, 
head into settings and enabled hosting on GitHub Pages which then supplies a link to my website for others to use. 

https://99ron.github.io/Milestone2FSD/


## Credits

### Content

Content is all made up from my self for the text, but the images, location name and details are all from Googles places API.

### Media

- The banner photo of the clouds was from naturemuseum.org. 
- Images for the markers are from google. (link is in the code)
- Images for found locations are from google's places database.


### Acknowledgements

- I received inspiration for this project from kayak and travago websites.
- I've referred to stackOverflow and W3school for codes snippets which I've then amended to suit my project. 
