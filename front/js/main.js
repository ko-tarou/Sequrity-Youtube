const videoList = document.getElementById("video-list");
const searchInput = document.getElementById("search-input");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const profileLink = document.getElementById("profile-link");
const uploadLink = document.getElementById("upload-link");
const channelLink = document.getElementById("channel-link");
const channelCreateSection = document.getElementById("channel-create-section");
const loginModal = document.getElementById("login-modal");
const modalClose = document.getElementById("modal-close");

// 認証状態の管理
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const channel = JSON.parse(localStorage.getItem('channel') || 'null');
    
    if (token && user) {
        // ログイン済み
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        profileLink.style.display = 'block';
        uploadLink.style.display = 'block';
        
        // チャンネル未作成の場合、チャンネル作成セクションを表示
        if (!channel) {
            channelLink.style.display = 'block';
            channelCreateSection.style.display = 'block';
        } else {
            channelLink.style.display = 'none';
            channelCreateSection.style.display = 'none';
        }
    } else {
        // ゲストモード（ログインなしでも動画閲覧可能）
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        profileLink.style.display = 'none';
        uploadLink.style.display = 'none';
        channelLink.style.display = 'none';
        channelCreateSection.style.display = 'none';
    }
}

// ログインボタンの処理
loginBtn.addEventListener('click', function() {
    showLoginModal();
});

// ログアウトボタンの処理
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('channel');
    window.location.href = 'index.html';
});

// ログインモーダルの表示
function showLoginModal() {
    if (loginModal) {
        loginModal.style.display = 'flex';
    } else {
        // モーダルがない場合はログインページに遷移
        window.location.href = 'login.html';
    }
}

// モーダルを閉じる
if (modalClose) {
    modalClose.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
}

// モーダル外クリックで閉じる
if (loginModal) {
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// ログインフォームの処理
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('modal-email').value;
        const password = document.getElementById('modal-password').value;
        
        try {
            const response = await apiClient.login(email, password);
            
            // ログイン成功時の処理
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            // ページをリロードして認証状態を更新
            window.location.reload();
            
        } catch (error) {
            console.error('ログインエラー:', error);
            alert('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
        }
    });
}

// バックエンドから動画データを取得
async function loadVideosFromAPI(params = {}) {
    try {
        const response = await apiClient.getVideos(params);
        return response.videos || [];
    } catch (error) {
        console.error('動画データの取得に失敗:', error);
        // エラーの場合はローカルデータを使用
        return videos;
    }
}

function renderVideos(filteredVideos) {
    videoList.innerHTML = "";
    
    if (filteredVideos.length === 0) {
        videoList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>検索結果が見つかりません</h3>
                <p>別のキーワードで検索してみてください。</p>
            </div>
        `;
        return;
    }
    
    // 動画数を表示
    const videoCount = document.createElement('div');
    videoCount.className = 'video-count';
    videoCount.innerHTML = `
        <i class="fas fa-video"></i>
        <span>${filteredVideos.length}件の動画</span>
    `;
    videoList.appendChild(videoCount);
    
    // 動画グリッドコンテナ
    const videoGrid = document.createElement('div');
    videoGrid.className = 'video-grid-container';
    
    filteredVideos.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";

        card.innerHTML = `
            <a href="video.html?id=${video.video_id || video.id}">
                <div class="video-thumbnail-container">
                    <img src="${video.thumbnail || 'https://via.placeholder.com/300x180'}" alt="${video.title}" class="video-thumbnail">
                    <div class="video-duration">${video.duration || '0:00'}</div>
                </div>
                <div class="video-details">
                    <img src="${video.channelicon || 'https://via.placeholder.com/40x40'}" alt="${video.channel || 'Unknown'}" class="channel-icon">
                    <div class="text-info">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="channel">${video.channel || 'Unknown Channel'}</p>
                        <p class="video-stats">
                            <span class="views">${video.views || 0}回視聴</span>
                            <span class="upload-date">${video.upload_date || video.uploadDate || '最近'}</span>
                        </p>
                    </div>
                </div>
            </a>
        `;

        videoGrid.appendChild(card);
    });
    
    videoList.appendChild(videoGrid);
}

// カテゴリフィルターの処理
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', async function() {
        // アクティブクラスを更新
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        await filterVideosByCategory(category);
    });
});

// カテゴリでフィルタリング
async function filterVideosByCategory(category) {
    let filteredVideos;
    
    if (category === 'all') {
        filteredVideos = await loadVideosFromAPI();
    } else {
        filteredVideos = await loadVideosFromAPI({ category: category });
    }
    
    renderVideos(filteredVideos);
}

// 検索機能
searchInput.addEventListener("input", async () => {
    const keyword = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.category-btn.active');
    const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';
    
    if (keyword.length === 0) {
        // 検索キーワードが空の場合はカテゴリフィルターのみ適用
        await filterVideosByCategory(category);
        return;
    }
    
    try {
        let filteredVideos;
        
        if (category === 'all') {
            filteredVideos = await loadVideosFromAPI({ search: keyword });
        } else {
            // カテゴリと検索の組み合わせは、まずカテゴリで絞り込み、その後フロントエンドで検索
            const categoryVideos = await loadVideosFromAPI({ category: category });
            filteredVideos = categoryVideos.filter(video =>
                video.title.toLowerCase().includes(keyword) ||
                (video.description && video.description.toLowerCase().includes(keyword))
            );
        }
        
        renderVideos(filteredVideos);
    } catch (error) {
        console.error('検索エラー:', error);
        // エラーの場合はローカル検索
        let filtered = videos;
        if (category !== 'all') {
            filtered = filtered.filter(video => video.category === category);
        }
        filtered = filtered.filter(video =>
            video.title.toLowerCase().includes(keyword) ||
            video.channel.toLowerCase().includes(keyword)
        );
        renderVideos(filtered);
    }
});

// 初期表示
async function initializeVideos() {
    try {
        console.log('初期動画読み込み開始');
        console.log('ローカル動画データ:', videos);
        
        const apiVideos = await loadVideosFromAPI();
        console.log('APIから取得した動画データ:', apiVideos);
        
        if (apiVideos && apiVideos.length > 0) {
            renderVideos(apiVideos);
        } else {
            console.log('APIデータが空のため、ローカルデータを使用');
            renderVideos(videos);
        }
    } catch (error) {
        console.error('初期動画読み込みエラー:', error);
        console.log('ローカル動画データを使用:', videos);
        renderVideos(videos);
    }
}

initializeVideos();
checkAuthStatus();
