
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置"""
    app_name: str = "AI私人家庭医生"
    app_version: str = "1.0.0"
    debug: bool = True
    secret_key: str = "dev-secret-key-change-in-production"

    # 数据库
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/aidoc"
    database_pool_size: int = 10
    database_max_overflow: int = 20

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    redis_password: Optional[str] = None

    # JWT
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 1440
    jwt_refresh_token_expire_days: int = 7

    # 微信
    wechat_app_id: str = ""
    wechat_app_secret: str = ""

    # AI模型
    model_scope_api_key: str = ""
    model_scope_endpoint: str = "https://api.modelscope.cn/v1/chat/completions"
    model_name: str = "Qwen-1.8B-Chat"
    model_temperature: float = 0.7
    model_max_tokens: int = 2048

    # 文件上传
    upload_dir: str = "./uploads"
    max_upload_size: int = 10485760

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

