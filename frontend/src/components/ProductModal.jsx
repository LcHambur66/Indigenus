import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X, LoaderCircle } from 'lucide-react';

const produtoSchema = z.object({
  nome: z.string().trim().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  categoria: z.string().trim().min(2, 'Informe a categoria do produto.'),
  quantidade: z.coerce.number().int('Informe um número inteiro válido.').min(0, 'A quantidade não pode ser negativa.'),
  preco: z.coerce.number().positive('O preço deve ser maior que zero.'),
});

export function ProductModal({ aberto, onOpenChange, produtoEmEdicao, onSalvar, salvando }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: { nome: '', categoria: '', quantidade: 0, preco: '' },
  });

  useEffect(() => {
    if (aberto) {
      if (produtoEmEdicao) {
        reset({
          nome: produtoEmEdicao.nome,
          categoria: produtoEmEdicao.categoria,
          quantidade: produtoEmEdicao.quantidade,
          preco: Number(produtoEmEdicao.preco),
        });
      } else {
        reset({ nome: '', categoria: '', quantidade: 0, preco: '' });
      }
    }
  }, [aberto, produtoEmEdicao, reset]);

  return (
    <Dialog.Root open={aberto} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-header">
            <div>
              <Dialog.Title className="dialog-title">
                {produtoEmEdicao ? 'Editar Produto' : 'Novo Produto'}
              </Dialog.Title>
              <Dialog.Description className="dialog-description">
                Preencha os campos abaixo para cadastrar ou atualizar o item no estoque.
              </Dialog.Description>
            </div>
            <Dialog.Close className="icon-button close-btn" aria-label="Fechar">
              <X size={18} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSalvar)} className="dialog-form">
            <div className="form-group">
              <label htmlFor="nome">Nome do Produto</label>
              <input
                id="nome"
                {...register('nome')}
                placeholder="Ex.: Teclado Mecânico RGB"
              />
              {errors.nome && <span className="field-error">{errors.nome.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>
              <input
                id="categoria"
                {...register('categoria')}
                placeholder="Ex.: Periféricos"
              />
              {errors.categoria && (
                <span className="field-error">{errors.categoria.message}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade em Estoque</label>
                <input
                  id="quantidade"
                  type="number"
                  min="0"
                  {...register('quantidade')}
                />
                {errors.quantidade && (
                  <span className="field-error">{errors.quantidade.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="preco">Preço Unitário (R$)</label>
                <input
                  id="preco"
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register('preco')}
                />
                {errors.preco && (
                  <span className="field-error">{errors.preco.message}</span>
                )}
              </div>
            </div>

            <div className="dialog-footer">
              <Dialog.Close className="button secondary" type="button">
                Cancelar
              </Dialog.Close>
              <button className="button primary" disabled={salvando}>
                {salvando && <LoaderCircle size={16} className="spin" />}
                {produtoEmEdicao ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
