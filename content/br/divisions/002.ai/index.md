---
title: "AI"
description: 
entityLink: "entities/eas"
entity: "Verein/EAS"
badge: ["R&D", "MIT/Prop"]
---

- Memória baseada em Git, self-hosted ou no GitHub: Markdown, orientada por IA e indexada com graphify, com compartilhamento granular.
- Orquestramos modelos comerciais e self-hosted via MCP e API.

<!--more-->

**Memória.** O conhecimento da empresa vive em um repositório Git, self-hosted ou no GitHub, em Markdown. Cada mudança é um commit: quem mudou o quê, quando e por quê.

**Índice.** O graphify constrói o grafo dos nós de conhecimento do repositório, assim cada tarefa parte só da informação de que precisa.

**Compartilhamento granular.** Público e privado se separam por nome de arquivo, por mercado e por público: compartilha-se só o que se decide compartilhar.

**Orquestração.** Um roteador leve escolhe o prompt, pega do grafo só as informações e os arquivos necessários e envia o pacote ao modelo que faz o trabalho, comercial ou self-hosted, via MCP ou API. O resultado volta ao roteador.

**Exposição mínima.** Depois de cada chamada a memória de sessão do modelo comercial é apagada e cada chamada leva uma única tarefa isolada: nenhuma conversa contém o panorama completo da empresa. As chamadas ainda passam por uma mesma conta de API e podem ficar registradas; distribuir o trabalho entre vários fornecedores e modelos locais limita quanto cada um vê.

**Decisões do roteador.** Hoje no Vercel AI SDK, passam para o Laya, alternativa open source self-hosted ao Jev da TypeSafe AI: responde a perguntas tipadas com respostas estruturadas e repetíveis, em vez de escrever texto.
