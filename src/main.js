
import './style.css'

import { Client, Databases, ID } from "appwrite";


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);

const form = document.getElementById('travelForm')
const cardList = document.getElementById('cardList');
console.log(cardList);




form.addEventListener('submit', addCountry)


function addCountry(e) {
  e.preventDefault(); // Stop the page from resubmitting when submit is pressed

  const country_trip = e.target.country.value;
  const budget = e.target.budget.value;
  const days = parseInt(e.target.days.value);

  const dailyDetails = [];

  for (let i = 1; i <= days; i++) {
    const activities = e.target[`activities-day${i}`].value;
    const hotel = e.target[`hotel-day${i}`].value;

    dailyDetails.push({
      day: i,
      activities,
      hotel,
    });
  }

  const country = databases.createDocument(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID,
    ID.unique(),
    {
      country: country_trip,
      "number-of-days": days,
      dailyDetails: JSON.stringify(dailyDetails),
      budget: budget,
    }
  );

  country.then(
    function (response) {
      console.log(response);
      // Reload the page after 1 second (1000ms) to allow data to be stored
      setTimeout(() => {
        window.location.reload();
      }, 10);
    },
    function (error) {
      console.log(error);
    }
  );

  form.reset();
}


// function addCountry(e){
//   e.preventDefault(); //stop the page from resubmitting as you press submit
//   const country_trip = e.target.country.value;
//   const budget = e.target.budget.value;
//   const days = parseInt(e.target.days.value);

//   const dailyDetails = []

//   for (let i = 1; i <= days; i++) {
//     const activities = e.target[`activities-day${i}`].value;
//     const hotel = e.target[`hotel-day${i}`].value;

//     dailyDetails.push({
//       day: i,
//       activities,
//       hotel
//     })
//   }

//   const country = databases.createDocument(
//     import.meta.env.VITE_DATABASE_ID,
//     import.meta.env.VITE_COLLECTION_ID,
//     ID.unique(),
//     { "country": country_trip,
//       "number-of-days": days,
//       "dailyDetails": JSON.stringify(dailyDetails),
//       "budget": budget
//      }
//   );
//   country.then(function (response) {
//     console.log(response);
//   }, function (error) {
//       console.log(error);
//       window.location.reload(true);
//   });
//   form.reset();

// }

async function addCountryToDom(){
  let response = await databases.listDocuments(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID
);

// Get the card-list section
  // const cardList = document.querySelector('nav');
  // console.log(cardList);

  // Loop through each document (country) in the response
  response.documents.forEach((country) => {
    // Parse the dailyDetails field (it's a stringified JSON)
    const dailyDetails = JSON.parse(country.dailyDetails);

    // Create the card element
    const card = document.createElement('article');
    card.classList.add('card');

    // Create the header
    const header = document.createElement('header');
    header.classList.add('card-header');

    const daysParagraph = document.createElement('p');
    daysParagraph.textContent = `${country['number-of-days']} Days Itinerary`;

    const countryHeading = document.createElement('h2');
    countryHeading.textContent = country.country.toUpperCase();
  

    header.appendChild(daysParagraph);
    header.appendChild(countryHeading);

    // Create the section for day-wise details
    const activitySection = document.createElement('section');
    activitySection.classList.add('activityContainer');

    // Loop through each day in dailyDetails
    const keys = Object.keys(dailyDetails)
    keys.forEach(key =>{
      const oneContainer = document.createElement('div');
      oneContainer.classList.add('oneContainer');

      const dayHeading = document.createElement('h4');
      dayHeading.textContent = `Day ${dailyDetails[key].day}`;
      

      const activityList = document.createElement('ul');

      const activities = dailyDetails[key].activities.split(',').map((activity) => activity.trim());
      activities.forEach((activity) => {
        const listItem = document.createElement('li');
        listItem.textContent = activity;
        activityList.appendChild(listItem);
      });

      const addHotel = document.createElement('span');
      addHotel.textContent = `Hotel: ${dailyDetails[key].hotel}`;

      oneContainer.appendChild(dayHeading);
      oneContainer.appendChild(activityList);
      oneContainer.appendChild(addHotel);

      activitySection.appendChild(oneContainer);

    })

    const tags = document.createElement('div');
    tags.classList.add('tags');

    const budgetSpan = document.createElement('span');
    budgetSpan.textContent = `Budget: $${country.budget}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.onclick = () => removeJob(country.$id);

    const devUp = document.createElement('div');
    devUp.classList.add('upvote-container');

    const upButton = document.createElement('button');
    upButton.classList.add('upvote-button');
    upButton.textContent = '❤️';
    upButton.onclick = () => updateVote(country.$id);

    const upCount = document.createElement('span');
    upCount.classList.add('upvote-count');
    upCount.textContent = `${country.upVote}`

    devUp.appendChild(upButton);
    devUp.appendChild(upCount);

    tags.appendChild(budgetSpan);
    tags.appendChild(devUp);
    tags.appendChild(deleteBtn);


    // Append all sections to the card
    card.appendChild(header);
    card.appendChild(activitySection);
    card.appendChild(tags);

    

    // Append the card to the card-list section
    cardList.appendChild(card);

  });
  console.log(response)
  }

  addCountryToDom()
 
  async function removeJob(id) {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID,
        id
      );
      console.log("Deleted:", id);
      document.getElementById(id).remove(); // Only remove the specific card
    } catch (error) {
      console.error("Error deleting:", error);
      window.location.reload(true);
    }
  }
  

  async function updateVote(id){
    const currentDoc = await databases.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID,
      id// data (optional)
      
  );
  const currentUpVote = currentDoc['upVote'];

  const newUpVote = currentUpVote + 1;

  const result = await databases.updateDocument(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID,
    id,// data (optional),
    {upVote:newUpVote}
  )
  document.getElementsByClassName('upvote-count').textContent = id['upVote'];
  window.location.reload(true);
  }