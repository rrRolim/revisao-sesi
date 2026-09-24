# Revisão SESI — 3º Bimestre

Plataforma de revisão para o 2º e o 3º ano do Ensino Médio, organizada por Linguagens, Matemática, Ciências da Natureza e Ciências Humanas.

## Abrir o site

**[Acessar Revisão SESI](https://rrrolim.github.io/revisao-sesi/)**

Abra o link no computador, tablet ou celular para estudar direto no navegador, sem baixar arquivos.

## Identificação do trabalho

- Curso: Técnico em Desenvolvimento de Sistemas
- Atividade: página web com conteúdos de revisão dos testes
- Período: semana de testes
- Instituição: SESI
- Turma: preencher
- Alunos: preencher
- Professor(a): preencher

## Baixar e abrir no computador

Se preferir usar uma cópia local:

1. No repositório, clique em **Code → Download ZIP**.
2. Extraia o ZIP usando **Extrair tudo**.
3. Abra a pasta extraída e dê dois cliques em `index.html`.

Mantenha as pastas `assets`, `pages` e `conteudos` junto de `index.html` para tudo funcionar. Também é possível clonar o repositório. Não é necessário instalar programas, dependências ou banco de dados.

## Funcionalidades

- Seleção entre 2º e 3º ano.
- Quatro áreas em cada ano, todas com conteúdo, quiz e checklist.
- Abas acessíveis por clique ou teclado (setas, Home e End).
- Questões autorais com correção imediata ao selecionar uma resposta.
- Explicação do gabarito, pontuação, revisão de respostas e reinício do quiz.
- Checklist separado por assunto, área e ano, com progresso percentual.
- Persistência do checklist em `localStorage`, quando permitida pelo navegador. Caso o armazenamento seja bloqueado, o progresso funciona durante a sessão.
- Layout adaptado a computador, tablet e celular; HTML semântico, rótulos, foco visível e mensagens para leitores de tela.
- Ano do rodapé atualizado automaticamente.
- Materiais de apoio em Markdown para os dois anos e as quatro áreas.

O quiz e o checklist têm funções distintas: a pontuação do quiz mede acertos; a barra de estudos mede os assuntos marcados como revisados. Refazer o quiz não apaga o checklist. O quiz reinicia ao recarregar a página.

## Conteúdos

São 47 assuntos e 42 questões, distribuídos pelas oito combinações de ano e área. Matemática do 3º ano inclui um panorama dos temas do ENEM e aprofundamento em Geometria Analítica, conforme a orientação recebida.

Os conteúdos das outras áreas e do 2º ano são roteiros gerais sugeridos. Eles não foram confirmados como o programa das provas da turma: confira o caderno e ajuste a seleção. A revisão não pretende esgotar todo o currículo. As questões são autorais e a pontuação não simula a nota TRI do ENEM.

## Organização

```text
index.html
assets/
  css/style.css
  js/data.js
  js/script.js
conteudos/
  2ano/linguagens.md, matematica.md, natureza.md, humanas.md
  3ano/linguagens.md, matematica.md, natureza.md, humanas.md
pages/
  2ano.html
  3ano.html
  areas/
    2ano/linguagens.html, matematica.html, natureza.html, humanas.html
    3ano/linguagens.html, matematica.html, natureza.html, humanas.html
README.md
```

## Como personalizar

1. Preencha a identificação acima.
2. Edite os objetos de `curriculum` em `assets/js/data.js` para ajustar assuntos e questões de cada área e ano.
3. Cada questão tem cinco alternativas. O campo `answer` usa A = 0, B = 1, C = 2, D = 3 e E = 4.
4. Os IDs dos assuntos são usados no checklist; mantenha os mesmos IDs para preservar o progresso de conteúdos que continuarem iguais.
5. Edite `assets/css/style.css` para ajustar a aparência. As interações ficam em `assets/js/script.js`.
6. Mantenha os arquivos Markdown de `conteudos/` coerentes com as alterações feitas na página.

Antes de entregar, abra o site, escolha os dois anos, teste as quatro áreas, responda um quiz e marque/desmarque itens do checklist. Recarregue a página para conferir o progresso. Estude os exemplos e personalize o material para conseguir explicar o trabalho.

## Referências

- Modelo indicado pelo professor: https://github.com/eduhernandes/revisao-estudos-sesi
- Matriz de Referência do ENEM — Inep: https://download.inep.gov.br/enem/outros_documentos/enem_matriz_referencia.pdf
- Provas e gabaritos do ENEM — Inep: https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos

Página produzida com apoio de IA. Os resumos, exemplos e questões são material de apoio autoral; o repositório do professor serviu como referência de organização e funcionalidades.
