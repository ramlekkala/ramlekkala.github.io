function loadContent(page) {
    fetch(page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('home-content').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => console.error('Error loading content:', error));
}

function showHomePage() {
    document.getElementById('home-content').style.display = 'block';
    document.getElementById('content').style.display = 'none';
}