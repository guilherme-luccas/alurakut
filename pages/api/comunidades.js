import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(request, response) {
  if (request.method === "POST") {
    const TOKEN = "d6b7caf1428f0a342eb94e36549998";
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "970780",
      ...request.body,
    });

    response.json({
      dados: "Algum dado qualquer",
      registroCriado: registroCriado,
    });
    return;
  }
  response.status(404).json({
    message: "ainda nao temos nada no GET ,mas no POST tem",
  });
}
