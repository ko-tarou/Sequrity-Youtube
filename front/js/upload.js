document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const errorMessage = document.getElementById('error-message');
    const progressBar = document.getElementById('progress-bar');
    const videoInput = document.getElementById('video-file');
    const videoPreview = document.getElementById('video-preview');
    const thumbnailInput = document.getElementById('video-thumbnail');
    const thumbnailPreview = document.getElementById('thumbnail-preview');

    videoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            videoPreview.src = url;
            videoPreview.style.display = 'block';
        }
    });

    thumbnailInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                thumbnailPreview.src = e.target.result;
                thumbnailPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const videoFile = videoInput.files[0];
        const title = document.getElementById('video-title').value;
        const description = document.getElementById('video-description').value;
        const category = document.getElementById('video-category').value;
        const visibility = document.getElementById('video-visibility').value;
        const thumbnailFile = thumbnailInput.files[0];
        
        if (!videoFile) {
            showError('動画ファイルを選択してください');
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('user'));
        const channel = JSON.parse(localStorage.getItem('channel'));
        
        const videoData = {
            channel_id: channel ? channel.channel_id : 1,
            create_user_id: user.user_id,
            video: videoFile,
            title: title,
            description: description,
            category: category,
            visibility: visibility
        };
        
        if (thumbnailFile) {
            videoData.thumbnail = thumbnailFile;
        }
        
        try {
            progressBar.style.display = 'block';
            
            const data = await apiClient.uploadVideo(videoData);
            
            alert('動画のアップロードが完了しました！');
            window.location.href = 'profile.html';
        } catch (error) {
            showError(error.message || 'アップロードに失敗しました');
        } finally {
            progressBar.style.display = 'none';
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
