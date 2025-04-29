# Mega Sena Analyzer

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-brightgreen)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-green)

## 📋 Descrição

Mega Sena Analyzer é uma aplicação web para análise estatística e visualização de resultados da Mega Sena. A plataforma oferece estatísticas detalhadas, recomendações baseadas em análise de dados históricos e visualizações interativas para ajudar os usuários a compreender melhor os padrões dos sorteios.

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **React** (v18.3.1) - Biblioteca JavaScript para construção de interfaces
- **TypeScript** (v5.5.3) - Superset tipado do JavaScript
- **Vite** (v5.4.2) - Ferramenta de build e desenvolvimento
- **Tailwind CSS** (v3.4.1) - Framework CSS utilitário
- **Lucide React** (v0.344.0) - Biblioteca de ícones

## 💻 Componentes Principais

- **Dashboard** - Componente principal que organiza todos os elementos da interface
- **ResultsTable** - Exibe os resultados dos sorteios em formato tabular
- **StatisticsPanel** - Mostra estatísticas detalhadas sobre a frequência dos números
- **NumberFrequencyChart** - Gráfico visual da frequência de cada número
- **AIRecommendationPanel** - Fornece recomendações geradas por algoritmos de análise
- **DateFilter** - Permite filtrar resultados por período específico

## 🔍 Funcionalidades

- Visualização detalhada dos resultados de sorteios anteriores
- Análise estatística de frequência dos números
- Recomendações de jogos baseadas em diferentes metodologias
- Filtros por período para análise específica
- Interface responsiva para acesso em diferentes dispositivos
- Informações atualizadas sobre o próximo sorteio

## 🏁 Como Executar o Projeto

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/mega-sena-analyzer.git
cd mega-sena-analyzer
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse o aplicativo no navegador:
```
http://localhost:5173
```

### Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run lint` - Executa a verificação de linting
- `npm run preview` - Visualiza a versão de produção localmente

## 📦 Estrutura do Projeto

```
mega-sena-analyzer/
├── src/
│   ├── components/         # Componentes React
│   ├── contexts/           # Contextos React para gerenciamento de estado
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Serviços para comunicação com APIs
│   ├── types/              # Definições de tipos TypeScript
│   ├── utils/              # Funções utilitárias
│   ├── App.tsx             # Componente raiz
│   ├── main.tsx            # Ponto de entrada
│   └── index.css           # Estilos globais
├── public/                 # Recursos estáticos
├── index.html              # Arquivo HTML principal
├── tailwind.config.js      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração do TypeScript
├── vite.config.ts          # Configuração do Vite
└── package.json            # Dependências e scripts
```

## 🚀 Deploy

### Deploy na Vercel

Este projeto está configurado para ser facilmente implantado na Vercel:

1. Faça fork deste repositório para sua conta GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
3. Clique em "New Project" e selecione o repositório
4. A Vercel detectará automaticamente que é um projeto Vite/React
5. Clique em "Deploy" e aguarde a conclusão

A Vercel automaticamente configurará:
- Build com `npm run build`
- Diretório de saída como `dist`
- Roteamento SPA para que o React Router funcione corretamente

### Variáveis de Ambiente (se necessário)

Configure suas variáveis de ambiente no dashboard da Vercel:
- Acesse as configurações do projeto
- Vá para a seção "Environment Variables"
- Adicione as variáveis necessárias

## 🧪 Modelo de Dados

O sistema trabalha com os seguintes tipos de dados principais:

- **MegaSenaResult**: Estrutura com dados completos de um sorteio
- **NumberStatistics**: Estatísticas de frequência de cada número
- **RecommendationSet**: Conjunto de números recomendados com justificativa
- **AIAnalysisResult**: Resultados de análise avançada por algoritmos

## 🔒 Aviso Legal

Esta aplicação é apenas para fins informativos e educacionais. Resultados anteriores não garantem resultados futuros. Jogue com responsabilidade.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

