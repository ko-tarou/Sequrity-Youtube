class CustomVideoPlayer {
    constructor(videoElement) {
        this.video = videoElement;
        this.controls = document.querySelector('.video-controls');
        this.playPauseBtn = document.querySelector('.play-pause-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressFilled = document.querySelector('.progress-filled');
        this.currentTimeSpan = document.querySelector('.current-time');
        this.totalTimeSpan = document.querySelector('.total-time');
        this.muteBtn = document.querySelector('.mute-btn');
        this.volumeSlider = document.querySelector('.volume-slider');
        this.speedBtn = document.querySelector('.speed-btn');
        this.speedOptions = document.querySelectorAll('.speed-option');
        this.fullscreenBtn = document.querySelector('.fullscreen-btn');
        
        this.isPlaying = false;
        this.isMuted = false;
        this.controlsTimeout = null;
        
        this.initializeEventListeners();

        this.speedOptions.forEach(option => {
            if (parseFloat(option.dataset.speed) === 1) {
                option.classList.add('active');
            }
        });
    }
    
    initializeEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.togglePlay());

        this.progressBar.addEventListener('click', (e) => this.scrub(e));

        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('loadedmetadata', () => this.updateTotalTime());

        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.handleVolumeChange(e));

        this.speedBtn.addEventListener('click', () => this.toggleSpeedMenu());
        this.speedOptions.forEach(option => {
            option.addEventListener('click', (e) => this.changeSpeed(e));
        });

        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        this.video.addEventListener('mousemove', () => this.showControls());
        this.video.addEventListener('mouseleave', () => this.hideControls());
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.speed-container')) {
                const speedMenu = document.querySelector('.speed-menu');
                speedMenu.classList.remove('show');
            }
        });
        
        this.video.addEventListener('ended', () => {
            this.playPauseBtn.textContent = '▶';
            this.isPlaying = false;
        });
    }
    
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
            this.playPauseBtn.textContent = '⏸';
            this.isPlaying = true;
        } else {
            this.video.pause();
            this.playPauseBtn.textContent = '▶';
            this.isPlaying = false;
        }
    }
    
    updateProgress() {
        if (this.video.duration) {
            const percent = (this.video.currentTime / this.video.duration) * 100;
            this.progressFilled.style.width = `${percent}%`;
            
            this.currentTimeSpan.textContent = this.formatTime(this.video.currentTime);
        }
    }
    
    updateTotalTime() {
        this.totalTimeSpan.textContent = this.formatTime(this.video.duration);
    }
    
    scrub(e) {
        const scrubTime = (e.offsetX / this.progressBar.offsetWidth) * this.video.duration;
        this.video.currentTime = scrubTime;
    }
    
    toggleMute() {
        this.video.muted = !this.video.muted;
        this.muteBtn.textContent = this.video.muted ? '🔇' : '🔊';
        this.isMuted = this.video.muted;
        
        if (this.video.muted) {
            this.volumeSlider.value = 0;
        } else {
            this.volumeSlider.value = this.video.volume;
        }
    }
    
    handleVolumeChange(e) {
        this.video.volume = e.target.value;
        this.video.muted = (e.target.value === 0);
        
        if (this.video.volume === 0) {
            this.muteBtn.textContent = '🔇';
        } else {
            this.muteBtn.textContent = '🔊';
        }
    }
    
    toggleSpeedMenu() {
        const speedMenu = document.querySelector('.speed-menu');
        speedMenu.classList.toggle('show');
    }
    
    changeSpeed(e) {
        const speed = parseFloat(e.target.dataset.speed);
        this.video.playbackRate = speed;
        this.speedBtn.textContent = `${speed}x`;
        
        this.speedOptions.forEach(option => {
            option.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // 速度選択後にメニューを閉じる
        const speedMenu = document.querySelector('.speed-menu');
        speedMenu.classList.remove('show');
    }
    
    cycleSpeed() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentSpeed = this.video.playbackRate;
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const nextSpeed = speeds[nextIndex];
        
        this.video.playbackRate = nextSpeed;
        this.speedBtn.textContent = `${nextSpeed}x`;
        
        this.speedOptions.forEach(option => {
            option.classList.remove('active');
            if (parseFloat(option.dataset.speed) === nextSpeed) {
                option.classList.add('active');
            }
        });
    }
    
    toggleFullscreen() {
        const playerContainer = document.querySelector('.custom-video-player');
        
        if (!document.fullscreenElement) {
            playerContainer.requestFullscreen().catch(err => {
                console.log('全画面表示に失敗しました:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    handleKeyPress(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.video.currentTime -= 10;
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.video.currentTime += 10;
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                this.volumeSlider.value = this.video.volume;
                this.video.muted = false;
                this.muteBtn.textContent = '🔊';
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                this.volumeSlider.value = this.video.volume;
                if (this.video.volume === 0) {
                    this.muteBtn.textContent = '🔇';
                }
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'KeyS':
                e.preventDefault();
                this.cycleSpeed();
                break;
        }
    }
    
    showControls() {
        this.controls.style.opacity = '1';
        // 自動で閉じる機能を無効化
        // clearTimeout(this.controlsTimeout);
        // this.controlsTimeout = setTimeout(() => this.hideControls(), 3000);
    }
    
    hideControls() {
        // 自動で閉じる機能を無効化
        // if (this.isPlaying) {
        //     this.controls.style.opacity = '0';
        // }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

const params = new URLSearchParams(window.location.search);
const videoId = parseInt(params.get('id'));
const video = videos.find(v => v.id === videoId);

if (video) {
    document.getElementById('video-title').textContent = video.title;
    document.getElementById('video-description').textContent = video.description;
    
    const videoElement = document.getElementById('main-video');
    
    videoElement.src = video.url;
    
    const player = new CustomVideoPlayer(videoElement);
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
    comments.forEach((comment, idx) => {
        const li = document.createElement('li');
        
        // コメント内容
        const contentDiv = document.createElement('div');
        contentDiv.className = 'comment-content';
        contentDiv.textContent = comment;
        li.appendChild(contentDiv);

        // アクションボタン
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'comment-actions';
        
        // 編集ボタン
        const editBtn = document.createElement('button');
        editBtn.className = 'comment-edit-btn';
        editBtn.textContent = '編集';
        editBtn.onclick = () => editComment(idx, comment);
        actionsDiv.appendChild(editBtn);
        
        // 削除ボタン
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'comment-delete-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.onclick = () => deleteComment(idx);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(actionsDiv);
        commentList.appendChild(li);
    });
}

function editComment(idx, oldComment) {
    const comments = JSON.parse(localStorage.getItem(commentKey)) || [];
    const newComment = prompt('コメントを編集', oldComment);
    if (newComment !== null && newComment.trim() !== '') {
        comments[idx] = newComment.trim();
        localStorage.setItem(commentKey, JSON.stringify(comments));
        loadComments();
    }
}

function deleteComment(idx) {
    if (!confirm('このコメントを削除しますか？')) return;
    const comments = JSON.parse(localStorage.getItem(commentKey)) || [];
    comments.splice(idx, 1);
    localStorage.setItem(commentKey, JSON.stringify(comments));
    loadComments();
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

// いいね・評価システム
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');

const likeKey = `likes_${videoId}`;
const dislikeKey = `dislikes_${videoId}`;

function loadLikes() {
    const likes = parseInt(localStorage.getItem(likeKey)) || 0;
    const dislikes = parseInt(localStorage.getItem(dislikeKey)) || 0;
    
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
    
    // ユーザーの投票状態を復元
    const userVote = localStorage.getItem(`vote_${videoId}`);
    likeBtn.classList.remove('active');
    dislikeBtn.classList.remove('active');
    if (userVote === 'like') {
        likeBtn.classList.add('active');
    } else if (userVote === 'dislike') {
        dislikeBtn.classList.add('active');
    }
}

function handleLike() {
    const currentVote = localStorage.getItem(`vote_${videoId}`);
    let likes = parseInt(localStorage.getItem(likeKey)) || 0;
    let dislikes = parseInt(localStorage.getItem(dislikeKey)) || 0;
    
    if (currentVote === 'like') {
        // いいねを取り消し
        likes--;
        localStorage.removeItem(`vote_${videoId}`);
        likeBtn.classList.remove('active');
    } else {
        // いいねを追加
        if (currentVote === 'dislike') {
            dislikes--;
            dislikeBtn.classList.remove('active');
        }
        likes++;
        localStorage.setItem(`vote_${videoId}`, 'like');
        likeBtn.classList.add('active');
    }
    
    localStorage.setItem(likeKey, likes);
    localStorage.setItem(dislikeKey, dislikes);
    
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
}

function handleDislike() {
    const currentVote = localStorage.getItem(`vote_${videoId}`);
    let likes = parseInt(localStorage.getItem(likeKey)) || 0;
    let dislikes = parseInt(localStorage.getItem(dislikeKey)) || 0;
    
    if (currentVote === 'dislike') {
        // 低評価を取り消し
        dislikes--;
        localStorage.removeItem(`vote_${videoId}`);
        dislikeBtn.classList.remove('active');
    } else {
        // 低評価を追加
        if (currentVote === 'like') {
            likes--;
            likeBtn.classList.remove('active');
        }
        dislikes++;
        localStorage.setItem(`vote_${videoId}`, 'dislike');
        dislikeBtn.classList.add('active');
    }
    
    localStorage.setItem(likeKey, likes);
    localStorage.setItem(dislikeKey, dislikes);
    
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
}

likeBtn.addEventListener('click', handleLike);
dislikeBtn.addEventListener('click', handleDislike);

loadLikes();
loadComments();
