# Santuário - Frontend React

## Descrição

Este projeto é um frontend moderno e completo para o **Santuário**, uma plataforma de gerenciamento de zoológicos. Construído com React, TypeScript e Tailwind CSS, ele oferece uma experiência de usuário rica e uma interface de administração robusta, pronta para ser integrada com uma API backend, como a desenvolvida com Spring Boot.

A aplicação se divide em duas partes principais:
1.  **Site Público:** Uma interface visualmente atraente para visitantes, apresentando informações sobre o santuário, seus animais e como visitá-lo.
2.  **Painel de Gerenciamento:** Uma área restrita para funcionários, permitindo o gerenciamento completo (CRUD) de todas as entidades principais do zoológico.

---

## Funcionalidades

### Site Público
- **Página Inicial Dinâmica:** Carousel de heróis, seções sobre a missão e a equipe do santuário.
- **Galeria de Animais:** Apresentação detalhada dos animais residentes.
- **Informações de Visita:** Mapa, horários de funcionamento e formulário de contato.

### Painel de Gerenciamento (Dashboard)
- **Dashboard Geral:** Visão geral com estatísticas, alertas importantes e atividades recentes.
- **Gerenciamento de Entidades (CRUD Completo):**
    - **Animais:** Cadastro, edição, visualização de detalhes e exclusão.
    - **Cuidadores:** Gestão da equipe de cuidadores.
    - **Veterinários:** Gestão da equipe de veterinários.
    - **Habitats:** Gerenciamento dos habitats, incluindo capacidade e status.
    - **Planos de Alimentação:** Criação e atribuição de dietas.
- **Navegação Intuitiva:** Sistema de navegação por abas e breadcrumbs para fácil localização.
- **Componentes Reutilizáveis:** Páginas de gerenciamento genéricas, modais de confirmação e notificações (toasts) para uma UX consistente.

---

## Tecnologias Utilizadas

- **React 19:** Para a construção de interfaces de usuário reativas e componentizadas.
- **TypeScript:** Para garantir um código mais seguro, legível e manutenível.
- **Tailwind CSS:** Para uma estilização rápida, customizável e responsiva.
- **ES Modules:** Utilizando import maps para gerenciar dependências sem a necessidade de um bundler como Webpack ou Vite.

---

## Estrutura do Projeto

O código-fonte está organizado de forma lógica para facilitar a manutenção e escalabilidade.

```
/
├── components/       # Componentes reutilizáveis (Navbar, Cards, Ícones, etc.)
├── pages/            # Componentes de página (DashboardPage, AnimalGalleryPage, etc.)
├── services/         # Lógica para chamadas à API (pronto para implementação)
├── types/            # Definições de tipos TypeScript
│   ├── site.ts       # Tipos para o site público
│   └── dashboard.ts  # Tipos (DTOs) para o painel de gerenciamento (backend)
├── index.html        # Ponto de entrada da aplicação
├── index.tsx         # Renderização principal do React
└── README.md         # Esta documentação
```

---

## Guia de Integração com o Backend (Spring Boot)

Este frontend foi projetado para se conectar perfeitamente a uma API RESTful, como a especificada no projeto do zoológico em Spring Boot. Todas as interfaces e fluxos de dados já estão prontos.

### Mapeamento de Requisitos

- **Entidades (`/types/dashboard.ts`):**
  - **Animal (`AnimalDashboard`):** Mapeia diretamente os campos `id`, `nome` (name), `especie` (species), `idade` (age) e os IDs relacionais.
  - **Habitat (`Habitat`):** Suporta `id`, `nome`, `tipo` e `capacidade`.
  - **Cuidador (`Cuidador`):** Suporta `id`, `nome` e `especialidade`.
  - **Veterinário (`Veterinario`):** Suporta `id`, `nome`, `CRMV` e `especialidade`.
  - **Alimentação (`PlanoAlimentar`):** Corresponde a um plano alimentar, com suporte para `id`, `tipoDeComida`, `quantidade`, etc.

- **Funcionalidades (CRUD & Filtros):**
  - **CRUD:** Para cada entidade, o frontend já possui componentes de **Criação** (formulário), **Leitura** (lista e detalhes), **Atualização** (reaproveitamento do formulário) e **Exclusão** (com modal de confirmação).
  - **Filtros:** A UI em `AnimalManagementPage.tsx` e `GenericManagementPage.tsx` já contém os campos de input e select para implementar as chamadas de filtro da sua API (ex: `GET /animais?especie=...`).

### Passos para a Integração

1.  **Configurar o Proxy (se necessário):** Se o frontend e o backend rodarem em portas diferentes, configure um proxy para evitar problemas de CORS. Em um ambiente de produção, isso geralmente é tratado pelo servidor web (Nginx, Apache).

2.  **Implementar as Chamadas de API em `/services/api.ts`:**
    Este arquivo é o local central para toda a comunicação com o backend. Substitua os dados mockados por chamadas `fetch` reais.

    **Exemplo: Buscar todos os animais**
    ```typescript
    // Em services/api.ts
    export const getAnimals = async () => {
      try {
        const response = await fetch('/api/animais'); // Ajuste a URL da sua API
        if (!response.ok) {
          throw new Error('A resposta da rede não foi bem-sucedida');
        }
        return await response.json();
      } catch (error) {
        console.error("Falha ao buscar animais:", error);
        throw error;
      }
    };
    ```

3.  **Conectar Componentes ao Serviço da API:**
    Em `pages/DashboardPage.tsx`, use o hook `useEffect` para carregar os dados iniciais, substituindo os arrays de dados mockados.

    **Exemplo: Carregar animais no Dashboard**
    ```typescript
    // Em pages/DashboardPage.tsx
    import { getAnimals } from '../services/api'; // Importe a função

    const DashboardPage: React.FC<DashboardPageProps> = ({ setPage }) => {
      const [animals, setAnimals] = React.useState<AnimalDashboard[]>([]); // Inicie como vazio
      const [loading, setLoading] = React.useState(true);

      React.useEffect(() => {
        const loadData = async () => {
          try {
            const animalsData = await getAnimals();
            setAnimals(animalsData);
          } catch (error) {
            // Trate o erro, talvez com uma notificação
            setToastMessage("Erro ao carregar os dados dos animais.");
          } finally {
            setLoading(false);
          }
        };
        loadData();
      }, []); // O array vazio garante que isso rode apenas uma vez

      // ... resto do componente
    };
    ```

4.  **Implementar Funções de `save` e `delete`:**
    Conecte as funções `saveData` e `handleConfirmDelete` em `DashboardPage.tsx` para fazer chamadas `POST`, `PUT` e `DELETE` para sua API. O frontend já está preparado para enviar os dados no formato correto.

---

## Como Iniciar

Como este projeto não utiliza um passo de build complexo (como Vite ou Webpack), você pode simplesmente abrir o arquivo `index.html` em um navegador moderno ou usar uma extensão de servidor local (como o "Live Server" no VS Code) para servir os arquivos estáticos.

---

## Conclusão

Este frontend é uma base sólida, completa e profissional. Ele atende a todos os requisitos de UI para o sistema de gerenciamento do santuário e está projetado para uma integração rápida e eficiente com o backend Spring Boot.
