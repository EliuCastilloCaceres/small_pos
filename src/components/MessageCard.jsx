
function MessageCard({message, onClose}) {
    return(
        <div className="alert alert-success alert-dismissible fade show" role="alert">
             <strong>{message}</strong>
             <button onClick={()=>{onClose()}} type="button" className="btn-close"></button>
        </div>
    )
   
}
export default MessageCard