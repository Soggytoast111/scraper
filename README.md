# Reddit User History Scraper!

First things first - Reddit.com is long-established and widely used social media/message board/content agglomeration app with over 350 million active users.  Any user can post and share content - including text, photos, video and webpage links.  It is unique in that it is heavily community based, and each community is independantly managed with their own set of rules.  

Reddit User History Scraper is a utility that allows anyone to display a user's post history in a one-page, easily searchable and filterable format.  Reddit.com allows an annonymous user to access anyone's post history on their profile page.  However, the pagination structure does not lend itself to easily search or sort for that user's content (possibly by design).  

## Getting Started

If you just want to try the app for yourself, a deployed version can be accessed at:  

https://glacial-mesa-12581.herokuapp.com/

Enter a Username and press "Scrape User's History" to have the server retrieve all user's posts.  This takes a few moments.  When you press "Fetch User's History", it should display all posts below.

Date and word filters are optional.  All posts will always be downloaded by the server, but using the date filter will only fetch posts that meet the date criteria.  The word filter can filter out all posts that do not contain a string of words/characters.  

-------

If you want to start your own local server to host the app, clone this repo and then run npm install (or manually install all dependencies) from your node environment.  Local server must also be hosting a Mongo Database to store user data on port 27017.

With the server running, visit localhost:8080 to fire up the app.

### Prerequisites

Nothing is required to see the deployed app - just visit the link.
Might I suggest a few reddit user accounts that could be interesting to peek at:

the-realDonaldTrump - President Donald Trump 

PresidentObama - President Barak Obama

AlexJonesInfowarrior - Alex Jones, controversial conspiracy theororist

thisisbillgates - Bill Gates, founder of Microsoft, billionare philanthropist

ElonMusk - technology entrepreneur and visionary, founder and CEO of SpaceX and Tesla

---------

To run a server on your local machine, node.js javascript environment and MongoDB is required.

### Installing

"npm install" from the command line should install all dependencies.  Otherwise you could install them manually.  Be sure that MongoDB is installed and running before starting the server.

### What it does

Reddit User History Scraper crawls along a user's profile through the pagination, downloads all entries and stores them in a database.  Then these entries can then be fetched and displayed on the page.  

The scraper only downloads content that does not already exist in the database.  Each post has a unique ID that is assigned by reddit.com.  The scraper compares the ID of the most recently downloaded post and then stops when the ID is matched.  That way, each "scrape request" only updates the database with entries so that they are not duplicated.

Clicking an entry in the result table will also allow you to post a sticky note onto it.  This note is stored in the database and linked with that entry.  Any time someone displays that entry, this note can be accessed. 
