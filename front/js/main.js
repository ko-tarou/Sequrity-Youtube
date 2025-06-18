const videoList = document.getElementById("video-list");
const searchInput = document.getElementById("search-input");

function renderVideos(filteredVideos) {
  videoList.innerHTML = "";
  filteredVideos.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <a href="video.html?id=${video.id}" clss="cards">
        <section class="video-card">
          <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
          <div class="video-details">
            <img src="${video.channelicon}" alt="${video.channel}" class="channel-icon">
            <div class="text-info">
              <h3>${video.title}</h3>
              <p class="channel">${video.channel}</p> 
            </div>
          </div>
        </section>
      </a>
    `;

    videoList.appendChild(card);
  });
}

renderVideos(videos);

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = videos.filter(video =>
    video.title.toLowerCase().includes(keyword)
  );
  renderVideos(filtered);
});

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('menu');

  hamburger.addEventListener('click', function () {
    nav.classList.toggle('is_active');
  });
});

