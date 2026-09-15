// Produtos e categorias compartilham o mesmo contrato HTTP de CRUD.
export function recursoController(service) {
  return {
    listar: async (req, res) => res.json(await service.listar()),
    buscar: async (req, res) => res.json(await service.buscar(req.params.id)),
    criar: async (req, res) => {
      const recurso = await service.criar(req.body);
      res.location(`${req.baseUrl}/${recurso.id}`).status(201).json(recurso);
    },
    atualizar: async (req, res) => res.json(await service.atualizar(req.params.id, req.body)),
    excluir: async (req, res) => { await service.excluir(req.params.id); res.status(204).send(); },
  };
}
