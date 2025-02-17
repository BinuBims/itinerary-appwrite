
import './style.css'

import { Client, Databases, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67b0f37200289ff1662b');

const databases = new Databases(client);

const form = document.getElementById('travelForm')
const cardList = document.getElementById('cardList');
console.log(cardList);




form.addEventListener('submit', addCountry)


function addCountry(e){
  e.preventDefault(); //stop the page from resubmitting as you press submit
  const country_trip = e.target.country.value;
  const budget = e.target.budget.value;
  const days = parseInt(e.target.days.value);

  const dailyDetails = []

  for (let i = 1; i <= days; i++) {
    const activities = e.target[`activities-day${i}`].value;
    const hotel = e.target[`hotel-day${i}`].value;

    dailyDetails.push({
      day: i,
      activities,
      hotel
    })

    console.log(typeof JSON.stringify(dailyDetails));

  const country = databases.createDocument(
    '67b0f500002ada5ae995',
    '67b0f5ac003e5ed6a5e5',
    ID.unique(),
    { "country": country_trip,
      "number-of-days": days,
      "dailyDetails": JSON.stringify(dailyDetails),
      "budget": budget
     }
  );
  country.then(function (response) {
    console.log(response);
  }, function (error) {
      console.log(error);
  });
  form.reset()

}
}

// onChangeNumOfDays = document.getElementById('days').addEventListener('change',generateDaySections)

// function addCountry(e){
//   e.preventDefault() //stop the page from resubmitting as you press submit
//   const country = databases.createDocument(
//     '67b0f500002ada5ae995',
//     '67b0f5ac003e5ed6a5e5',
//     ID.unique(),
//     { "country": e.target.country.value,
//       "number-of-days": Number(e.target.numberOfDays.value),
//       "activities": e.target.activities.value,
//       "hotels": e.target.hotels.value,
//       "budget": Number(e.target.budget.value)
//      }
//   );
//   country.then(function (response) {
//     console.log(response);
//   }, function (error) {
//       console.log(error);
//   });
//   form.reset()

// }

// const cardList = document.querySelector('nav');
// console.log(cardList);

async function addCountryToDom(){
  let response = await databases.listDocuments(
    '67b0f500002ada5ae995',
    '67b0f5ac003e5ed6a5e5',
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
    daysParagraph.textContent = `${country['number-of-days']} Days`;

    const countryHeading = document.createElement('h2');
    countryHeading.textContent = country.country;

    // console.log(daysParagraph);
    // console.log(countryHeading);
    // console.log(dailyDetails);
    
    // const keys = Object.keys(dailyDetails)
    // console.log(dailyDetails['day'])
    // // keys.forEach(key =>{
    // //   console.log(dailyDetails[key])
    // // })
  

    header.appendChild(daysParagraph);
    header.appendChild(countryHeading);

    // Create the section for day-wise details

    // Loop through each day in dailyDetails
    // const keys = Object.keys(dailyDetails)
    // keys.forEach(key =>{
    //   console.log(dailyDetails[key])
    //   const daySection = document.createElement('section');
    //   const dayHeading = document.createElement('h4');
    //   dayHeading.textContent = `Day ${dailyDetails['day']}`;
    //   console.log(dayHeading.textContent);

    //   const activityList = document.createElement('ul');

    //   const activities = dailyDetails.activities.split(',').map((activity) => activity.trim());
    //   activities.forEach((activity) => {
    //     const listItem = document.createElement('li');
    //     listItem.textContent = activity;
    //     activityList.appendChild(listItem);
    //   });
      
    //   daySection.appendChild(dayHeading);
    //   daySection.appendChild(activityList);

    //   daySections.appendChild(daySection);
    // })
  

    // dailyDetails.forEach((day) => {
    //   const daySection = document.createElement('section');
    //   const dayHeading = document.createElement('h4');
    //   dayHeading.textContent = `Day ${day.day}`;

    //   const activityList = document.createElement('ul');

    //   // Split activities by comma and create list items
    //   const activities = day.activities.split(',').map((activity) => activity.trim());
    //   activities.forEach((activity) => {
    //     const listItem = document.createElement('li');
    //     listItem.textContent = activity;
    //     activityList.appendChild(listItem);
    //   });

      // Append day heading and activity list to the section
      

    // Create the tags section for budget
    const tags = document.createElement('div');
    tags.classList.add('tags');

    const budgetSpan = document.createElement('span');
    budgetSpan.textContent = `$${country.budget}`;

    tags.appendChild(budgetSpan);

    // Append all sections to the card
    card.appendChild(header);
    // card.appendChild(daySections);
    card.appendChild(tags);

    console.log(card);

    // Append the card to the card-list section
    cardList.appendChild(card);

  });



    // response.documents.forEach((country)=>{
    //   const p = document.createElement('p')
    //   p.textContent = `${country['num-of-days']}`
    //   document.querySelector('header').appendChild(p)
    // })
  console.log(response)
  }

  addCountryToDom()


// Testing multiactivity

// function generateDaySections() {
//   const days = parseInt(document.getElementById('days').value);
//   const daySections = document.getElementById('daySections');
//   daySections.innerHTML = ''; // Clear previous sections

//   for (let i = 1; i <= days; i++) {
//     daySections.innerHTML += `
//       <div class="day-section">
//         <h3>Day ${i}</h3>
//         <label for="activities-day${i}">Activities:</label>
//         <textarea id="activities-day${i}" rows="4" placeholder="Enter activities for Day ${i}. Use comma to seperate each activity"></textarea>

//         <label for="hotel-day${i}">Hotel:</label>
//         <input type="text" id="hotel-day${i}" placeholder="Enter hotel for Day ${i}">
//       </div>
//     `;
//   }
// }

// document.getElementById('travelForm').addEventListener('submit', function (e) {
//   e.preventDefault();

//   // Collect all data
//   const country = document.getElementById('country').value;
//   const budget = document.getElementById('budget').value;
//   const days = parseInt(document.getElementById('days').value);

//   const travelPlan = {
//     country,
//     budget,
//     days,
//     dailyDetails: []
//   };

//   for (let i = 1; i <= days; i++) {
//     const activities = document.getElementById(`activities-day${i}`).value;
//     const hotel = document.getElementById(`hotel-day${i}`).value;

//     travelPlan.dailyDetails.push({
//       day: i,
//       activities,
//       hotel
//     });
//   }

//   // Output the collected data (you can send this to a server or process it further)
//   console.log(travelPlan);
//   alert('Travel plan submitted! Check the console for details.');
// });


// // Get the card-list section
// const cardList = document.querySelector('.card-list');

// // Loop through each document (country) in the response
// response.documents.forEach((country) => {
//   // Parse the dailyDetails field (it's a stringified JSON)
//   const dailyDetails = JSON.parse(country.dailyDetails);

//   // Create the card element
//   const card = document.createElement('article');
//   card.classList.add('card');

//   // Create the header
//   const header = document.createElement('header');
//   header.classList.add('card-header');

//   const daysParagraph = document.createElement('p');
//   daysParagraph.textContent = `${country['number-of-days']} Days`;

//   const countryHeading = document.createElement('h2');
//   countryHeading.textContent = country.country;

//   header.appendChild(daysParagraph);
//   header.appendChild(countryHeading);

//   // Create the section for day-wise details
//   // const daySection = document.createElement('section');

//   // // Loop through each day in dailyDetails
//   // dailyDetails.forEach((day) => {
//   //   const dayHeading = document.createElement('h4');
//   //   dayHeading.textContent = `Day ${day.day}`;

//   //   const activityList = document.createElement('ul');

//   //   // Split activities by comma and create list items
//   //   const activities = day.activities.split(',').map((activity) => activity.trim());
//   //   activities.forEach((activity) => {
//   //     const listItem = document.createElement('li');
//   //     listItem.textContent = activity;
//   //     activityList.appendChild(listItem);
//   //   });

//   //   // Append day heading and activity list to the section
//   //   daySection.appendChild(dayHeading);
//   //   daySection.appendChild(activityList);
//   // });

//   // Create the tags section for budget
//   const tags = document.createElement('div');
//   tags.classList.add('tags');

//   const budgetSpan = document.createElement('span');
//   budgetSpan.textContent = `$${country.budget}`;

//   tags.appendChild(budgetSpan);

//   // Append all sections to the card
//   card.appendChild(header);
//   card.appendChild(daySection);
//   card.appendChild(tags);

//   // Append the card to the card-list section
//   cardList.appendChild(card);
// });

