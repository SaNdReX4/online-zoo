console.log("Zoo Video script is connected!");
const API_KEY = 'AIzaSyBL4VuxnvuESkpjHHwySxaWtUrb9Y9fOnQ'; // ჩასვი შენი კოდი აქ
async function loadPandaLive() {
    const videoContainer = document.getElementById('panda-video-container');
    // ვამოწმებთ, არის თუ არა ეს კონტეინერი ამ გვერდზე
    if (!videoContainer)
        return;
    const query = "giant+panda+live+cam+wolong+grove";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&q=${query}&type=video&key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            // პირდაპირ ვცვლით კონტეინერის შიგთავსს iframe-ით
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%; border: none;">
                </iframe>`;
        }
        else {
            videoContainer.innerHTML = "<p style='color: white; text-align: center; padding-top: 80px;'>No live stream found.</p>";
        }
    }
    catch (error) {
        console.error("YouTube API Error:", error);
        videoContainer.innerHTML = "<p style='color: white; text-align: center;'>Error loading video.</p>";
    }
}
// გაშვება გვერდის ჩატვირთვისას
window.addEventListener('DOMContentLoaded', loadPandaLive);
export {};
//# sourceMappingURL=zoo-video.js.map