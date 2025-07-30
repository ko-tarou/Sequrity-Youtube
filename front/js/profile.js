document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    const channelSection = document.getElementById('channel-section');
    const noChannelSection = document.getElementById('no-channel-section');
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('channel');
        window.location.href = 'index.html';
    });
    
    function loadUserInfo() {
        const user = JSON.parse(localStorage.getItem('user'));
        const channel = JSON.parse(localStorage.getItem('channel'));
        
        if (user) {
            document.getElementById('user-name').textContent = user.username;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('display-username').textContent = user.username;
            document.getElementById('display-email').textContent = user.email;
            document.getElementById('display-created').textContent = new Date().toLocaleDateString('ja-JP');
        }
        
        if (channel) {
            channelSection.style.display = 'block';
            noChannelSection.style.display = 'none';
            
            document.getElementById('channel-name').textContent = channel.user_name;
            document.getElementById('channel-description').textContent = channel.description || '説明なし';
            
            if (channel.icon) {
                document.getElementById('channel-avatar').src = channel.icon;
            }
        } else {
            channelSection.style.display = 'none';
            noChannelSection.style.display = 'block';
        }
    }
    
    loadUserInfo();
}); 