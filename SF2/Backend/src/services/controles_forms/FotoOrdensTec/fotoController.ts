import { Request, Response } from "express";
import prismaClient from "../../../prisma";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";

export class fotoController {
  async handle(req: Request, res: Response) {
    console.log("-> Requisição recebida em /foto");
    try {
      console.log("-> Verificando o corpo da requisição e os arquivos...");
      const { ordemdeServico_id } = req.body;

      if (!req.files || !("file" in req.files)) {
        console.log("-> Erro: Arquivo não enviado ou 'file' não encontrado em req.files.");
        return res.status(400).json({ error: "Arquivo não enviado." });
      }

      console.log(`-> ID da Ordem de Serviço: ${ordemdeServico_id}`);
      console.log("-> Arquivo(s) encontrado(s) em req.files.");

      const uploaded = req.files["file"];

      const files = Array.isArray(uploaded)
        ? (uploaded as unknown as UploadedFile[])
        : [uploaded as UploadedFile];

      const fotos = [];

      for (const file of files) {
        console.log(`-> Iniciando upload do arquivo: ${file.name} para o Cloudinary...`);
        console.log(`-> Caminho temporário do arquivo: ${file.tempFilePath}`);

        const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
          file.tempFilePath,
          { folder: "ordens_servico" }
        );

        console.log("-> Upload para o Cloudinary concluído. URL segura:", uploadResult.secure_url);
        
        const foto = await prismaClient.fotoOrdemServico.create({
          data: {
            url: uploadResult.secure_url,
            ordemdeServico_id,
          },
        });

        console.log("-> Registro no banco de dados criado com sucesso.");
        fotos.push(foto);
      }

      console.log("-> Todos os uploads e registros concluídos. Retornando resposta.");
      return res.json(fotos);
    } catch (error: any) {
      console.error("-> Erro durante a requisição:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  async listByOrdem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const fotos = await prismaClient.fotoOrdemServico.findMany({
        where: { ordemdeServico_id: id },
        orderBy: { created_at: "desc" },
      });

      return res.json(fotos);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  // NOVO MÉTODO -> deletar foto
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Buscar a foto no banco
      const foto = await prismaClient.fotoOrdemServico.findUnique({
        where: { id },
      });

      if (!foto) {
        return res.status(404).json({ error: "Foto não encontrada." });
      }

      // Extrair public_id do Cloudinary (pega o final da URL sem extensão)
      const urlParts = foto.url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const publicId = "ordens_servico/" + fileName.split(".")[0];

      // Deletar do Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Deletar do banco
      await prismaClient.fotoOrdemServico.delete({
        where: { id },
      });

      return res.json({ message: "Foto deletada com sucesso." });
    } catch (error: any) {
      console.error("-> Erro ao deletar foto:", error);
      return res.status(400).json({ error: error.message });
    }
  }
}
