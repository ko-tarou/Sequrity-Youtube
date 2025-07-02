-- データベース作成と使用
DROP DATABASE IF EXISTS SecurityYoutube;
CREATE DATABASE SecurityYoutube;
USE SecurityYoutube;
-- DB名を SequrityYoutube から SecurityYoutube に修正しました。

-- ユーザーテーブル
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE -- boolean で管理者かどうかを確認してる
);

-- 通知テーブル
CREATE TABLE notifications (
    notice_id INT AUTO_INCREMENT PRIMARY KEY,
    receive_user_id INT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receive_user_id) REFERENCES users(id)
);

-- チャンネルテーブル
CREATE TABLE channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    channel_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 動画テーブル
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel_id INT NOT NULL,
    create_user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    FOREIGN KEY (create_user_id) REFERENCES users(id)
);

-- カテゴリテーブル
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT NOT NULL,
    category_name VARCHAR(100),
    category_number TINYINT,
    FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- コメントテーブル
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT NOT NULL,
    write_user_id INT NOT NULL,
    content TEXT NOT NULL,
    write_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id),
    FOREIGN KEY (write_user_id) REFERENCES users(id)
);

-- チャンネル入退履歴テーブル
CREATE TABLE channel_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (video_id) REFERENCES videos(id)
);
