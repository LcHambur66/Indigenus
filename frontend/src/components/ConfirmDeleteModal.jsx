import * as Dialog from '@radix-ui/react-dialog';

export function ConfirmDeleteModal({ produtoParaExcluir, onClose, onConfirmar }) {
  return (
    <Dialog.Root
      open={Boolean(produtoParaExcluir)}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content confirm-dialog">
          <div className="dialog-header">
            <div>
              <Dialog.Title className="dialog-title">Excluir Produto?</Dialog.Title>
              <Dialog.Description className="dialog-description">
                Tem certeza que deseja remover <strong>{produtoParaExcluir?.nome}</strong> 
                do estoque? Esta ação não poderá ser desfeita.
              </Dialog.Description>
            </div>
          </div>

          <div className="dialog-footer">
            <Dialog.Close className="button secondary" type="button">
              Cancelar
            </Dialog.Close>
            <button
              className="button danger-button"
              type="button"
              onClick={onConfirmar}
            >
              Sim, Excluir
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
