const express = require("express");
const prerender = require("prerender-node");

const app = express();

// Configure seu token do Prerender.io
prerender.set("prerenderToken", "wjh34LyrZapzzwChDRpS");

app.use(prerender);

// Sirva os arquivos estáticos da pasta 'public'
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
