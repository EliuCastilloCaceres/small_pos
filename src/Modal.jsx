import './modal.css'

function Modal({ title, showModal, toggleModal,children }) {
    return (
        <>
            <div className={`modal ${showModal ? 'active' : ''}`}>

                <div className="modal-content">
                    <button tabIndex={-1} onClick={toggleModal} className=" close-modal-btn close-btn btn btn-danger">
                        <i className="bi bi-x-square-fill"></i>
                    </button>
                    <div className="modal-title">
                        <span>{title}</span>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal