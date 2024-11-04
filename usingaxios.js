
import { event } from "jquery";
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

// setting default for axios
axios.defaults.baseURL = 'https://api.thecatapi.com/v1'
axios.defaults.headers.common['x-api-key'] = API_KEY;


(async function initialLoad() {
    let URL = `/breeds`;
    try {
        let response = await axios.get(URL, { onDownloadProgress: updateProgess });
        let breeds = response.data;
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
    let url = `/images/search?limit=30&breed_ids=${selectedBreed}`;
    let breedImagesResponse = await axios.get(url, { onDownloadProgress: updateProgess });
    let breedImages = breedImagesResponse.data
    if (breedImages.length >= 1)    // the returned breed has data to display 
    {
        //show the info dump 
        infoDump.style.display = 'block'
        buildCarousel(breedImages);
        let breedInfo = structuredClone(breedImages[0]["breeds"][0]);
        populateBreedInfo(breedInfo);
        return;
    }
    // has no data to display , clear the carousel 
    Carousel.clear();
    //hide the info dump 
    infoDump.style.display = 'none';

}

function populateBreedInfo(breedData) {
    document.getElementById("breed-name").textContent = breedData.name;
    document.getElementById("breed-description").textContent = breedData.description;
    document.getElementById("breed-origin").textContent = breedData.origin;
    document.getElementById("breed-lifespan").textContent = breedData.life_span;
    document.getElementById("breed-weight").textContent = `${breedData.weight.imperial} lbs (${breedData.weight.metric} kg)`;
    document.getElementById("breed-energy").textContent = `${breedData.energy_level}/5`;
    document.getElementById("breed-affection").textContent = `${breedData.affection_level}/5`;
    document.getElementById("breed-grooming").textContent = `${breedData.grooming}/5`;
    document.getElementById("breed-child-friendly").textContent = `${breedData.child_friendly}/5`;
    document.getElementById("breed-dog-friendly").textContent = `${breedData.dog_friendly}/5`;
    document.getElementById("breed-stranger-friendly").textContent = `${breedData.stranger_friendly}/5`;
    document.getElementById("breed-vocalization").textContent = `${breedData.vocalisation}/5`;
    document.getElementById("breed-temperament").textContent = breedData.temperament;
    document.getElementById("breed-health-issues").textContent = `${breedData.health_issues}/5`;
    document.getElementById("breed-hypoallergenic").textContent = breedData.hypoallergenic ? "Yes" : "No";

    // Set links only if they exist
    const links = [
        { id: "cfa-url", url: breedData.cfa_url },
        { id: "vca-url", url: breedData.vcahospitals_url },
        { id: "vetstreet-url", url: breedData.vetstreet_url },
        { id: "wikipedia-url", url: breedData.wikipedia_url },
    ];

    links.forEach(link => {
        const anchor = document.getElementById(link.id);
        if (link.url) {
            anchor.href = link.url;
            anchor.style.display = 'inline'; // Show the link
        } else {
            anchor.style.display = 'none'; // Hide the link if there's no URL
        }
    });
}

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

let startTime = Date.now()
axios.interceptors.request.use((config) => {
    console.log(` Starting request to the server started`);
    progressBar.style.width = '0%'
    document.querySelector('body').style.cursor = 'progress';
    return config
}, function (error) {
    return Promise.reject(error);
  })
axios.interceptors.response.use((response) => {
    console.log(`Delay in getting a response; ${Date.now() - startTime} ms`);
    document.querySelector('body').style.cursor = 'default';
    return response
}, function (error) {
    return Promise.reject(error);
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
function updateProgess(ProgressEvent) {
    console.log(ProgressEvent);
    let loaded = ProgressEvent.loaded;
    let total = ProgressEvent.total;
    let percentage = total ? Math.floor((loaded / total) * 100) : null;
    console.log(`Download progress: ${percentage}`)
    progressBar.style.width = percentage.toString() + '%'
}

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
    let url_fav = `/favourites?limit=1&image_id=${imgId}`;
    let new_fav_id = await axios.get(url_fav);
    if (new_fav_id.data.length === 1) {   //delete the favorite 
        let resp = await axios.delete(`/favourites/${new_fav_id.data[0]['id']}`);
        console.log('removed from favorite!')
        return;
    }
    let response = await axios.post('/favourites', { image_id: imgId });
    console.log('added to favorite!', response.data);
    return;
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
async function getFavourites(event) {
    event.preventDefault();
    let favourites = await axios.get('/favourites');
    let fav_data = favourites.data;
    let fav_images = [];
    // here we arsing the resulat array objct returned to create ana rray of objects with only the images data 
    fav_data.forEach((element) => {

        //copy the imag obj  if not empty and push it to fav
        if (Object.keys(element).length > 1) {
            let temp = structuredClone(element.image)
            fav_images.push(temp)
        }
    })
    // notice that somehwo that API always add 3 empty obje before the actual image data . so I am starting form index 3 
    //console.log(fav_images.slice(3,))
    infoDump.style.display = 'none';;
    buildCarousel(fav_images.slice(3,));
    return;
}

function buildCarousel(arrImg) {
    //clear the carousel
    Carousel.clear();
    arrImg.forEach((element) => {
        //used the createcarousel fucntion from carousel file to create a carousel element
        let carouselElement = Carousel.createCarouselItem(
            element.url,
            "",
            element.id
        );
        //append the element to the carousel
        Carousel.appendCarousel(carouselElement);
    });
    Carousel.start();
}

getFavouritesBtn.addEventListener('click', getFavourites);


/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
