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

document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    const channelName = document.getElementById('channel-name');
    const channelAvatar = document.getElementById('channel-avatar');
    const commentForm = document.getElementById('comment-form-container');
    const loginPrompt = document.getElementById('login-prompt');
    const commentInput = document.getElementById('comment-input');
    const commentSubmit = document.getElementById('comment-submit-btn');
    const commentsList = document.getElementById('comment-list');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileLink = document.getElementById('profile-link');

    // URLパラメータから動画IDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    // カスタムビデオプレイヤーの初期化
    let customPlayer = null;
    if (videoPlayer) {
        customPlayer = new CustomVideoPlayer(videoPlayer);
    }

    // 認証状態の管理
    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (token && user) {
            // ログイン済み
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            profileLink.style.display = 'block';
            commentForm.style.display = 'block';
            loginPrompt.style.display = 'none';
        } else {
            // 未ログイン
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            profileLink.style.display = 'none';
            commentForm.style.display = 'none';
            loginPrompt.style.display = 'block';
        }
    }

    // 動画情報の読み込み
    async function loadVideoInfo() {
        console.log('loadVideoInfo開始 - videoId:', videoId);
        
        if (videoId) {
            try {
                // まずバックエンドAPIから動画データを取得
                let video = null;
                try {
                    const apiResponse = await apiClient.getVideo(videoId);
                    video = apiResponse;
                    console.log('APIから取得した動画データ:', video);
                } catch (apiError) {
                    console.warn('APIからの取得に失敗、ローカルデータを使用:', apiError);
                    // APIから取得できない場合はローカルデータを使用
                    video = videos.find(v => v.id == videoId || v.video_id == videoId);
                    console.log('ローカルデータから取得:', video);
                }
                
                if (video) {
                    console.log('動画データ:', video);
                    console.log('動画URL:', video.url);
                    
                    // YouTube動画かどうかを判定
                    const isYouTubeVideo = video.url && video.url.includes('youtube.com/embed');
                    console.log('YouTube動画判定:', isYouTubeVideo);
                    console.log('URL確認:', video.url);
                    
                    // プレイヤー要素を取得
                    const youtubePlayer = document.getElementById('youtube-player');
                    const customPlayer = document.getElementById('custom-video-player');
                    
                    console.log('YouTubeプレイヤー要素:', youtubePlayer);
                    console.log('カスタムプレイヤー要素:', customPlayer);
                    
                    if (isYouTubeVideo) {
                        // YouTube動画の場合
                        console.log('YouTube動画モードを開始');
                        
                        // 両方のプレイヤーを非表示にしてから、YouTubeプレイヤーを表示
                        youtubePlayer.style.display = 'none';
                        customPlayer.style.display = 'none';
                        
                        // 少し待ってからYouTubeプレイヤーを表示
                        setTimeout(() => {
                            youtubePlayer.style.display = 'block';
                            customPlayer.style.display = 'none';
                            
                            // YouTube動画を埋め込み
                            youtubePlayer.src = video.url;
                            console.log('YouTube動画を読み込みました:', video.url);
                        }, 100);
                        
                    } else {
                        // ローカル動画の場合
                        console.log('ローカル動画モード');
                        
                        // 両方のプレイヤーを非表示にしてから、カスタムプレイヤーを表示
                        youtubePlayer.style.display = 'none';
                        customPlayer.style.display = 'none';
                        
                        // 少し待ってからカスタムプレイヤーを表示
                        setTimeout(() => {
                            youtubePlayer.style.display = 'none';
                            customPlayer.style.display = 'block';
                            
                            // 動画ソースを設定
                            videoPlayer.src = video.url;
                            
                            // 動画の読み込みを待つ
                            videoPlayer.addEventListener('loadedmetadata', function() {
                                console.log('動画の読み込みが完了しました');
                                console.log('動画の長さ:', videoPlayer.duration);
                                console.log('動画の幅:', videoPlayer.videoWidth);
                                console.log('動画の高さ:', videoPlayer.videoHeight);
                            });
                            
                            // エラーハンドリング
                            videoPlayer.addEventListener('error', function(e) {
                                console.error('動画の読み込みエラー:', e);
                                console.error('エラー詳細:', videoPlayer.error);
                                alert('動画の読み込みに失敗しました。ファイルパスを確認してください。');
                            });
                            
                            // 動画の読み込み開始
                            videoPlayer.addEventListener('loadstart', function() {
                                console.log('動画の読み込みを開始しました');
                            });
                            
                            // 動画の読み込み進行
                            videoPlayer.addEventListener('progress', function() {
                                console.log('動画の読み込み進行中...');
                            });
                            
                            // 動画の読み込み完了
                            videoPlayer.addEventListener('canplay', function() {
                                console.log('動画の再生準備が完了しました');
                            });
                        }, 100);
                    }
                    
                    videoTitle.textContent = video.title;
                    videoDescription.textContent = video.description || '説明がありません';
                    channelName.textContent = video.channel || 'Unknown Channel';
                    channelAvatar.src = video.channelicon || 'https://via.placeholder.com/40x40';
                    
                    // ページタイトルを動画タイトルに更新
                    document.title = `${video.title} - SecProTube`;
                    
                    document.getElementById('video-views').innerHTML = `
                        <i class="fas fa-eye"></i> ${video.views || 0} 回視聴
                    `;
                    document.getElementById('video-date').innerHTML = `
                        <i class="fas fa-calendar"></i> ${video.upload_date || video.uploadDate || '2024年1月1日'}
                    `;

                    document.getElementById('like-count').textContent = video.likes || 0;
                    document.getElementById('dislike-count').textContent = video.dislikes || 0;
                    
                    console.log('動画情報を読み込みました:', video);
                    console.log('動画URL:', video.url);
                } else {
                    console.error('動画が見つかりません:', videoId);
                    videoTitle.textContent = '動画が見つかりません';
                    videoDescription.textContent = '指定された動画は存在しません。';
                }
            } catch (error) {
                console.error('動画情報の読み込みエラー:', error);
                videoTitle.textContent = 'エラーが発生しました';
                videoDescription.textContent = '動画情報の読み込みに失敗しました。';
            }
        } else {
            console.error('動画IDが指定されていません');
            videoTitle.textContent = '動画IDが指定されていません';
            videoDescription.textContent = 'URLパラメータに動画IDが含まれていません。';
        }
    }

    // コメント投稿処理
    if (commentSubmit) {
        commentSubmit.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const commentText = commentInput.value.trim();
            if (!commentText) return;
            
            const user = JSON.parse(localStorage.getItem('user'));
            
            try {
                await apiClient.postComment({
                    video_id: parseInt(videoId),
                    write_user_id: user.user_id,
                    comment_text: commentText
                });
                
                commentInput.value = '';
                loadComments();
            } catch (error) {
                alert('コメントの投稿に失敗しました');
            }
        });
    }

    // コメント読み込み
    async function loadComments() {
        try {
            const comments = await apiClient.getComments(videoId);
            commentsList.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-author">ユーザーID: ${comment.write_user_id}</div>
                    <div class="comment-text">${comment.comment_text || 'コメントなし'}</div>
                    <div class="comment-date">2024年1月1日</div>
                </div>
            `).join('');
        } catch (error) {
            // APIから取得できない場合はダミーデータを表示
            commentsList.innerHTML = `
                <div class="comment">
                    <div class="comment-author">ユーザー名</div>
                    <div class="comment-text">素晴らしい動画ですね！</div>
                    <div class="comment-date">2024年1月1日</div>
                </div>
            `;
        }
    }

    // ログインボタンの処理
    loginBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    // ログアウトボタンの処理
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('channel');
        window.location.href = 'index.html';
    });

    // 初期化
    checkAuthStatus();
    loadVideoInfo();
    loadComments();
});

document.addEventListener('DOMContentLoaded', function() {
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeCount = document.getElementById('like-count');
    const dislikeCount = document.getElementById('dislike-count');

    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (videoId) {
        const likeKey = `likes_${videoId}`;
        const dislikeKey = `dislikes_${videoId}`;

        function loadLikes() {
            const likes = parseInt(localStorage.getItem(likeKey)) || 0;
            const dislikes = parseInt(localStorage.getItem(dislikeKey)) || 0;
            
            likeCount.textContent = likes;
            dislikeCount.textContent = dislikes;
            
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
                likes--;
                localStorage.removeItem(`vote_${videoId}`);
                likeBtn.classList.remove('active');
            } else {
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
                dislikes--;
                localStorage.removeItem(`vote_${videoId}`);
                dislikeBtn.classList.remove('active');
            } else {
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
    }
});
