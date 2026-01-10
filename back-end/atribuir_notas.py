import os
import django
import random
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'setup.settings')
django.setup()

from escola.models import AtividadeAvaliativa, Matricula

"""
Atribui notas para todas as atividades e provas existentes.
- Provas (tipo 'P'): nota com 1 casa decimal, média ~7.0 (limitada entre 0 e 10).
- Atividades (tipo 'A'): nota com 2 casas decimais, média ~7.5 (limitada entre 0 e 10).
- Não altera Trabalhos (tipo 'T').
"""

def clamp(n: float, min_v: float = 0.0, max_v: float = 10.0) -> float:
    return max(min(n, max_v), min_v)


def gerar_nota(base: float, desvio: float, casas: int) -> float:
    valor = random.gauss(mu=base, sigma=desvio)
    valor = clamp(valor)
    return round(valor, casas)


def atribuir_notas():
    total_atualizadas = 0

    # Seed para reproducibilidade básica
    random.seed(20260110)

    atividades = AtividadeAvaliativa.objects.all()
    for atividade in atividades.iterator():
        if atividade.tipo == 'P':
            atividade.nota = gerar_nota(base=7.0, desvio=1.8, casas=1)
            atividade.entregue = True
        elif atividade.tipo == 'A':
            atividade.nota = gerar_nota(base=7.5, desvio=1.5, casas=2)
            atividade.entregue = True
        else:
            # Ignora trabalhos neste passo
            continue
        atividade.save(update_fields=['nota', 'entregue'])
        total_atualizadas += 1

    print(f"Notas atribuídas. Registros atualizados: {total_atualizadas}")


if __name__ == '__main__':
    atribuir_notas()
