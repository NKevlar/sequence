from django.apps import AppConfig
from main import Game_Renderer


class SequenceBackendConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sequence_backend"

