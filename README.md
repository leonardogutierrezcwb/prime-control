 Desafio Prime Control
===================================

Este repositório contém um script de testes para o desafio proposto pela Prime Control, disponível em https://challenge.primecontrol.com.br/.

Versão 1
--------

Foram realizados testes para os cenários descritos no documento de teste fornecido. Durante a execução dos testes, foram encontradas algumas observações importantes que são listadas abaixo:

### Observações

-   CT 001: Ao criar e-mail, o sistema não exibe nenhuma mensagem ou alerta de que o usuário foi criado com sucesso. Apenas o botão "Criar conta" muda para "Acessar".
-   CT 005: A documentação descreve o cadastro de clientes com sucesso na aba "Perfil", mas na home do sistema, a descrição específica é "Cadastrar Cliente". Além disso, ao incluir um novo cliente, não é exibida mensagem de "inclusão efetuada com sucesso".
-   CT 007: Editando qualquer cliente apenas pelo número de celular, foi possível identificar que o sistema não exibe nenhuma mensagem de atualização do cadastro.
-   CT 011: O cenário está errado, pois cita primeiramente para realizar o download d
o XML, que é independente do que é preenchido nos campos da aba "Fiscal".
-   CT 013: O cenário está errado, pois cita para validar o preenchimento de informações do candidato, mas na home do sistema não existe nenhum campo com tal nome. Além disso, ao clicar em "Finalizar" e depois selecionar o botão "Enviar", o sistema carrega um modal de "Informações do Candidato", mas o botão "Fechar" está mal disposto na tela.
-   CT 014: O sistema não possui opção para recuperar senha de acesso.

API
---

A API utilizada para os testes está disponível em neste link[https://api-challenge.primecontrol.com.br/]. 
A documentação da API pode ser encontrada em https://documenter.getpostman.com/view/30055199/2sAXjDdF3m#intro.

Próximos Passos
---------------

-   Corrigir as observações encontradas durante os testes.
-   Realizar novos testes para garantir que as correções foram eficazes.

Espero que isso ajude! Se tiver alguma dúvida ou precisar de mais ajuda, não hesite em perguntar.
