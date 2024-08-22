/// <reference types="cypress" />

const baseUrl = 'https://challenge.primecontrol.com.br/'
const email = 'gutierrezcwb@gmail.com'
const senha = 'primecontrol2024@'
const senhaerrada = 'primecontrol2024@12'
const { fakerPT_BR, faker } = require('@faker-js/faker')

function realizarlogin(email, senha) {
    cy.visit(baseUrl)
    cy.contains('Fazer Login').click()
    cy.get('.form-signin').should('contain.text', 'Login')
    cy.get('#floatingInput').type(email)
    cy.get('#floatingPassword').type(senha)
    cy.get('.w-100').should('contain.text', 'Acessar').click()
    cy.get('html').should('contain.text', 'Gestão de Clientes')
}

function logininvalido(email, senhaerrada) {
    cy.visit(baseUrl)
    cy.contains('Fazer Login').click()
    cy.get('#floatingInput').type(email)
    cy.get('#floatingPassword').type(senhaerrada)
    cy.get('.w-100').should('contain.text', 'Acessar').click()
}

function gerarTelefoneValido() {
    const ddd = Math.floor(11 + Math.random() * 89)
    const prefixo = Math.floor(1000 + Math.random() * 9000)
    const sufixo = Math.floor(1000 + Math.random() * 9000)
    return `${ddd}${prefixo}${sufixo}`
}

function cadastrarCliente(nome, email, cep, numero, endereco, complemento, genero, ferramentas) {
    cy.get('.row > :nth-child(2)').contains('Cadastrar Cliente').click()
    cy.get('.col-md-9 > .form-control').type(nome).should('have.value', nome)
    cy.get('input[type=file]').selectFile('./Cypress/fixtures/upload.jpg', { force: true })
    cy.get(':nth-child(2) > .row > :nth-child(1) > .form-control').type(gerarTelefoneValido())
    cy.get(':nth-child(2) > .row > :nth-child(2) > .form-control').type(email)
    cy.get(':nth-child(3) > .row > :nth-child(1) > .form-control').type(cep)
    cy.get(':nth-child(3) > .row > :nth-child(2) > .form-control').type(numero)
    cy.get(':nth-child(4) > .row > :nth-child(1) > .form-control').type(endereco)
    cy.get(':nth-child(4) > .row > :nth-child(2) > .form-control').type(complemento)
    cy.get(':nth-child(3) > .form-control').select('Brasil')
    cy.get(`input[type="radio"][value="${genero}"]`).check()
    ferramentas.forEach(ferramenta => {
        cy.get(`input[type="checkbox"][value="${ferramenta}"]`).check()
    })
    cy.get(':nth-child(7) > .btn').should('contain.text', 'Salvar').click()
}

function editarCliente(nomeCompleto, novoTelefone) {
    cy.get('tr').contains(nomeCompleto).parents('tr').find('.fas.fa-edit').click()
    cy.get(':nth-child(4) > #exampleInputEmail1').clear().type(novoTelefone)
    cy.get('.text-center').contains('Salvar').click()
}

function excluirCliente(nomeCompleto) {
    cy.get('.row > :nth-child(2)')
    cy.get('tr').contains(nomeCompleto).parents('tr').find('.far.fa-trash-alt').click()
    cy.get('.btn.btn-lg.btn-danger').click()
}

describe('Login', () => {

    it('Criar uma nova conta com sucesso', () => {
        cy.visit(baseUrl)
        cy.contains('Criar uma conta').click()
        cy.get('.form-signin').should('contain.text', 'Criar Conta')
        cy.get('#floatingInput').type(fakerPT_BR.internet.email())
        cy.get('#floatingPassword').type(fakerPT_BR.internet.password())
        cy.get('.w-100').should('contain.text', 'Criar conta').click()
        cy.get('.w-100').should('contain.text', 'Acessar')
        
        cy.screenshot('CT001.jpg')
    })

    it('Validar criação de uma conta com e-mail já cadastrado', () => {
        cy.visit(baseUrl)
        cy.contains('Criar uma conta').click()
        cy.get('.form-signin').should('contain.text', 'Criar Conta')
        cy.get('#floatingInput').type(email)
        cy.get('#floatingPassword').type(senha)
        cy.get('.w-100').should('contain.text', 'Criar conta').click()
        cy.get('.form-signin').should('contain.text', 'Esse email já está em uso por outra conta')

        cy.screenshot('CT002.jpg')
    })

    it('Realizar login com sucesso', () => {
        realizarlogin(email, senha)
        cy.wait(600)

        cy.screenshot('CT003.jpg')
    })

    it('Validar login com senha inválida', () => {
        logininvalido(email, senhaerrada)
        cy.get('.d-flex').should('contain.text', 'E-mail ou senha inválida.')

        cy.screenshot('CT004.jpg')
    })
})

describe('Cadastro e Manutenção de Cliente', () => {
    const nomeCompleto = `${fakerPT_BR.person.firstName()} ${fakerPT_BR.person.lastName()}`
    const emailFaker = fakerPT_BR.internet.email()
    const cep = fakerPT_BR.location.zipCode()
    const numeroResidencia = fakerPT_BR.location.buildingNumber()
    const endereco = fakerPT_BR.location.streetAddress()
    const complemento = fakerPT_BR.location.secondaryAddress()
    const genero = ['masculino', 'feminino', 'outros'][Math.floor(Math.random() * 3)]
    const ferramentas = ['robot', 'selenium', 'cypress', 'appium', 'protractor'].sort(() => 0.5 - Math.random()).slice(0, 2)

    it('Realizar cadastro de cliente na aba Perfil', () => {
        realizarlogin(email, senha)
        cadastrarCliente(nomeCompleto, emailFaker, cep, numeroResidencia, endereco, complemento, genero, ferramentas)
        cy.get(':nth-child(3) > .form-control').select('Brasil')
        cy.get(':nth-child(7) > .btn').click()
        cy.wait(1500)
        cy.screenshot('CT005.jpg')
    })

    it('Realizar busca de cliente recém cadastrado', () => {
        realizarlogin(email, senha)
        cy.wait(1200)
        editarCliente(nomeCompleto, gerarTelefoneValido())

        cy.screenshot('CT006.jpg')
    })

    it('Realizar edição do cliente recém cadastrado', () => {
        realizarlogin(email, senha)
        cy.wait(1200)
        editarCliente(nomeCompleto, gerarTelefoneValido())

        cy.screenshot('CT007.jpg')
    })

    it('Excluir cliente recém cadastrado', () => {
        realizarlogin(email, senha)
        cy.wait(1200)
        excluirCliente(nomeCompleto)
        cy.get(':nth-child(9) > :nth-child(5) > [href="/app/home"] > .far').click()

        cy.screenshot('CT008.jpg')
    })

    it('Validar cadastro de cliente com e-mail inválido', () => {
        const escolhagenero = ['masculino', 'feminino', 'outros'][Math.floor(Math.random() * 3)]
        const escolhaferramentas = ['robot', 'selenium', 'cypress', 'appium', 'protractor'].sort(() => 0.5 - Math.random()).slice(0, 2)
        
        realizarlogin(email, senha)
        cy.get('.row > :nth-child(2)').contains('Cadastrar Cliente').click()
        cy.get('input[type=file]').selectFile('./Cypress/fixtures/upload.jpg', { force: true })
        cy.get(':nth-child(2) > .row > :nth-child(1) > .form-control').type(gerarTelefoneValido())
        cy.get(':nth-child(2) > .row > :nth-child(2) > .form-control').type('naoexiste.c2')
        cy.get('.col-md-9 > .form-control').type(fakerPT_BR.person.firstName())
        cy.get(':nth-child(3) > .row > :nth-child(1) > .form-control').type(fakerPT_BR.location.zipCode())
        cy.get(':nth-child(3) > .row > :nth-child(2) > .form-control').type(fakerPT_BR.location.buildingNumber())
        cy.get(':nth-child(4) > .row > :nth-child(1) > .form-control').type(endereco)
        cy.get(':nth-child(4) > .row > :nth-child(2) > .form-control').type(complemento)
        cy.get(':nth-child(3) > .form-control').select('Brasil')
        cy.get(`input[type="radio"][value="${escolhagenero}"]`).check()
        escolhaferramentas.forEach(ferramenta => {
        cy.get(`input[type="checkbox"][value="${ferramenta}"]`).check()
        })
        cy.get('.titulo > :nth-child(2) > :nth-child(2)').contains('Salvar').click()
        cy.get('.titulo > :nth-child(2) > :nth-child(2)').should('contain.be.visible', 'Inclua um "@" no endereço de e-mail.')

        cy.screenshot('CT009.jpg')
    })

    it('Validação do preenchimento de campos obrigatórios', () => {
        const escolhagenero = ['masculino', 'feminino', 'outros'][Math.floor(Math.random() * 3)]
        const escolhaferramentas = ['robot', 'selenium', 'cypress', 'appium', 'protractor'].sort(() => 0.5 - Math.random()).slice(0, 2)

        realizarlogin(email, senha)
        cy.get('.row > :nth-child(2)').contains('Cadastrar Cliente').click()
        cy.get('input[type=file]').selectFile('./Cypress/fixtures/upload.jpg', { force: true })
        cy.get(':nth-child(2) > .row > :nth-child(1) > .form-control').type(gerarTelefoneValido()).should('contain.text','')
        cy.get(':nth-child(2) > .row > :nth-child(2) > .form-control').type('naoexiste.c2').should('contain.value','naoexiste.c2')
        cy.get('.col-md-9 > .form-control').type(fakerPT_BR.person.firstName()).should('contain.text','')
        cy.get(':nth-child(3) > .row > :nth-child(1) > .form-control').type(fakerPT_BR.location.zipCode()).should('contain.text','')
        cy.get(':nth-child(3) > .row > :nth-child(2) > .form-control').type(fakerPT_BR.location.buildingNumber()).should('contain.text','')
        cy.get(':nth-child(4) > .row > :nth-child(1) > .form-control').type(endereco).should('contain.text','')
        cy.get(':nth-child(4) > .row > :nth-child(2) > .form-control').type(complemento).should('contain.text','')
        cy.get(':nth-child(3) > .form-control').select('Brasil').should('contain.value','')
        cy.get(`input[type="radio"][value="${escolhagenero}"]`).check().should('be.checked')
        escolhaferramentas.forEach(ferramenta => {
        cy.get(`input[type="checkbox"][value="${ferramenta}"]`).check()})
        cy.get('input[type="checkbox"]').should('be.checked')       
            
        cy.screenshot('CT010.jpg')
    })
})

describe('Testes de Upload e Download', () => {
    it('Realiza validação do XML da aba "Fiscal"', () => {
        realizarlogin(email, senha)
        cy.get('.nav').contains('Fiscal').click()
        cy.get('form > :nth-child(1)').contains('Baixar XML')
        cy.wait(500)
        cy.verifyDownload('cliente.xml')
        cy.readFile('cypress/downloads/cliente.xml').should('exist')

        cy.screenshot('CT011.jpg')
    })

    it('Importa o XLS e valida a exibição na tela', () => {
        const fileName = 'arquivoteste.xls'
        realizarlogin(email, senha)
        cy.get('.nav').contains('Gerenciador de Arquivos').click()
        cy.get('input[type="file"]').attachFile(fileName)
        cy.get('.modal-content').contains('Conteúdo do Arquivo Importado')
        cy.get('.close').click()
        cy.get('input[type="file"]').should('contain.value', fileName)
        cy.screenshot('CT012.jpg')
    })
})

describe('Testes de Cadastro de Candidato', () => {
    it('Validar o preenchimento de informações do candidato', () => {
        realizarlogin(email, senha)
        cy.get('html').contains('Finalizar').click({ force: true })
        cy.get('.btn-primary-modal').click()
        cy.get('#nome').type('Leonardo Dos Santos Gutierrez')
        cy.get('#telefone').type('41998983218')
        cy.get('#githubLink').type('emdesenvolvimento')
        cy.get('#nomeRecrutador').type('Kely Alves Silva Garcia')
        cy.screenshot('CT013.jpg')

    })

    it('Realizar logout com sucesso ao clicar em "Finalizar"', () => {
        realizarlogin(email, senha)
        cy.get('html').contains('Finalizar').click({ force: true })
        cy.get('.btn-danger-modal').click()
        cy.get('.form-signin').should('contain.text', 'Login')

        cy.screenshot('CT015.jpg')
    })
})
