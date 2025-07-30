// APIクライアント
class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:8001'; // FastAPIのポート8001
    }

    // 認証ヘッダーを取得
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // ログイン
    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('ログインに失敗しました');
        }
        
        return await response.json();
    }

    // 新規登録
    async register(username, email, password) {
        const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (!response.ok) {
            throw new Error('登録に失敗しました');
        }
        
        return await response.json();
    }

    // ユーザー情報取得
    async getCurrentUser() {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
            headers: this.getAuthHeaders()
        });
        
        if (!response.ok) {
            throw new Error('ユーザー情報の取得に失敗しました');
        }
        
        return await response.json();
    }

    // チャンネル作成
    async createChannel(channelData) {
        const formData = new FormData();
        formData.append('user_name', channelData.user_name);
        formData.append('email', channelData.email);
        formData.append('password', channelData.password);
        formData.append('admin_id', channelData.admin_id);
        
        if (channelData.icon) {
            formData.append('icon', channelData.icon);
        }

        const response = await fetch(`${this.baseUrl}/channels/`, {
            method: 'POST',
            headers: {
                'Authorization': this.getAuthHeaders().Authorization
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('チャンネル作成に失敗しました');
        }
        
        return await response.json();
    }

    // 動画アップロード
    async uploadVideo(videoData) {
        const formData = new FormData();
        formData.append('channel_id', videoData.channel_id);
        formData.append('create_user_id', videoData.create_user_id);
        
        if (videoData.video) {
            formData.append('video', videoData.video);
        }
        
        if (videoData.thumbnail) {
            formData.append('thumbnail', videoData.thumbnail);
        }

        const response = await fetch(`${this.baseUrl}/videos/`, {
            method: 'POST',
            headers: {
                'Authorization': this.getAuthHeaders().Authorization
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('動画アップロードに失敗しました');
        }
        
        return await response.json();
    }

    // 動画一覧取得（検索・カテゴリフィルター対応）
    async getVideos(params = {}) {
        const url = new URL(`${this.baseUrl}/videos/`);
        
        if (params.category) {
            url.searchParams.append('category', params.category);
        }
        if (params.search) {
            url.searchParams.append('search', params.search);
        }
        if (params.skip) {
            url.searchParams.append('skip', params.skip);
        }
        if (params.limit) {
            url.searchParams.append('limit', params.limit);
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('動画一覧の取得に失敗しました');
        }
        
        return await response.json();
    }

    // 動画詳細取得
    async getVideo(videoId) {
        const response = await fetch(`${this.baseUrl}/videos/${videoId}`);
        
        if (!response.ok) {
            throw new Error('動画情報の取得に失敗しました');
        }
        
        return await response.json();
    }

    // コメント投稿
    async postComment(commentData) {
        const response = await fetch(`${this.baseUrl}/comments/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(commentData)
        });
        
        if (!response.ok) {
            throw new Error('コメント投稿に失敗しました');
        }
        
        return await response.json();
    }

    // コメント一覧取得
    async getComments(videoId) {
        const response = await fetch(`${this.baseUrl}/videos/${videoId}/comments`);
        
        if (!response.ok) {
            throw new Error('コメント一覧の取得に失敗しました');
        }
        
        return await response.json();
    }
}

// グローバルAPIクライアントインスタンス
const apiClient = new ApiClient();

