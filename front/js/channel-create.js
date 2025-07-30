document.addEventListener('DOMContentLoaded', function() {
    const channelForm = document.getElementById('channel-create-form');
    const errorMessage = document.getElementById('error-message');
    const iconInput = document.getElementById('channel-icon');
    const iconPreview = document.getElementById('icon-preview');

    // アイコンファイルプレビュー
    iconInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                iconPreview.src = e.target.result;
                iconPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    channelForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const channelName = document.getElementById('channel-name').value;
        const channelDescription = document.getElementById('channel-description').value;
        const iconFile = iconInput.files[0];
        
        const user = JSON.parse(localStorage.getItem('user'));
        
        const channelData = {
            user_name: channelName,
            email: user.email,
            password: 'dummy', // チャンネル用のダミーパスワード
            admin_id: user.user_id
        };
        
        if (iconFile) {
            channelData.icon = iconFile;
        }
        
        try {
            const data = await apiClient.createChannel(channelData);
            
            // チャンネル情報をローカルストレージに保存
            localStorage.setItem('channel', JSON.stringify(data));
            
            // プロフィール画面にリダイレクト
            window.location.href = 'profile.html';
        } catch (error) {
            showError(error.message || 'チャンネル作成に失敗しました');
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}); 