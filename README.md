#  Our Spotify Clone (CPS630 - Assignment 1)

## Overview
Welcome to our Spotify web app! We built this for our CPS630 assignment to show off a multi-page interface that talks to a real Node.js server. It's a music library manager. You can browse through a grid of songs, add your own favorites using a form, and "manage" the library by deleting tracks.

## Future Improvements
If we had more time, we'd love to actually plug in the Spotify Web API to play real music, add a search bar, and maybe move the data from a simple JSON object into a proper database

---

##  How to Run & Use

### Getting Started
We kept it simple with just JS, HTML, and CSS. 

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Fire up the server**:
    ```bash
    node server.js
    ```
3.  **Check it out**: Head over to [http://localhost:3000](http://localhost:3000) in your favorite browser.

### How to Use
- **The Library (Home)**: You'll see all your saved tracks in a responsive grid. Hover over them to see the play button.
- **Adding Music**: Use the "Add Track" link in the sidebar. Fill in the title, artist, and a link to a cover image.
- **Cleanup**: If you made a typo or want to refresh the library, go to "Manage Library" and hit Delete.
---

## Reflection

### What we're submitting
- A Node/Express backend handles all our GET, POST, and DELETE requests.
- Three distinct pages (Home, Add, Manage) plus a custom 404 page.
- A design using Vanilla CSS.

### The Ups and Downs
**The Successes**:
Honestly, getting the Spotify aesthetic was a huge win for us. It feels premium even though it's "just" an assignment. Also, keeping the code modular means it'll be easy to have a  database later.

**The Challenges**:
Handling the 404 routing in Express took sometimes to get right, especially making sure it didn't conflict with our static files. Also, making the grid responsive without using a grid framework like Bootstrap was a fun CSS workout, but we're really happy with how it turned out!
