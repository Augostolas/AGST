# 📋 Como Copiar Credenciais do Firebase para config.js

## Passo 1: Ir no Firebase Console

Acesse: **https://console.firebase.google.com**

Você vai ver uma tela assim:
```
Seus Projetos Firebase
├─ [Clique no seu projeto]
│  └─ agst-portfolio (ou o nome que criou)
```

Clique no projeto que criou.

---

## Passo 2: Encontrar as Credenciais

Na tela do projeto:
1. Vá para **Settings** (⚙️ roda no canto)
   ```
   [⚙️] Project Settings
   ```

2. Clique na aba **General** (já será a padrão)

3. Scroll down até ver a seção **Your apps**

4. Você verá algo como:
   ```
   Seu aplicativo web
   [Web app icon] agst-portfolio
   ```

5. Clique em **Config** (ou copie o código JavaScript que aparece)

---

## Passo 3: Ver o Config JavaScript

Você vai ver um código assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxyz123abc456def789ghi...",
  authDomain: "agst-portfolio-abc123.firebaseapp.com",
  databaseURL: "https://agst-portfolio-abc123.firebaseio.com",
  projectId: "agst-portfolio-abc123",
  storageBucket: "agst-portfolio-abc123.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

---

## Passo 4: Copiar para seu config.js

Abra o arquivo `config.js` do seu site:
- Está na raiz: `C:\Users\DESKTOP\.copilot\repos\AGST\config.js`

**ANTES** (com placeholders):
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const firebaseEnabled = false;
```

**DEPOIS** (com seus dados reais):
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxyz123abc456def789ghi...",
    authDomain: "agst-portfolio-abc123.firebaseapp.com",
    databaseURL: "https://agst-portfolio-abc123.firebaseio.com",
    projectId: "agst-portfolio-abc123",
    storageBucket: "agst-portfolio-abc123.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789"
};

const firebaseEnabled = true;  // ⚠️ IMPORTANTE: Mudar para TRUE
```

---

## 🎯 Resumo Rápido:

1. ✅ Vai em https://console.firebase.google.com
2. ✅ Abre seu projeto
3. ✅ Clica Settings (⚙️)
4. ✅ Pega o código na aba "General"
5. ✅ Copia tudo de `const firebaseConfig = {...}`
6. ✅ Cola no seu `config.js` substituindo os `YOUR_...`
7. ✅ **MUITO IMPORTANTE**: Muda `firebaseEnabled = false` para `true`
8. ✅ Salva o arquivo
9. ✅ Faz commit e push no GitHub

---

## ⚠️ Pontos Importantes:

- **Não compartilhe sua `apiKey`!** Se commit no público, alguém pode usar.
  - Se fizer isso, regera a chave no Firebase Console
  
- **firebaseEnabled = true** - Isso ativa o sistema globalmente

- **Test Mode** - No Firebase, deixa em Test Mode por enquanto (não é seguro pro futuro)

---

## 🆘 Ainda Confuso?

Quer que eu te ajude a fazer isso? Só me passar:
- O código que você vê no Firebase Console
- Ou uma screenshot
- Ou dizer qual é o nome do seu projeto no Firebase

Eu preencho o `config.js` para você! 😊
