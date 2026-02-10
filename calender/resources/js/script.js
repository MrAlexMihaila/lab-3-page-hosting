//array to hold all events
let events = [];

//number to hold index of current event so it can be modified 
let currentEventEditIndex = null;

//updates location option based on option selected in modal form
function updateLocationOptions(value) {
    //console.log(value);
    let locationGroup = document.getElementById("location_group");
    let remoteGroup = document.getElementById("remote_group");

    let locationInput = document.getElementById("event_location");
    let remoteInput = document.getElementById("event_remote_url");
    switch(value){
        case "remote":
            
            //console.log(info);
            remoteGroup.classList.remove("d-none");
            locationGroup.classList.add("d-none");

            remoteInput.required = true;
            locationInput.required = false;
            break;
        case "in-person":
            
            remoteGroup.classList.add("d-none");
            locationGroup.classList.remove("d-none");

            remoteInput.required = false;
            locationInput.required = true;
            break;
    }
}

//save the event in the required format
function saveEvent() {
    let nameInfo = document.getElementById("event_name");
    let categoryInfo = document.getElementById("event_category");
    let weekdayInfo = document.getElementById("event_weekday");
    let timeInfo = document.getElementById("event_time");
    let modalityInfo = document.getElementById("event_modality");
    let locationInfo = document.getElementById("event_location");
    let remoteInfo = document.getElementById("event_remote_url");
    let peopleInfo = document.getElementById("event_attendees");

    let remoteName = "";
    let locationName = "";

    if(modalityInfo.value == "in-person")
    {
        remoteName = null;
        locationName = locationInfo.value;
    }
    else
    {
        locationName = null;
        remoteName = remoteInfo.value;
    }

    const eventDetails = {
        name: nameInfo.value,
        category: categoryInfo.value,
        weekday: weekdayInfo.value,
        time: timeInfo.value,
        modality: modalityInfo.value,
        location: locationName,
        remote_url: remoteName, 
        attendees: peopleInfo.value
    };


    //check if we are updating an event, and if so, make changes to that event in the array
    if(currentEventEditIndex !== null)
    {
        events[currentEventEditIndex] = eventDetails;
        
        const oldCard = document.querySelectorAll(".event")[currentEventEditIndex];
        oldCard.remove();
        addEventToCalendarUI(eventDetails);
        currentEventEditIndex = null
    }
    else //create new event
    {
        events.push(eventDetails);
        addEventToCalendarUI(eventDetails);
    }

    //console.log(events);

    document.getElementById('event_form').reset();
    document.getElementById("location_group").classList.remove("d-none");
    document.getElementById("remote_group").classList.add("d-none");

    document.getElementById("event_location").required = true;
    document.getElementById("event_remote_url").required = false;

    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}

//actually add the event card to the event calendar
function addEventToCalendarUI(eventInfo) {
    let event_card = createEventCard(eventInfo);
    let dayDiv = document.getElementById(eventInfo.weekday);
    dayDiv.appendChild(event_card);

}

//create event card to be placed in the actual calendar
function createEventCard(eventDetails) {
    let nameInfo = eventDetails.name;
    let categoryInfo = eventDetails.category;
    let timeInfo = eventDetails.time;
    let modalityInfo = eventDetails.modality;
    let locationInfo = eventDetails.location;
    let remoteInfo = eventDetails.remote_url;
    let peopleInfo = eventDetails.attendees;

    let modalityText = "";
    let locationText = ""

    if(modalityInfo == "in-person")
    {
        modalityText = "In-Person";
        locationText = locationInfo;
    }
    else
    {
        modalityText = "Remote";
        locationText = remoteInfo;
    }

    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1';

    let info = document.createElement('div');
    info.innerHTML = `
    <strong>Event Name:</strong>
    <p>${nameInfo}</p>
    <strong>Event Time:</strong>
    <p>${timeInfo}</p>
    <strong>Event Modality:</strong>
    <p>${modalityText}</p>
    <strong>Event Location:</strong>
    <p>${locationText}</p>
    <strong>Attendees:</strong>
    <p>${peopleInfo}</p>
    `;

    //set div color based on category
    switch(categoryInfo)
    {
        case "academic":
            event_element.style.background = "#1cddd0";
            break;
        case "work":
            event_element.style.background = "#4bd15d";
            break;
        case "personal":
            event_element.style.background = "#8b83a8";
            break;
    }

    //add event listener for edit event
    event_element.addEventListener("click", () => openEditMenu(events.indexOf(eventDetails)));

    event_element.appendChild(info);
    
    return event_element;
}

//handle form validation for submitting event data
function handleSubmit() {
    let form = document.getElementById("event_form");
    if(!form.checkValidity()){
        form.reportValidity();
        return false;
    }

    saveEvent();
    return false; //prevents page reload?
}

//handle opening of edit modal to edit events
function openEditMenu(index) {
    const event = events[index];
    currentEventEditIndex = index;

    document.getElementById("event_name").value = event.name;
    document.getElementById("event_category").value = event.category;
    document.getElementById("event_weekday").value = event.weekday;
    document.getElementById("event_time").value = event.time;
    document.getElementById("event_modality").value = event.modality;
    updateLocationOptions(event.modality);
    document.getElementById("event_location").value = event.location || "";
    document.getElementById("event_remote_url").value = event.remote_url || "";
    document.getElementById("event_attendees").value = event.attendees;

    const myModalElement = document.getElementById("event_modal");
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.show();
}