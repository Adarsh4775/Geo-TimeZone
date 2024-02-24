// Ensure that you have a Geoapify API key
const geoapifyApiKey = 'YOUR_GEOAPIFY_API_KEY';

function getCurrentTimezone() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchTimezoneInfo(latitude, longitude, 'current-timezone-display');
        }, handleLocationError);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function getTimezoneByAddress() {
    const address = document.getElementById('address').value;
    if (!address) {
        alert('Please enter an address.');
        return;
    }

    fetch(`https://api.geoapify.com/v1/geocoding/search?text=${encodeURIComponent(address)}&apiKey=${geoapifyApiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                const { lat, lon } = data.features[0].geometry;
                fetchTimezoneInfo(lat, lon, 'address-timezone-display');
            } else {
                alert('Invalid address. Please enter a valid address.');
            }
        })
        .catch(error => console.error('Error during geocoding:', error));
}

function fetchTimezoneInfo(latitude, longitude, displayId) {
    fetch(`https://api.geoapify.com/v1/timezone?lat=${latitude}&lon=${longitude}&apiKey=${geoapifyApiKey}`)
        .then(response => response.json())
        .then(data => {
            const timezone = data.timezone;
            document.getElementById(displayId).textContent = `Timezone: ${timezone}`;
        })
        .catch(error => console.error('Error during timezone retrieval:', error));
}

function handleLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}

// Get current timezone on page load
getCurrentTimezone();
