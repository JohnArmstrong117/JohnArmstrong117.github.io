const catImage = document.getElementById('catImage');
const newCatBtn = document.getElementById('newCatBtn');

async function getCatImage(){
    try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await res.json();
        catImage.src = data[0].url;
    } catch (err){
        catImage.alt = "Couldn't load cat...";
        console.error('Error fetching cat:', err);
    }
}

getCatImage();

newCatBtn.addEventListener('click', getCatImage);