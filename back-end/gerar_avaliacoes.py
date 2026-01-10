import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import Matricula, Avaliacao

# Limpar avaliações anteriores
Avaliacao.objects.all().delete()

# Pegar todas as matrículas
matriculas = Matricula.objects.all()

# Gerar avaliações para cada matrícula
for matricula in matriculas:
    # Gerar 3 notas entre 5.0 e 10.0
    nota1 = round(random.uniform(5.0, 10.0), 1)
    nota2 = round(random.uniform(5.0, 10.0), 1)
    nota3 = round(random.uniform(5.0, 10.0), 1)
    
    Avaliacao.objects.create(
        matricula=matricula,
        nota1=nota1,
        nota2=nota2,
        nota3=nota3
    )

print(f"✅ {Avaliacao.objects.count()} avaliações criadas com sucesso!")
