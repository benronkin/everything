// -------------------------------
// Globals
// -------------------------------

let modal

const MODAL_STYLE = `
  dialog {
    padding: 20px 30px;
    border: none;
    border-radius: 8px;
    margin: auto;
    max-width: 400px;
    background: var(--gray2);
    color: var(--gray6);
    box-shadow: var(--card-shadow);
  }
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.7);
  }
  #modal-header {
    font-size: 1.4rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 20px;
  }
  #modal-body {
    margin-bottom: 20px;
  }
  #modal-btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin: 40px 0 20px;
  }
  #modal-delete-input {
    width: 100%;
    padding: 8px 10px;
    margin: 0;
    border: 1px solid var(--gray3);
    background: var(--input-bg, var(--gray1));
    color: var(--gray6);
    border-radius: 4px;
  }
  #modal-delete-btn {
    background-color: var(--red3);
    color: var(--danger-text);
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  #modal-cancel-btn {
    background: transparent;
    border: 1px solid var(--gray3);
    color: var(--gray6);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
`
export const MODAL = {
  DELETE: {
    html: `
  	<h3 id="modal-header"></h3>
  	<p id="modal-body"></p>
  	<div id="modal-btn-group">
  		<input id="modal-delete-input" type="password" placeholder="Password" />
			<button id="modal-delete-btn">Delete</button>
			<button id="modal-cancel-btn">Cancel</button>
  	</div>
    <div id="modal-message"></div>`,
    init: function () {
      const modal = document.querySelector('dialog')
      modal.addEventListener('click', handleModalClick)
      document
        .querySelector('#modal-delete-btn')
        .addEventListener('click', handleModalConfirmDeleteClick)
      document
        .querySelector('#modal-cancel-btn')
        .addEventListener('click', handleModalCancelClick)
    },
  },
}

// -------------------------------
// Exported functions
// -------------------------------

/**
 * Create a modal stylesheet and a dialog element
 */
export function initDialog() {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = MODAL_STYLE
  document.head.appendChild(styleSheet)

  const modalEl = document.createElement('dialog')
  document.querySelector('body').appendChild(modalEl)
  modal = document.querySelector('dialog')
}

/*
 * Set modal header and body message
 */
export function setDialog({ type, header, body, id }) {
  modal.innerHTML = type.html
  modal.dataset.target = id
  modal.querySelector('#modal-header').innerHTML = header
  modal.querySelector('#modal-body').innerHTML = body
  type.init()
}

// -------------------------------
// Event listener handlers
// -------------------------------

/**
 * Close modal if clicked outside its visible area
 */
function handleModalClick(e) {
  const dialogDimensions = modal.getBoundingClientRect()
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    modal.close()
  }
}

/**
 * Handle modal confirm delete click
 */
function handleModalConfirmDeleteClick(e) {
  document.dispatchEvent(
    new CustomEvent('delete-confirmed', {
      detail: { id: modal.dataset.target },
    })
  )
}

/**
 * Handle modal cancel click
 */
function handleModalCancelClick(e) {
  e.preventDefault()
  modal.close()
}
