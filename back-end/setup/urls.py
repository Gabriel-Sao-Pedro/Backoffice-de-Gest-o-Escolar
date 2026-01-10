from django.contrib import admin
from django.urls import path,include
from escola.views import AlunosViewSet, CursosViewSet, MatriculaViewSet, ListaMatriculasAluno, ListaAlunosMatriculados, AvaliacaoViewSet, AtividadeAvaliativaViewSet
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register('alunos', AlunosViewSet, basename='Alunos')
router.register('cursos', CursosViewSet, basename='Cursos')
router.register('matriculas', MatriculaViewSet, basename='Matriculas')
router.register('avaliacoes', AvaliacaoViewSet, basename='Avaliacoes')
router.register('atividades', AtividadeAvaliativaViewSet, basename='Atividades')

urlpatterns = [
    path('controle-geral/', admin.site.urls),
    path('', include(router.urls) ),
    path('alunos/<int:pk>/matriculas/', ListaMatriculasAluno.as_view()),
    path('cursos/<int:pk>/matriculas/', ListaAlunosMatriculados.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
