
function MessageCard({message, onClose, type}) {
    return(
        <div className={`alert alert-${type?type:'info'} alert-dismissible fade show`} role="alert">
             <strong>{message}</strong>
             <button onClick={()=>{onClose()}} type="button" className="btn-close"></button>
        </div>
    )
   
}
export default MessageCard