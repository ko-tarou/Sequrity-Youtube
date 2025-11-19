from slowapi import Limiter
from slowapi.util import get_remote_address

# レート制限の設定（グローバルインスタンス）
limiter = Limiter(key_func=get_remote_address)

