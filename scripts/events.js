$(document).ready(function () {
    // pointer to container holding the events
    const eventContainer = $("#event-container");
    // pointer to container create new event container
    const createEvent = $("#create-event-container");
    // pointer to create event button
    const createEventButton = $("#create-event-open");
    // pointer to "No Events" messgae
    const noEvents = $("#no-events");
    // pointer to "Save Changes" button in modal form
    const saveChanges = $("#save-changes");
    // pointer to the "Event name" form in the modal thing
    const eventNameForm = $("#event-name");
    // pointer to the "Event date" form in the modal thing
    const eventDateForm = $("#event-date");
    // pointer to the "Select priority" form in the modal thingamajig
    const selectPriority = $("#select-priority");
    // pointer to the "Event description" form in the modal thingabadingaling
    const eventDescriptionForm = $("#event-description")

    // number of events currently loaded
    let eventsCount = 0;

    // Placeholder event
    const eventItem = $("#placeholder");

    // Datepicker setup
    var date_input = $('input[name="date"]'); //our date input has the name "date"
    // var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'mm/dd/yyyy',
        // container: container,
        todayHighlight: true,
        autoclose: true,
        toggleActive: true,
        defaultViewDate: {  year: new Date().getFullYear(),
                            month: new Date().getMonth(),
                            day: new Date().getDate() }
    };
    date_input.datepicker(options);

    //if user is authenticated
    firebase.auth().onAuthStateChanged(function (user) {
        //pointer to the user's events collection
        let events = db.collection("users").doc(user.uid).collection("events");

        //capture a snapshot of the events collection
        events.get().then(function (doc) {
            if (doc.size > 0) {
                hideNoEventsMessage();
                //execute a function for each child of the event collectin
                doc.forEach(function (child) {
                    let name = child.data().name;
                    let date = child.data().date;
                    let priority = child.data().priority;
                    let description = child.data().description;
    
                    //append before #create-event-container
                    createNewEvent(name, date, priority, description);
                });
            }
        });
    });

    // When clicking the "Save Changes" button on the modal.
    $(saveChanges).click(function () {
        //save the values of the inputs
        let eventName = $(eventNameForm).val();
        let eventDate = $(eventDateForm).val();
        let eventPriority = $(selectPriority).val();
        let eventDescription = $(eventDescriptionForm).val();

        //save the information into the database
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("users").doc(user.uid).collection("events").add({
                "name": eventName,
                "date": eventDate,
                "priority": eventPriority,
                "description": eventDescription
            });
        });

        createNewEvent(eventName, eventDate, eventPriority, eventDescription);

        // Reset values of input forms
        $(eventName).val("");
        $(date_input).datepicker('update', '');
        $(eventPriority).val("");
        $(eventDescription).val("");
    });

    // Adds a new event to the list
    function createNewEvent(name, date, priority, description) {
        let clone = eventItem.clone().show()
        $(clone).find("#item-name").html(name);
        $(clone).find("#item-date").html(date);
        $(clone).find("#item-priority").html("<b>Priority: </b>" + priority);
        $(clone).find("#item-description").html("<b>Description: </b>" + description);
        $(clone).find(".down").hide();

        // set unique id for the collapsible
        $(clone).find(".collapse").attr("id", "collapse-" + eventsCount);
        // set target of the button to the unique collapsible id
        $(clone).find(".btn").attr("href", "#collapse-" + eventsCount);
        // bind click event to button
        $(clone).find(".btn").click(function () {
            // toggle between the up and down image of the dropdown button
            console.log("test")
            if ($(this).find(".up").is(":visible")) {
                $(this).find(".up").hide();
                $(this).find(".down").show();
            } else {
                $(this).find(".up").show();
                $(this).find(".down").hide();
            }
        });
        $(clone).insertBefore(createEvent);

        eventsCount++;
    }

    // Hides the "No Events" message
    function hideNoEventsMessage() {
        if (noEvents.is(":visible")) {
            noEvents.hide();
        }
    }


});