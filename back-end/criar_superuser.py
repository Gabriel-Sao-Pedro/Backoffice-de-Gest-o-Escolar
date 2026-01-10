import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from django.contrib.auth.models import User

# Deletar usuário anterior se existir
User.objects.filter(username='admin').delete()

# Criar novo superusuário
user = User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
print(f"✅ Superusuário criado com sucesso!")
print(f"Usuário: admin")
print(f"Senha: admin123")
print(f"Email: admin@example.com")
