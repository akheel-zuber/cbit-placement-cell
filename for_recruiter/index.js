// Get all elements with the class "col"
const cols = document.querySelectorAll('.col');


const options = {
    threshold: 0.5 
};

// Intersection Observer callback function
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate'); // Add the "animate" class when the element is in view
        } else {
            entry.target.classList.remove('animate'); // Remove the "animate" class when the element is out of view
        }
    });
};

// Create a new Intersection Observer
const observer = new IntersectionObserver(observerCallback, options);

// Observe each element with the class "col"
cols.forEach(col => {
    observer.observe(col);
});
