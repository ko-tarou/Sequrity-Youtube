document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            showError('パスワードが一致しません');
            return;
        }

        if (password.length < 6) {
            showError('パスワードは6文字以上で入力してください');
            return;
        }
        
        try {
            const data = await apiClient.register(username, email, password);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            window.location.href = 'index.html';
        } catch (error) {
            showError(error.message || '登録に失敗しました');
        }
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}); 