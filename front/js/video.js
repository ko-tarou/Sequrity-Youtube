
const params = new URLSearchParams(window.location.search);
const videoId = parseInt(params.get('id'));

const video = videos.find(v => v.id === videoId);

function convertToEmbedUrl(url) {
  const match = url.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}
if (video) {
  document.getElementById('video-title').textContent = video.title;
  document.getElementById('main-video').src = convertToEmbedUrl(video.url);
  document.getElementById('video-description').textContent = video.description;
} else {
  document.getElementById('video-container').innerHTML = `
    <p>動画が見つかりませんでした。</p>
    <a href="index.html">一覧に戻る</a>
  `;
}

const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentList = document.getElementById('comment-list');

const commentKey = `comments_${videoId}`;

function loadComments() {
  const comments = JSON.parse(localStorage.getItem(commentKey)) || [];
  commentList.innerHTML = '';
  comments.forEach(comment => {
    const li = document.createElement('li');
    li.textContent = comment;
    commentList.appendChild(li);
  });
}

commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newComment = commentInput.value.trim();
  if (!newComment) return;

  const comments = JSON.parse(localStorage.getItem(commentKey)) || [];
  comments.push(newComment);
  localStorage.setItem(commentKey, JSON.stringify(comments));

  commentInput.value = '';
  loadComments();
});

loadComments();
