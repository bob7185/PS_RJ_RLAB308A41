
import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
    "live_bMH43Q9myZW23NhUScd4Z5vCyo4HCW6JZdF2Wn14PdwY0ijI72ygtGDnYv9q3vFl";

axios.defaults.headers.common['x-api-key'] = API_KEY;


(async function initialLoad() {
    let URL = `https://api.thecatapi.com/v1/breeds`;
    try {
        let response = await axios.get(URL);
        let breeds = response.data;
        console.log(breeds);
        breeds.forEach((breed) => {
            let breedoption = document.createElement("option");
            breedoption.setAttribute("value", breed.id);
            breedoption.textContent = breed.name;
            breedSelect.appendChild(breedoption);
            breedSelect.addEventListener("change", handleSelection);
        });
    } catch (error) {
        console.error("Error fetching Data");
    }
})();

async function handleSelection() {
    let selectedBreed = this.value;
    console.log("Selected Breed:", selectedBreed);
    let url = `https://api.thecatapi.com/v1/images/search?limit=30&breed_ids=${selectedBreed}`;
    let breedImagesResponse = await axios.get(url);
    let breedImages = await breedImagesResponse.data
    let breedInfo = structuredClone(breedImages[0]["breeds"][0]);
    console.log(breedInfo);
    //clear the carousel
    Carousel.clear();
    breedImages.forEach((element) => {
        console.log(element);
        //used the createcarousel fucntion from carousel file to create a carousel element
        let carouselElement = Carousel.createCarouselItem(
            element.url,
            "",
            element.id
        );
        //append the element to the carousel
        Carousel.appendCarousel(carouselElement);
        //carouselContainer.appendChild(carouselElementDiv);
    });
    populateBreedInfo(breedInfo);
    Carousel.start();
}


function populateBreedInfo(breedData) {
    document.getElementById("breed-name").textContent = breedData.name;
    document.getElementById("breed-description").textContent =
        breedData.description;
    document.getElementById("breed-origin").textContent = breedData.origin;
    document.getElementById("breed-lifespan").textContent = breedData.life_span;
    document.getElementById(
        "breed-weight"
    ).textContent = `${breedData.weight.imperial} lbs (${breedData.weight.metric} kg)`;
    document.getElementById("breed-energy").textContent = breedData.energy_level;
    document.getElementById("breed-affection").textContent =
        breedData.affection_level;
    document.getElementById("breed-grooming").textContent = breedData.grooming;
    document.getElementById("breed-child-friendly").textContent =
        breedData.child_friendly;
    document.getElementById("breed-dog-friendly").textContent =
        breedData.dog_friendly;
    document.getElementById("breed-stranger-friendly").textContent =
        breedData.stranger_friendly;
    document.getElementById("breed-vocalization").textContent =
        breedData.vocalisation;
    document.getElementById("breed-temperament").textContent =
        breedData.temperament;
    document.getElementById("breed-health-issues").textContent =
        breedData.health_issues;
    document.getElementById("breed-hypoallergenic").textContent =
        breedData.hypoallergenic ? "Yes" : "No";
    document.getElementById("cfa-url").href = breedData.cfa_url;
    document.getElementById("vca-url").href = breedData.vcahospitals_url;
    document.getElementById("vetstreet-url").href = breedData.vetstreet_url;
    document.getElementById("wikipedia-url").href = breedData.wikipedia_url;
}


/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

let startTime = Date.now()
axios.interceptors.request.use(() => {
    console.log(` Starting request to the server started`);
})

axios.interceptors.response.use(() => {
    console.log(`Delay in getting a response; ${startTime - Date.now()} ms`);
})







/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
    // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
