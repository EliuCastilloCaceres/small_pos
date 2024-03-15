import { useEffect, useState } from "react"
import { formatToMoney } from "../../helpers/currencyFormatter"
import './cartActions.css'
import Swal from "sweetalert2"
import Modal from "../../Modal"
import toast, { Toaster } from "react-hot-toast"
import Pay from "./Pay"
import CustomersPicker from "../Customers/CustomersPicker"
import usePetition from "../../hooks/usePetition"
function CartActions({ cartProducts, setCartProducts, cashRegister, setDt, setDtCopy, setSizes, focusInput }) {
    const [data] = usePetition('customers/generic-customer')
    const [discountApplied, setDiscountApplied] = useState({
        amo: 0,
        discType: 0,
        disc: 0

    })
    const [subtotal, setSubtotal] = useState(0)
    const [discountType, setDiscountType] = useState('$')
    const [discountAmount, setDiscountAmount] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalOption, setModalOption] = useState(0)
    const [total, setTotal] = useState(0)
    const [note, setNote] = useState('')
    const [customer, setCustomer] = useState()
    useEffect(() => {
        if (data && data.length > 0) {
            // console.log('gcId: ', data[0].customer_id)
            setCustomer(data[0].customer_id)
        }
    }, [data])
    useEffect(() => {
        if (cartProducts && cartProducts.length > 0) {
            let subtotals = 0
            cartProducts.map(p => {
                //console.log(p.subtotal)
                subtotals += p.subtotal
            })
            parseFloat(subtotals)
            setSubtotal(subtotals)
        } else {
            setSubtotal(0)
            setDiscountApplied({
                amo: 0,
                discType: 0,
                disc: 0

            })
            setTotal(0)
            setNote('')
            setDiscountAmount(0)
            setDiscountType('$')
        }

    }, [cartProducts])
    useEffect(() => {
        if (discountApplied.disc > 0) {
            let disc = subtotal - discountApplied.disc
            //console.log('the total: ', disc)
            setTotal(disc)
        } else {
            setTotal(subtotal)
        }
    }, [subtotal, discountApplied])
    useEffect(() => {
        if (discountApplied.disc > subtotal && discountApplied.discType === '$') {
            setDiscountApplied({
                amo: 0,
                discType: 0,
                disc: 0

            })
            toast('Descuento removido', {
                icon: '⚠️',
            });
        }
        if (discountApplied.amo > 0 && discountApplied.discType === '%') {
            const discApply = (subtotal * discountApplied.amo) / 100
            setDiscountApplied(prevDisc => ({ ...prevDisc, disc: discApply }))
        }
    }, [subtotal])
    const selectCustomer = (c) => {
        setCustomer(c)
        toast.success('Cliente guardado')
    }
    const toggleModal = () => {
        setShowModal(!showModal)
    }
    const emptyCart = () => {
        setCartProducts([])
        setDiscountAmount(0)
        setDiscountType('$')
        setDiscountApplied({
            amo: 0,
            discType: 0,
            disc: 0

        })
        setNote('')
    }



    const askEmptyCart = () => {
        if (cartProducts.length > 0) {
            Swal.fire({
                title: "¿Vaciar Carrito?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Vaciar",
            }).then((result) => {
                if (result.isConfirmed) {
                    setCartProducts([])
                    setDiscountAmount(0)
                    setDiscountType('$')
                    setDiscountApplied({
                        amo: 0,
                        discType: 0,
                        disc: 0

                    })
                    setNote('')

                }
            });

        }


    }
    const addDiscount = () => {
        if (cartProducts.length > 0) {
            setModalTitle('Agregar Descuento')
            setModalOption(1)
            toggleModal()

        }


    }
    const addNote = () => {
        if (cartProducts.length > 0) {
            setModalTitle('Agregar Nota de Orden')
            setModalOption(2)
            toggleModal()

        }


    }
    const chooseCustomer = () => {
        if (cartProducts.length > 0) {
            setModalTitle('Seleccionar Cliente')
            setModalOption(3)
            toggleModal()

        }


    }
    const pay = () => {
        if (cartProducts.length > 0) {
            setModalTitle('Finalizar Venta')
            setModalOption(4)
            toggleModal()

        }


    }
    const handleDiscountChange = (event) => {
        const value = event.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setDiscountAmount(value)
        };
    }
    const handleApplyDiscount = () => {
        if (discountType === '$') {
            if (discountAmount >= 0 && discountAmount <= subtotal) {
                setDiscountApplied(
                    {
                        amo: parseFloat(discountAmount),
                        discType: discountType,
                        disc: parseFloat(discountAmount)

                    }
                )
                toggleModal()
            } else {
                Swal.fire({
                    title: "Monto incorrecto",
                    text: `Monto debe ser menor o igual que el subtotal ${formatToMoney(subtotal)}`,
                    icon: "error"
                });
            }
        } else if (discountType === '%') {
            if (discountAmount >= 0 && discountAmount <= 100) {
                const disc = (subtotal * discountAmount) / 100
                setDiscountApplied(
                    {
                        amo: parseFloat(discountAmount),
                        discType: discountType,
                        disc: parseFloat(disc)

                    }
                )
                toggleModal()
            } else {
                Swal.fire({
                    title: "Monto incorrecto",
                    text: `Monto debe ser menor o igual al 100%`,
                    icon: "error"
                });
            }
        }
    }
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            // Ejecutar la misma lógica que en el evento de clic
            pay()
        }
    }
    const handleNoteChange = (e) => {
        const value = e.target.value
        if (value.length <= 255) {
            setNote(value)
        }
    }
    const handleNoteBlur = () => {

        toast.success('Cambios guardados')

    }
    const handleRemoveDiscount = () => {
        setDiscountApplied({
            amo: 0,
            discType: 0,
            disc: 0

        })
        setDiscountType('$')
        setDiscountAmount(0)
    }
    const renderModalContent = () => {
        if (modalOption === 1) {

            return (
                <div className="add-discount-container">
                    <div className="discount-type-wrapper">
                        <label htmlFor="discount-type" className="form-label">Tipo</label>
                        <select onChange={(e) => { setDiscountType(e.target.value) }} className="form-control" name="discount-type" value={discountType}>
                            <option value="$">$-Fijo</option>
                            <option value="%">%-Porcentaje</option>
                        </select>
                    </div>
                    <div className="discount-amount-wrapper">
                        <label className="form-label">Monto</label>
                        <input onChange={(e) => { handleDiscountChange(e) }} className="form-control" type="text" value={discountAmount} />
                    </div>
                    <button onClick={() => { handleApplyDiscount() }} className="btn btn-primary">Aplicar</button>
                </div>
            )
        }
        else if (modalOption === 2) {
            return (
                <div className="add-note-container">
                    <div className="discount-amount-wrapper">
                        <label className="form-label">Nota</label>
                        <textarea
                            placeholder="La nota no la verá el cliente"
                            onChange={(e) => { handleNoteChange(e) }}
                            onBlur={() => { handleNoteBlur() }}
                            value={note}
                            className="form-control"
                            cols="30"
                            rows="5">
                        </textarea>
                    </div>
                </div>
            )
        }
        else if (modalOption === 3) {
            return (
                <div className="choose-customer-container">
                    <CustomersPicker selectedCustomer={customer} selectCustomer={selectCustomer} />
                </div>
            )
        }
        else if (modalOption === 4) {
            return (
                <Pay
                    cartProducts={cartProducts}
                    discountApplied={discountApplied}
                    subtotal={subtotal}
                    total={total}
                    note={note}
                    customer={customer}
                    cashRegister={cashRegister}
                    emptyCart={emptyCart}
                    toggleModal={toggleModal}
                    setDt={setDt}
                    setDtCopy={setDtCopy}
                    setSizes={setSizes}
                    focusInput={focusInput}
                />
            )
        }
    }
    return (
        <>
            <div className="actions-wrapper">
                <div className="totals">
                    <div className="separator"></div>
                    <div className="subtotal-wrapper d-flex justify-content-between">
                        <div className="subtotal-title">
                            <span>Subtotal:</span>
                        </div>
                        <div className="subtotal">
                            <span><strong>{formatToMoney(subtotal)}</strong></span>
                        </div>
                    </div>
                    <div className="discount-wrapper d-flex justify-content-between align-items-center">
                        <div className="discount-title">
                            <span>Desc:{discountApplied.disc > 0 && discountApplied.discType === '%' ? `(-${discountApplied.amo}%)` : ''}</span>
                            {
                                discountApplied.disc > 0 && (
                                    <button tabIndex={-1} onClick={() => { handleRemoveDiscount() }} className="btn btn-danger">Quitar <i className="bi bi-x"></i></button>
                                )
                            }
                        </div>
                        <div className="discount">

                            <span><strong>-{formatToMoney(discountApplied.disc)}</strong></span>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="total-wrapper d-flex justify-content-between">
                        <div className="total-title">
                            <span>Total:</span>
                        </div>
                        <div className="total">
                            <span><strong>{formatToMoney(total)}</strong></span>
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <div onClick={() => { askEmptyCart() }} className="empty-cart action-item">
                        <span>Vaciar Carrito</span>
                        <i className="bi bi-cart-x"></i>
                    </div>
                    <div onClick={() => {
                        addDiscount()
                    }} className="add-desc action-item">
                        <span>Aplicar Desc</span>
                        <i className="bi bi-tags"></i>
                    </div>
                    <div onClick={() => { addNote() }} className="add-note action-item position-relative">
                        {note.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                            </span>
                        )}
                        <span>Nota</span>
                        <i className="bi bi-pen"></i>
                    </div>
                    <div onClick={() => { chooseCustomer() }} className="suspend-cart action-item">
                        <span>Cliente</span>
                        <i className="bi bi-person-badge-fill"></i>
                    </div>
                    <div onKeyDown={(e) => { handleKeyDown(e) }} onClick={() => { pay() }} className="pay action-item" tabIndex={0}>
                        <span>Pagar</span>
                        <i className="bi bi-cash-coin"></i>
                    </div>
                </div>
            </div>
            <Modal title={modalTitle} showModal={showModal} toggleModal={toggleModal}>
                {renderModalContent()}
            </Modal>
            <Toaster
                position="top-center"
            />
        </>
    )
}

export default CartActions